// store all user stats such as x,y,Vx,Vy,size in the database
var pond=[];
var canvas = document.getElementById("fishCanvas");
var ctx = canvas.getContext("2d");
function resize(){
    ctx.canvas.width = window.innerWidth-50;
    ctx.canvas.height = window.innerHeight-50;
}
var player;
var map = {};
// query results
var qR = [];

function setup(){
    $.ajax({
        type: "GET",
        url: '../MySQL/pull.php?table=testTable7&IP=localhost&user=root&db=test1',
        dataType: 'json',
        async: false,
        success: function(result){
            qR = result["query_results"];
            pond =[];
            for (var p=0;p<qR.length; p++){
                //console.log("new fish")
                
                var n = new fish(Number(qR[p]["x"]), Number(qR[p]["y"]), Number(qR[p]["size"]), Number(qR[p]["alive"]), false);
            }
            if (typeof pull("fishid","cache")!== "undefined"){

            }
            player = new fish(Math.floor(Math.random()*300), Math.floor(Math.random()*300), 5, 1, true, (typeof pull("fishid","cache"))==="undefined");
            //console.log(result);
            draw();
        }
    });

    fillPond();
}

function draw(){
    resize()
    // pond must be filled
    ctx.fillStyle="white";
    ctx.fillRect(0,0,canvas.width, canvas.height)
    ctx.fillStyle="black"
    for (thing in pond){
        if (Number(pond[thing]["alive"])===1){
            ctx.beginPath();
            ctx.arc(pond[thing].x, pond[thing].y, pond[thing].size, 0, 2 * Math.PI, true);
            ctx.fill();
        }
    }
}

function checkForCollision(){
    for (var num=0;num<pond.length;num++){
        //console.log(num)
        if ((typeof pond[num]) !== 'undefined' && pond[num].alive===1){
            var x1 = pond[num].x;
            var y1 = pond[num].y;
            var z = pond[num].size;
            for (var v=0; v<pond.length;v++){
                if (typeof pond[v]!== 'undefined'){
                    if (pond[v] !== pond[num] && pond[v].alive === 1){
                        var xdiff = x1 - pond[v].x;
                        var ydiff = y1 - pond[v].y;
                        var rsum = z + pond[v].size;
                        if (Math.abs(xdiff)<rsum&&Math.abs(ydiff)<rsum){
                            //console.log("collision close");
                            var D = Math.sqrt((xdiff*xdiff)*(ydiff*ydiff));
                            if (D > pond[v].size && D < z){
                                // fish 2 inside fish 1
                                kill(pond[num], pond[v]);
                            } else if (D > z && D < pond[v].size){
                                // fish 1 inside fish 2
                                kill(pond[v], pond[num]);
                            } else if (z === pond[v].size){
                                if (pond[v].id>pond[num].id){
                                    kill(pond[v],pond[num]);
                                }
                            }

                        } else{
                            //console.log("no collision");
                        }
                    }
                }
            }
        }
    }
}

function kill(killer, killed){
    killer.size=killer.size + killed.size;
    killer.postz();
    killed.die()

}


function keyPush(evt){
    map[evt.keyCode] = evt.type == "keydown";

    if (map[37]){
        if (player.x+player.size<canvas.width && player.x-player.size>0){
            player.x-=1;
            player.postx()
        }
    }

    if (map[38]){
        if (player.y+player.size<canvas.height && player.y-player.size>0){
            player.y-=1;
            player.posty();
        }
    }

    if (map[39]){
        if (player.x+player.size<canvas.height && player.x-player.size>0){
            player.x+=1;
            player.postx();
        }
    }

    if (map[40]){
        if (player.y+player.size<canvas.height && player.y-player.size>0){
            player.y+=1;
            player.posty();
        } 
    }

}




function fillPond(){
    $.ajax({
        type: "GET",
        url: '../MySQL/pull.php?table=testTable7&IP=localhost&user=root&db=test1',
        dataType: 'json',
        success: function(result){
            qR = result["query_results"];
            pond =[];
            for (var p=0;p<qR.length; p++){
                //console.log("new fish")
                
                var n = new fish(Number(qR[p]["x"]), Number(qR[p]["y"]), Number(qR[p]["size"]), Number(qR[p]["alive"]), false, false);
                if (n.id === player.id){
                    player = n;
                    delete pond[pond.indexOf(n)];
                }
            }
            pond.push(player);

            //console.log(result);
            checkForCollision();
            draw()
            fillPond()
        }
    });
    //console.log(qR.length);
    
}

function fish(x, y, size, alive, isPlayer, insert) {
    if (isPlayer){
        if (typeof pull("fishid","cache")!="undefined"){
            this.id=Number(pull("fishid","cache"));
        } else {
            this.id = pond.length;
            pond.push(this);
            save("fishid",this.id,"cache");
        }
    } else {
        pond.push(this);
        this.id = pond.length;
    }
    this.x = x;
    this.y = y;
    // 1 for alive 0 for dead
    this.alive = alive;
    this.size = 5;
    this.die = function(){
        this.alive = 0;
        $.ajax({
            type:"POST",
            cache: false,
            async: false,
            data: "show=content",
            url:"die.php?id="+this.id,
            success: function(result){

            }

        })
        
    }

    this.revive = function(){
        this.alive = 1;
        $.ajax({
            type:"POST",
            cache: false,
            async: false,
            data: "show=content",
            url:"revive.php?id="+this.id,
            success: function(result){

            }

        })
    }

    this.postx = function(){
        //console.log("moving");
        $.ajax({
            type:"POST",
            cache: false,
            data: "show=content",
            url:"fish.php?x="+this.x+"&A=updatex&id="+this.id,
            success: function(result){

            }

        })
    }
    this.posty = function(){
        //console.log("moving");
        $.ajax({
            type:"POST",
            cache: false,
            data: "show=content",
            url:"fish.php?y="+this.y+"&A=updatey&id="+this.id,
            success: function(result){

            }

        })
    }
    this.postz = function(){
        //console.log("moving");
        $.ajax({
            type:"POST",
            cache: false,
            async: false,
            data: "show=content",
            url:"fish.php?z="+this.id+"&A=updatez&id="+this.id,
            success: function(result){

            }

        })
    }

    if (insert === true){
        $.ajax({
            type:"POST",
            url:"fish.php?x="+this.x+"&y="+this.y+"&alive="+this.alive+"&size="+this.size+"&A=insert&id="+this.id,
            success: function(result){

            }
        })
    }

}
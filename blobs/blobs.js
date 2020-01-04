var canvas = document.getElementById("blobCanvas");
var ctx = canvas.getContext("2d");
ctx.canvas.width = window.innerWidth-30;
ctx.canvas.height = window.innerHeight-30;
var mouseLoc = {};
var board = [];
var feeders = [];
var player;
var paused = false;
var uN = '';
var redux = 0.99;
var qR = [];

function addListeners(){
    if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
        // if device is a mobile device
        canvas.addEventListener("touchstart", function(evt){
            evt.preventDefault()
            var rect = canvas.getBoundingClientRect()
            var touch = evt.touches[0];
            mouseLoc = {
                x:touch.clientX -rect.left,
                y:touch.clientY-rect.top
            }
        })
        canvas.addEventListener("touchmove", function(evt){
            evt.preventDefault();
            var rect = canvas.getBoundingClientRect()
            var touch = evt.touches[0];
            mouseLoc ={
                x:touch.clientX-rect.left,
                y:touch.clientY-rect.top
            }
        })

        } else {
        // device is not a mobile device

        canvas.addEventListener("mousemove",function (evt){
            var rect = canvas.getBoundingClientRect();
            mouseLoc = {
                x: evt.clientX - rect.left,
                y: evt.clientY - rect.top
            };
            //game(ctx);
        });
        
        canvas.addEventListener("mousedown", function(evt){
            for (var n=0;n<board.length;n++){
                board[n].size=2*board[n].size;
            }
        })
        
        canvas.addEventListener("mouseup", function(evt){
            for (var n=0;n<board.length;n++){
                board[n].size=0.5*board[n].size;
            }
        })
    }

    window.addEventListener("keydown",function(evt){
        var key = evt.keyCode;
        if (key === 32){
            // spacebar pressed
            evt.preventDefault();
            paused = !paused;
        }
    })
}

function setup(){
    while (uN === '' || uN === null){
        uN = prompt("Username?(<=25 Characters): ", "")
    }
    //getUserName();
    addListeners();
    player = new blob(canvas.width/2, canvas.height/2, uN);
    postScore(player, "insert");
    setInterval(game, frameRate)
}

function getUserName(){
    paused = true;
    // 8 is delete
    window.addEventListener("keydown", function(evt){
        // 8 is delete
        var keys = {
            65: "a",    66: 'b',
            67: 'c',    68: 'd',
            69: 'e',    70: 'f',
            71: 'g',    72: "h",
            73: "i",    74: "j",
            75: "k",    76: "l",
            77: "m",    78: "n",
            79: "o",    80: "p",
            81: "q",    82: "r",
            83: "s",    84: "t",
            85: "u",    86: "v",
            87: "w",    88: "x",
            89: "y",    90: "z",
            189: '-',   32: " ",
            48: '0',    49: '1',
            50: '2',    51: '3',
            52: '4',    53: '5',
            54: '6',    55: '7',
            56: '8',    57: '9',
            192: '~'
        }
        if (evt.keyCode = 8){
            uN = uN.substr(0,uN.length-2);
        } else if (evt.keyCode = 32){ 
            window.removeEventListener("keydown",function(evt){});
            paused = false;
         } else {
            uN+=keys[evt.keyCode]
        }
    });
    

    ctx.fillStyle = "lightblue";
    topLeft = {
        x: canvas.width/4,
        y: canvas.height/4
    }
    bottomRight = {
        x: canvas.width/2,
        y: canvas.height/2
    }
    ctx.fillRect(topLeft.x, topLeft.y, bottomRight.x, bottomRight.y);
    // text input box
    ctx.fillStyle="black";
    ctx.fillRect(7*canvas.width/24, canvas.height/2, 10*canvas.width/24, canvas.height/8 );
    // username label
    ctx.fillStyle = "black"
    ctx.font = Math.floor(canvas.height/8)+"px Arial";
    ctx.fillText("Username:", 3*canvas.width/10, 2*canvas.height/5);
    // username input text
    ctx.fillStyle ="blue";
    ctx.font = Math.floor(canvas.height/9)+"px Arial";
    ctx.fillText(uN, 7*canvas.width/24+5, canvas.height/2-5)

}


function drawLine(xi,yi,xf,yf, color){
    ctx.strokeStyle=color;
    ctx.beginPath();
    ctx.moveTo(xi,yi);
    ctx.lineTo(xf,yf);
    ctx.stroke();
}

function motion(thing){
    // F=(Gmm)/r^2
    var accel = 1/frameRate;
    var xDiff = (mouseLoc.x - thing.x);
    var yDiff = (mouseLoc.y - thing.y);
    var distance = Math.sqrt((xDiff*xDiff)+(yDiff*yDiff));
    var G = 6.67;
    var a = (Math.sqrt(thing.size)/Math.sqrt(10))*accel;
    

    // acceleration of objects
    if (xDiff>1){
        thing.Vx+=a;
        
    } else if (xDiff<0){
        thing.Vx-=a;
        
    }
    if (yDiff>1){
        thing.Vy+=a;
        
    } else if (yDiff<0){
        thing.Vy-=a;
        
    }    

    if (distance<50){
        thing.Vx=thing.Vx*redux;
        thing.Vy=thing.Vy*redux;
    }

    if (distance<9){
        thing.x=mouseLoc.x;
        thing.y=mouseLoc.y;
        thing.Vx=0;
        thing.Vy=0;
    }

    // adds Velocity to position
    if (thing.x+thing.Vx<=canvas.width && thing.x+thing.Vx>=0){
        thing.x+=thing.Vx;
    }

    if (thing.y+thing.Vy<=canvas.height && thing.y+thing.Vy>=0){
        thing.y+=thing.Vy;
    }

}


function predictedPath(thing){
    var future = {
        x:thing.x,
        y:thing.y,
        Vx:thing.Vx,
        Vy:thing.Vy,
        size:thing.size
    };
    motion(future);
    var future1 = {
        x:future.x,
        y:future.y,
        Vx:future.Vx,
        Vy:future.Vy,
        size:future.size
    };

    for (var n=0;n<100;n++){
        drawLine(future.x, future.y, future1.x, future1.y,"red");
        motion(future);
        var future1 = {
            x:future.x,
            y:future.y,
            Vx:future.Vx,
            Vy:future.Vy,
            size:future.size
        };
        motion(future1);

    }
}

function eat(thing){
    for (var n=0;n<feeders.length;n++){
        var xDiff = thing.x - feeders[n].x;
        var yDiff = thing.y - feeders[n].y;
        var distance = Math.sqrt((Math.pow(xDiff,2)+(Math.pow(yDiff,2))));
        if (distance <= thing.size || distance <= feeders[n].size){
            thing.time = new Date().getTime();
            thing.score += feeders[n].points;
            thing.size += feeders[n].points/feeders[n].size;
            feeders.splice(n,  1);
            new feeder();
            ////// posts score
            postScore(thing, "update");
        }
    }
}

function postScore(thing, action){
    // Commented out January 4 2020 keeps erroring out
    // $.ajax({
    //     type: "POST",
    //     cache: false,
    //     data: "show=content",
    //     url: "blobs.php?userName="+thing.userName+"&score="+thing.score+"&scoreColor="+thing.scoreColor+"&action="+action,
    //     success: function(result){
    //         console.log("score "+ action + " " + result);
    //     }
    // });
}

function removeScore(thing){
    // Commented out January 4 2020 keeps erroring out
    // $.ajax({
    //     type: "DELETE",
    //     cache: false,
    //     data: "show=content",
    //     url: "remove.php?userName="+thing.userName,
    //     success: function(result){
    //         console.log("Player removed");
    //     }
    // })
}

function getPlayers(){
    // Commented out January 4 2020 keeps erroring out
    // $.ajax({
    //     type: "GET",
    //     url: "../MySQL/pull.php?table=testTable12&IP=localhost&user=root&db=test1",
    //     dataType: 'json',
    //     success: function(result){
    //         qR = result['query_results'];
    //         console.log(qR);
    //     }
    // })
}

function scoreBoard(y, thing){
    ctx.font = "20px Arial";
    ctx.fillStyle = thing.scoreColor;
    ctx.fillText(thing.userName + " : " +thing.score, 0, y);
}

function feeder(){
    var posPoints = [0,0,1,1,1,1,1,1,1,1,1,1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,3,3,4,4,4,4,4,4,4,5,5,5,5,5,5,6,6,6,6,6,7,7,7,7,8,8,8,9,9,10];
    var colors = ["rgb(0,0,250)","rgb(0,125,250)","rgb(0,250,250)","rgb(0,250,125)","rgb(0,250,75)","rgb(0,250,0)","rgb(125,250,0)","rgb(250,250,0)","rgb(250,125,0)","rgb(250,75,0)","rgb(250,0,0)"]
    var n = Math.random()
    feeders.push(this);
    this.x = Math.floor(Math.random()*canvas.width);
    this.y = Math.floor(Math.random()*canvas.height);
    this.Vx = 0;
    this.Vy = 0;
    this.size = 5;
    this.points = posPoints[Math.floor(n*posPoints.length)];
    this.color = colors[this.points];
    this.draw = function(){
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI, true);
        ctx.fill();
    }

}

function game(){
    var timeNow = new Date().getTime();
    if (!paused){
        //clear board
        ctx.fillStyle = "white";
        ctx.fillRect(0,0,canvas.width, canvas.height);
        getPlayers();
        for (var n=0;n<board.length;n++){
            //scoreBoard((n+1)*20, board[n]);
            // iterates through all players on the board;
            // generates players next position
            motion(board[n]);
            // predicts players next 100 frames
            predictedPath(board[n]);
            // allows player to eat the feeders
            eat(board[n]);
            // shrinks player;
            if (Math.abs(board[n].time-timeNow) > 1500 ){
                board[n].size=board[n].size*redux;
                board[n].time = timeNow;
                //console.log(board[n].size);
            }

            // draw player
            if (board[n].size > canvas.height/2 || board[n].size > canvas.width/2){
                board[n].size = 5;
            }
            board[n].draw();
        }

        if (feeders.length===0){
            for (var n=0;n<10;n++){
                var g = new feeder();
            }
        }

        for (var n=0;n<feeders.length;n++){
            feeders[n].draw();
        }
        for (var n=0;n<qR.length;n++){
            scoreBoard((n+1)*20, qR[n]);
        }
    }
}


function blob(x, y, userName){
    board.push(this);
    this.userName = userName;
    this.scoreColor = "rgb("+Math.floor(Math.random()*254)+","+Math.floor(Math.random()*254)+","+Math.floor(Math.random()*254)+")";
    this.time = new Date().getTime();
    this.x = x;
    this.y = y;
    this.Vx = 0;
    this.Vy = 0;
    this.size = 10;
    this.color = "black";
    this.score = 0;
    this.draw = function(){
        ctx.strokeStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI, true);
        ctx.stroke();
    };

}
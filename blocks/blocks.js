//keymap
var map = {}

//height and width of player cube
var playerHeight = 20;
var playerWidth = 20;
var colors = ["red","green", "blue","aliceblue","aqua","azure","beige",
            "blueviolet","brown","chartreuse","coral","cornflowerblue",
            "crimson", "cyan", "darkblue", "darkblue","darkcyan","darkgoldenrod",
            "magenta", "darkmagenta","darkolivegreen","darkorange","darkorchid",
            "darkred","darksalmon","darkseagreen","turquoise","deepskyblue","pink",
            "dodgerblue",'firebrick',"forestgreen",'fuchsia',"gold","greenyellow",
            "hotpink","indigo", "ivory","indianred","khaki","lawngreen","lightblue",
            "lightcoral","lightcyan","maroon","purple",'mediumslateblue',"mediumspringgreen",
            "mediumseagreen", "midnightblue","mistyrose","moccasin","navy","olive"
            ]
var players = [];
function player(){
    this.score = 0;
    this.bodyColor = colors[Math.floor(Math.random()*colors.length)];
    this.headColor = colors[Math.floor(Math.random()*colors.length)];
    this.lazerColor= colors[Math.floor(Math.random()*colors.length)];
    this.xPosition=Math.floor(Math.random()*document.getElementById("gameCanvas").width)-playerWidth;
    this.yPosition=Math.floor(Math.random()*document.getElementById("gameCanvas").height)-playerHeight;
    this.xVelocity=0;
    this.yVelocity=0;
    this.headX=0;
    this.headY=0;
    this.superShotTimer=152;
    this.facing="left";
    this.mass=Math.random()+2*Math.random();
    players[players.length] = this;
}

var player1 = {
    score:0,
    bodyColor:"green",
    headColor:"lime",
    lazerColor:"blue",
    xPosition:0,
    yPosition:0,
    xVelocity:0,
    yVelocity:0,
    headX:0,
    headY:0,
    superShotTimer:152,
    facing:"left",
    mass:2
}
players[players.length]=player1;

var player2 = {
    score:0,
    bodyColor:"red",
    headColor:"orange",
    lazerColor:"gold",
    xPosition:document.getElementById("gameCanvas").width-playerWidth,
    yPosition:0,
    xVelocity:0,
    yVelocity:0,
    headX:0,
    headY:0,
    superShotTimer:152,
    facing:"left",
    mass:1
}
players[players.length]=player2

function blockGame() {
    if (player1.superShotTimer > 0){
        player1.superShotTimer--;
    }
    if (player2.superShotTimer > 0){
        player2.superShotTimer--;
    }
    setStats(player1, player2)
    //fills entire canvas as black
    //ctx.fillStyle="black";
    //ctx.fillRect(0,0,canvas.width,canvas.height)
    // iterates through the list of players
    for (var p = 0; p < players.length; p++){
        players[p].xPosition+=players[p].xVelocity;
        players[p].yPosition+=players[p].yVelocity;
        // stops player from going through the sides
        if(players[p].xPosition<0){
            players[p].xPosition=canvas.width;
            //players[p].xVelocity=Math.floor(-0.5*players[p].xVelocity);
        }
        if(players[p].xPosition>canvas.width){
            players[p].xPosition=0;
            //players[p].xVelocity=Math.floor(-0.5*players[p].xVelocity);
        }
        // stops players from going through the floor
        // limits the speed
        if(players[p].xVelocity>19){
            players[p].xVelocity=18;
        }
        if(players[p].xVelocity<-19){
            players[p].xVelocity=-18;
        }
        if(players[p].yVelocity>19){
            players[p].yVelocity=18;
        }
        if(players[p].yVelocity<-19){
            players[p].yVelocity=-18;
        }
        
        //pulls the player to the ground to simulate gravity
        if (players[p].yPosition < canvas.height-playerHeight){
            players[p].yVelocity++;
        }
        // adds bounce on impact with the floor
        if(players[p].yPosition > canvas.height-playerHeight){
            if(players[p].yVelocity > 10){
                players[p].yVelocity=Math.floor(-0.5 * players[p].yVelocity);
            } else {
                players[p].yVelocity=0;
            }
            players[p].yPosition=canvas.height-playerHeight;
        }
        
        
        // bounces the players if they collide
        // glitches if moving the same direction and one lands on the other
        for (var p2=0;p2<players.length;p2++){
            if (isColliding(players[p],players[p2]) && players[p] !== players[p2]){
                
                pyi=players[p].yVelocity;
                pxi=players[p].xVelocity;
                pm=players[p].mass;
                p2yi=players[p2].yVelocity;
                p2xi=players[p2].xVelocity;
                p2m=players[p2].mass;

                if (pxi !== 0 && p2xi !== 0){
                    players[p].xVelocity = p2xi
                    players[p2].xVelocity = pxi
                } else if(pxi === 0) {
                    players[p].xVelocity = p2xi
                    players[p2].xVelocity = pxi
                } else if (p2xi ===0){
                    players[p].xVelocity = p2xi
                    players[p2].xVelocity = pxi
                }
                if (pyi !== 0 && p2yi !==0 ){
                    players[p].yVelocity=p2yi
                    players[p2].yVelocity=pyi
                } else {
                    players[p2].yVelocity= -1*p2yi
                    players[p].yVelocity= -1*pyi
                    if (players[p].yPosition < players[p2].yPosition){
                        players[p].yPosition = players[p2].yPosition-playerHeight;
                    } else if (players[p].yPosition > players[p2].yPosition){
                        players[p2].yPosition = players[p].yPosition-playerHeight;
                    }
                    drawBlocks(players)

                } 
                
                
            // end of collision check
            
            }
            
        //end of players loop
        }
    }
drawBlocks(players)
// END OF BLOCKGAME
}
function drawBlocks(players){
    ctx.fillStyle="black";
    ctx.fillRect(0,0,canvas.width, canvas.height)
    for (var p=0; p<players.length; p++){
    // sets the players' heads
        if (players[p].xVelocity< 0){
            players[p].facing = "left"
            //ctx.fillStyle=players[p].headColor;
            players[p].headX=players[p].xPosition;
            players[p].headY=players[p].yPosition;
            //ctx.fillRect(players[p].headX, players[p].headY, 5, 5)
        }  else if (players[p].xVelocity > 0) {
            players[p].facing="right"
            //ctx.fillStyle=players[p].headColor;
            players[p].headX=players[p].xPosition+15;
            players[p].headY=players[p].yPosition;
            //ctx.fillRect(players[p].headX, players[p].headY, 5, 5)
        }   else if (players[p].facing ==="right") {
            //ctx.fillStyle=players[p].headColor;
            players[p].headX=players[p].xPosition+15;
            players[p].headY=players[p].yPosition;
            //ctx.fillRect(players[p].headX, players[p].headY, 5, 5)
        }   else if (players[p].facing ==="left"){
            //ctx.fillStyle=players[p].headColor;
            players[p].headX=players[p].xPosition;
            players[p].headY=players[p].yPosition;
            //ctx.fillRect(players[p].headX, players[p].headY, 5, 5)
        }
        ctx.fillStyle=players[p].bodyColor;
        ctx.fillRect(players[p].xPosition, players[p].yPosition, playerWidth, playerHeight)
        ctx.fillStyle=players[p].headColor;
        ctx.fillRect(players[p].headX, players[p].headY, 5, 5)
    }
}
function setStats(player1, player2){
    if(player1.superShotTimer > 0){
        document.getElementById("player1Stats").innerHTML="Player 1- Speed: " + Math.floor(Math.sqrt((player1.xVelocity*player1.xVelocity)+(player1.yVelocity*player1.yVelocity))) +" Score: " + player1.score + " Super Shot Timer: " + Math.floor(player1.superShotTimer/15.2);
        
    } else {
        document.getElementById("player1Stats").innerHTML="Player 1- Speed: " + Math.floor(Math.sqrt((player1.xVelocity*player1.xVelocity)+(player1.yVelocity*player1.yVelocity))) +" Score: " + player1.score + " Super Shot: Ready!";
        
    }
    if(player2.superShotTimer > 0){
        document.getElementById("player2Stats").innerHTML="Player 2- Speed: " + Math.floor(Math.sqrt((player2.xVelocity*player2.xVelocity)+(player2.yVelocity*player2.yVelocity))) +" Score: " + player2.score+ " Super Shot Timer: " + Math.floor(player2.superShotTimer/15.2);
    } else {
        document.getElementById("player2Stats").innerHTML="Player 2- Speed: " + Math.floor(Math.sqrt((player2.xVelocity*player2.xVelocity)+(player2.yVelocity*player2.yVelocity))) +" Score: " + player2.score + " Super Shot: Ready!";
    }
}
function isColliding(player1, player2){
    return (player1.xPosition < player2.xPosition +playerWidth && player1.xPosition+playerWidth > player2.xPosition &&
            player1.yPosition < player2.yPosition + playerHeight && player1.yPosition+playerHeight > player2.yPosition)
}
function shoot(player, beamHeight){
    if (player === 1){
        if (player1.headX > player1.xPosition){
            // shoots the lazer from the player to the right end of the screen
            ctx.fillStyle=player1.lazerColor;
            ctx.fillRect(player1.headX+5, player1.headY, canvas.width-player1.headX,beamHeight)
            if(player1.headX < player2.xPosition && player2.yPosition===player1.headY){
                //if player 2 is to the right of player 1 and at the same height
                if (player2.score >0){
                    player2.score--;
                }
                player1.score++;
                setStats(player1, player2)
            }else if(player1.headX < player2.xPosition && player1.headY+beamHeight > player2.yPosition && player1.headY <= player2.yPosition+playerHeight){
                // if player 2 is to the right of player 1 and player1.headX is between the top and bottom of player 2
                if (player2.score >0){
                    player2.score--;
                }
                player1.score++;
                setStats(player1, player2)
            } else {
                //shot missed
                //console.log("missed")
            }
        } else {
            // shoots the lazer from the player to the right end of the screen
            ctx.fillStyle=player1.lazerColor;
            ctx.fillRect(0, player1.headY, player1.headX, beamHeight)
            
            if(player1.headX > player2.xPosition && player2.yPosition===player1.headY){
                if (player2.score >0){
                    player2.score--;
                }
                player1.score++;
                setStats(player1, player2)
            }else if(player1.headX > player2.xPosition && player1.headY+beamHeight > player2.yPosition && player1.headY <= player2.yPosition+playerHeight){
                if (player2.score >0){
                    player2.score--;
                }
                player1.score++;
                setStats(player1, player2)
            } else {
                //shot missed
                //console.log("missed")
            }
        }
    } else if (player === 2) {
        if (player2.headX > player2.xPosition){
            // shoots the lazer from the player to the right end of the screen
            ctx.fillStyle=player2.lazerColor;
            ctx.fillRect(player2.headX+5, player2.headY, canvas.width-player2.headX,beamHeight)
            if(player2.headX < player1.xPosition && player1.yPosition===player2.headY){
                if (player1.score > 0){
                    player1.score--;
                }
                player2.score++;
                setStats(player1, player2)
            }else if(player2.headX < player1.xPosition && player2.headY > player1.yPosition+beamHeight && player2.headY <= player1.yPosition+playerHeight){
                if (player1.score > 0){
                    player1.score--;
                }
                player2.score++;
                setStats(player1, player2)
            } else {
                // shot missed
                //console.log("missed")
            }
        } else {
            // shoots the lazer from the player to the right end of the screen
            ctx.fillStyle=player2.lazerColor
            ctx.fillRect(0, player2.headY, player2.headX, beamHeight)
            if(player2.headX > player1.xPosition && player1.yPosition===player2.headY){
                if (player1.score > 0){
                    player1.score--;
                }
                player2.score++;
                setStats(player1, player2)
            }else if(player2.headX > player1.xPosition && player2.headY > player1.yPosition+beamHeight && player2.headY <= player1.yPosition+playerHeight){
                if (player1.score > 0){
                    player1.score--;
                }
                player2.score++;
                setStats(player1, player2)
            } else {
                //shot missed
                //console.log("missed")
            }
        }
    }
}

function keyPush(evt){
    //keeps map of whether or not keys are being pushed down
    map[evt.keyCode] = evt.type == "keydown";
    //console.log(map);
    if (map[38] || map[32]){
        // jump player 1
        players[0].yVelocity=-9
    }
    if (map[87]){
        // jump player 2
        players[1].yVelocity=-9
    }
    if (map[40]){
        // smash down player 1
        if (players[0].yPosition < canvas.height-playerHeight){
            players[0].yVelocity=players[0].yVelocity+15
        }
    }
    if (map[83]){
        // smash down player 2
        if (players[1].yPosition < canvas.height-playerHeight){
            players[1].yVelocity=players[1].yVelocity+15
        }
    }
    if (map[37]){
        // accel left player 1
        if(players[0].xVelocity>5){
            players[0].xVelocity=0;
        }
        players[0].xVelocity--;
    }
    if (map[65]){
        // accel left player 2
        if(players[1].xVelocity>5){
            players[1].xVelocity=0;
        }
        players[1].xVelocity--;
    }
    if (map[39]){
        // accel right player 1
        if(players[0].xVelocity<-5){
            players[0].xVelocity=0;
        }
        players[0].xVelocity++;
    }
    if (map[68]){
        // accel right player 2
        if(players[1].xVelocity<-5){
            players[1].xVelocity=0;
        }
        players[1].xVelocity++;
    }
    if (map[16]){
        // stop horizontal motion both players
        for (var p=0; p<players.length; p++){
            players[p].xVelocity=0;
        }
    }
    if (map[18]){
        // player 1 shoots
        shoot(1, 3)
    }
    if (map[70]){
        // player 2 shoots
        shoot(2, 3)
    }
    if (map[48]){
        players[0].score = 0;
        players[1].score = 0;
        setStats(player1, player2)
    }
    if (map[191]){
        // player 1 super shot
        if (player1.superShotTimer === 0){
            shoot(1,10)
            player1.superShotTimer=152
        }
    }
    if (map[69]){
        // player 2 super shot
        if (players[1].superShotTimer===0){
            shoot(2, 10)
            players[1].superShotTimer=152
        }
    }
}
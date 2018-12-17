var canvas = document.getElementById("lifeCanvas");
var ctx = canvas.getContext("2d");

var redux = 20;
var size = 10;
ctx.canvas.width = window.innerWidth - redux;
ctx.canvas.height = window.innerHeight - redux;

var rows = Math.floor(canvas.height/size);
var cols = Math.floor(canvas.width/size);

// frames per second
var fps = 6;
var frameRate = 1000/fps;

var board = [];
// number of alive neighbors
var aNBoard=[];
// board history
var prevBoards = [];

//initial setup
var init = 0;

var showGrid = false;

//tracks mouse location
var mouseLoc;
var mouseDown = false;
var currBlock;
var paused = false;

// game settings
var chances = [0,0,1,0,1,0,1,0,1,0]
var B = [3];
var S = [2,3];



function setup(){
    init++;
    for (var r=0;r<rows;r++){
        for (var c=0;c<cols;c++){
            var Cell = new cell(c, r, size, chances[Math.floor(Math.random()*chances.length)]);
            board.push(Cell);
        }
    }
    if (init === 1){
        addListeners();
        setInterval(game, frameRate);
    }
    
};

function addListeners(){
    window.addEventListener("keydown",function(evt){
        evt.preventDefault();
        var key = evt.keyCode;
        if (key === 32 || key === 13){
            paused = !paused;
        } else if (key === 67){
            for (var b=0;b<board.length;b++){
                board[b].alive = 0;
            }
        } else if (key === 82){
            ctx.canvas.width = window.innerWidth - redux;
            ctx.canvas.height = window.innerHeight - redux;
            rows = Math.floor(canvas.height/size);
            cols = Math.floor(canvas.width/size);
            board = [];
            aNBoard = [];
            setup();
        } else if (key === 71){
            showGrid = !showGrid;

        }
        if ((key === 39) && paused){
            //prevBoards.push(board);
            for (var r=0;r<rows;r++){
                for (var c=0;c<cols;c++){
                    // creates board with matching locations for
                    // number of alive neighbors
                    aNBoard[idx(c,r)]=board[idx(c,r)].aliveNeighbors();
    
                }
            }
            for (var p=0;p<aNBoard.length;p++){
                if (S.indexOf(aNBoard[p])>=0 && board[p].alive===1){
                    // survives
                    
                } else if (B.indexOf(aNBoard[p])>=0){
                    //born
                    board[p].alive=1;
                } else{
                    board[p].alive=0;
                }
            }
        } else if (key===37) {
            //board = prevBoards.pop();
        }
    });

    canvas.addEventListener("mousemove",function(evt){
        var rect = canvas.getBoundingClientRect();
        mouseLoc = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        }
        if (mouseDown&& board[idx(mouseLoc.x,mouseLoc.y)]!== currBlock){
            var x = Math.floor(mouseLoc.x/size);
            var y = Math.floor(mouseLoc.y/size);
            board[idx(x,y)].alive = Math.abs(board[idx(x,y)].alive-1);
            currBlock = board[idx(x,y)];
        }
    })

    canvas.addEventListener("mouseup",function(evt){
        mouseDown = false;
    })

    window.addEventListener("mousedown",function(evt){
        mouseDown = true;
        var x = Math.floor(mouseLoc.x/size);
        var y = Math.floor(mouseLoc.y/size);
        board[idx(x,y)].alive = Math.abs(board[idx(x,y)].alive-1);
        currBlock = board[idx(x,y)]
    })
}

function idx(x, y){
    if (x < 0 || y < 0 || x > cols-1 || y > rows-1){
        
        return -1;
    }
    return x + y * cols;
    
}

function cacheBoard(board){
    for (var n=0;n<board.length;n++){
        prevBoards[prevBoards.length-1]={
            x: board[n].x,
            y: board[n].y,
            size: board[n].size,
            alive:board[n].size,
            draw:board[n].draw(),
            aliveNeighbors:board[n].aliveNeighbors()

        }
    }
}

function sum(list){
    s=0;
    for (var p=0;p<list.length;p++){
        s+=list[p];
    }
    return s;
}

function game(){
    if (!paused){
        //add board to prevBoards;
        //prevBoards.push(board);
        for (var r=0;r<rows;r++){
            for (var c=0;c<cols;c++){
                // creates board with matching locations for
                // number of alive neighbors
                aNBoard[idx(c,r)]=board[idx(c,r)].aliveNeighbors();

            }
        }
        for (var p=0;p<aNBoard.length;p++){
            if (S.indexOf(aNBoard[p])>=0 && board[p].alive===1){
                // survives
                
            } else if (B.indexOf(aNBoard[p])>=0){
                //born
                board[p].alive=1;
            } else{
                board[p].alive=0;
            }


            board[p].draw();
        }
        
    } else if (paused){
        for (var p=0;p<board.length;p++){
            board[p].draw();
        }
    }
    if (sum(aNBoard)===0){
        ctx.fillStyle = "black";
        ctx.font="20px Arial";
        ctx.fillText("No Life Remaining!", 0, 20)
    }
}


function fillBoard(r, sides, color){
    for (var row=0;row<rows;row++){
        for (var col=0;col<cols;col++){
            if (sides%2===0 && row%2!==0){
                var i = 2*r*(col)*Math.cos(2*Math.PI/(2*sides))-r;
            } else {
                var i = 2*r*col*Math.cos(2*Math.PI/(2*sides));
            }
            var j = 2*row*Math.cos(2*Math.PI/(2*sides))*r;
            //console.log("i:"+i);
            //console.log("j:"+j)
            inscribedPolygon(r,i,j,sides,color,true)
        }
    }
}

function inscribedPolygon(r, x, y, sides, color, T){
    // default input values
    var filled;
    var color;
    var T;
    if (arguments.length === 5){
        filled = true;
    } else {
        filled = arguments[5]
    }
    if (arguments.length === 4){
        color = "black";
    } else {
        color = arguments[4];
    }
    if (arguments.length === 6){
        T = Math.PI/2;
    } else {
        T = arguments[6];
    }

    var dT = 2*Math.PI/sides;
    var points = [];
    for (var g=0;g<sides;g++){
        var px = x+ Math.cos(T+dT*g) * r// + x;
        var py = y- Math.sin(T+dT*g) * r// + y;
        var n = {
            'x':px,
            'y':py
        }
        points.push(n);
    }
    //console.log(points);
    
    for (var p=1;p<=points.length;p++){
        if (filled){
            ctx.fillStyle = color;
        } else {
            ctx.strokeStyle = color
        }
        
        if (p==1){
            ctx.beginPath();
            var xi = points[p-1].x;
            var yi = points[p-1].y;
            var xf = points[p].x;
            var yf = points[p].y;
            ctx.moveTo(xi,yi);
            ctx.lineTo(xf,yf);

        } else if (p<points.length){
            var xf = points[p].x;
            var yf = points[p].y;
            ctx.lineTo(xf,yf);

        } else if (p===points.length){
            if (filled){
                ctx.closePath();
                ctx.fill();
            } else {
                ctx.lineTo(points[0].x, points[0].y);
                ctx.stroke();
            }

        }
    };
    //show first point with black box
    //ctx.fillStyle = "black";
    //ctx.fillRect(points[0].x, points[0].y, 15,15);
}

function drawLine(x, y, xf, yf, color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(xf,yf);
    ctx.stroke();

}

function cell(x,y,size, alive){
    // alive is either 0 or 1;
    this.x=x;
    this.y=y;
    this.size=size;
    this.alive=alive;
    this.aliveNeighbors = function(){
        var ans = 0;
        var upLeft = board[idx(this.x-1, this.y-1)];
        var up = board[idx(this.x, this.y-1)];
        var upRight = board[idx(this.x+1, this.y-1)];
        var left = board[idx(this.x-1, this.y)];
        var downLeft = board[idx(this.x-1,this.y+1)];
        var down = board[idx(this.x, this.y+1)];
        var downRight = board[idx(this.x+1, this.y+1)];
        var right = board[idx(this.x+1, this.y)];

        if (upLeft && upLeft.alive){
            ans+=1;
        }
        if (up && up.alive){
            ans+=1;
        }
        if (upRight && upRight.alive){
            ans+=1;
        }
        if (left && left.alive){
            ans+=1;
        }
        if (downLeft && downLeft.alive){
            ans+=1;
        }
        if (downRight && downRight.alive){
            ans+=1;
        }
        if (down && down.alive){
            ans+=1;
        }
        if (right && right.alive){
            ans+=1;
        }
        return ans;
    };

    this.draw = function(){
        if (this.alive){
            ctx.fillStyle = "black";
        } else {
            ctx.fillStyle = "white";
        }
        ctx.fillRect(this.x*size,this.y*size,size,size);
        
        if (showGrid){
            drawLine(this.x*size,this.y*size,this.x*size+size,this.y*size, "rgb(1,1,1)");
            drawLine(this.x*size+size,this.y*size,this.x*size+size,this.y*size+size, "rgb(1,1,1)");
            drawLine(this.x*size+size,this.y*size+size,this.x*size,this.y*size+size, "rgb(1,1,1)");
            drawLine(this.x*size,this.y*size+size,this.x*size,this.y*size, "rgb(1,1,1)");
        }
        
    }
}


//runs on import

setup();
//addListeners();
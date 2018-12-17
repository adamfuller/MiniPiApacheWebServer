var canvas=document.getElementById("mazeCanvas");
var ctx=canvas.getContext("2d");

// height and width of sections of the map
// lower generates high detail mazes
var size = 40;
//number of columns
var cols = Math.floor(canvas.width/size);
// number of rows
var rows = Math.floor(canvas.height/size);

// symbolic list of the points on the map
var map = [];
// keeps track of the current location on the map
var current;
// color to mark progress of visited spots
var visitedColor = "white";
// color of walls
var wallColor = "black";
// background color
var backgroundColor = "black";
// color of marked cells
var markedColor = "red";
// color of the player
var playerColor = "blue";
// color of the solution path
var solutionColor = "lightgray";
// stores current player cell
var currentPlayer;
// stack of cells
var stack = [];
// marks the "end" of the maze
var end;
// marks the "beginning" of the maze
var beginning;
// random beginning and end
var useRandom = false;

////// variables for solving the maze
// stack of cells for solution
var solveStack = [];
// current location of solution finder on board
var solveCurrent;
// next location of solution finder
var solveNext;
// number of trys to solve maze
// higher is more intensive
var solveTurns = 300;
// current solve turn
var solveTurn = 0;
// whether or not solution is shown on maze
var solutionShown = false;

function setup() {

    for (var a = 0; a<rows; a++){
        for (var b = 0; b<cols; b++){
            var cell = new Cell(b,a)
            map.push(cell);
        }
    }
    current = map[0];
    if (useRandom){
        end = map[Math.round(Math.random()*(map.length-1))];
        
        b = Math.round(Math.random()*(map.length-1));
        while (map[b] === end){
            b = Math.round(Math.random()*(map.length-1));
        }
        beginning = map[b];
    } else {
        end = map[map.length-1];
        beginning = map[0]
    }
    end.marked = true;
    beginning.marked = true;
    currentPlayer = beginning;
    currentPlayer.player=true;
}


function solveMaze(){
    solveStack = [];
    solveTurn = 0;
    solveNext = undefined;
    for (x=0; x<map.length; x++){
        for (n=0; n<map[x].walls.length; n++){
            map[x].possibleMoves[n] = !map[x].walls[n];
        }
    }

    solveCurrent = currentPlayer;
    solveStack.push(solveCurrent);
    //console.log(solveCurrent);
    //for (num=0; num<400; num++){
    try {
        while (solveCurrent !== end){

            if (solveNext) {
                solveStack.push(solveCurrent);
                ctx.fillRect(solveNext.x*size, solveNext.y*size, size,size)
            }
            if (!solveCurrent.walls[0] && solveCurrent.possibleMoves[0]){
                // can move up
                solveCurrent.possibleMoves[0] = false;
                // picks block upwards
                solveNext = map[idx(solveCurrent.x, solveCurrent.y-1)]
                solveNext.possibleMoves[2] = false;

            }
            else if (!solveCurrent.walls[1] && solveCurrent.possibleMoves[1]){
                // can move to the right
                solveCurrent.possibleMoves[1] = false;
                // picks block to the right
                solveNext = map[idx(solveCurrent.x+1, solveCurrent.y)]
                solveNext.possibleMoves[3] = false;

            }
            else if (!solveCurrent.walls[2] && solveCurrent.possibleMoves[2]){
                // can move down
                solveCurrent.possibleMoves[2] = false;
                // picks block below
                solveNext = map[idx(solveCurrent.x, solveCurrent.y+1)]
                solveNext.possibleMoves[0] = false;
            }
            else if (!solveCurrent.walls[3] && solveCurrent.possibleMoves[3]){
                // can move left
                solveCurrent.possibleMoves[3] = false;
                // picks block to the left
                solveNext = map[idx(solveCurrent.x-1, solveCurrent.y)]
                solveNext.possibleMoves[1] = false;
            } else {
                solveNext = undefined;
            }

            ctx.fillStyle=solutionColor;
            
            solveCurrent.reveal();
            if (solveNext){
                solveCurrent = solveNext;
            } else {
                solveCurrent = solveStack.pop()
            }
            //console.log(solveStack)
            //console.log(solveCurrent)
            solveTurn++;
            //console.log(solveTurn)
            //console.log(solveStack);
            
        }
    } catch(err) {
        solveStack = [];
        solveTurn = 0;
        solveNext = undefined;
        for (x=0; x<map.length; x++){
            for (n=0; n<map[x].walls.length; n++){
                map[x].possibleMoves[n] = !map[x].walls[n];
            }
        }

        solveCurrent = currentPlayer;
        solveStack.push(solveCurrent);
        while (solveCurrent !== end){

            if (solveNext) {
                solveStack.push(solveCurrent);
                ctx.fillRect(solveNext.x*size, solveNext.y*size, size,size)
            }
            if (!solveCurrent.walls[3] && solveCurrent.possibleMoves[3]){
                // can move left
                solveCurrent.possibleMoves[3] = false;
                // picks block to the left
                solveNext = map[idx(solveCurrent.x-1, solveCurrent.y)]
                solveNext.possibleMoves[1] = false;
            }
            else if (!solveCurrent.walls[2] && solveCurrent.possibleMoves[2]){
                // can move down
                solveCurrent.possibleMoves[2] = false;
                // picks block below
                solveNext = map[idx(solveCurrent.x, solveCurrent.y+1)]
                solveNext.possibleMoves[0] = false;
            }
            else if (!solveCurrent.walls[1] && solveCurrent.possibleMoves[1]){
                // can move to the right
                solveCurrent.possibleMoves[1] = false;
                // picks block to the right
                solveNext = map[idx(solveCurrent.x+1, solveCurrent.y)]
                solveNext.possibleMoves[3] = false;
            }
            else if (!solveCurrent.walls[0] && solveCurrent.possibleMoves[0]){
                // can move up
                solveCurrent.possibleMoves[0] = false;
                // picks block upwards
                solveNext = map[idx(solveCurrent.x, solveCurrent.y-1)]
                solveNext.possibleMoves[2] = false;
            } else {
                solveNext = undefined;
            }

            ctx.fillStyle=solutionColor;
            
            solveCurrent.reveal();
            if (solveNext){
                solveCurrent = solveNext;
            } else {
                solveCurrent = solveStack.pop()
            }
            //console.log(solveStack)
            //console.log(solveCurrent)
            solveTurn++;
            //console.log(solveTurn)
            //console.log(solveStack);
            
        }
        console.log(err);
    }
    solveCurrent.reveal();

}


function showSolvedMaze(){
    // use recursive back tracking
    // and right turn rule to solve the maze
    // movement priority right, up, left, down
    
    for (var p=0;p<map.length;p++){
        var block=map[p]
        selfInSolution = solveStack.indexOf(block)>0;
        rightInSolution = solveStack.indexOf(map[idx(block.x+1,block.y)]) >0 || map[idx(block.x+1,block.y)] === currentPlayer;
        topInSolution = solveStack.indexOf(map[idx(block.x,block.y-1)])>0 || map[idx(block.x,block.y-1)] === currentPlayer;
        leftInSolution = solveStack.indexOf(map[idx(block.x-1,block.y)])>0 || map[idx(block.x-1,block.y)] === currentPlayer;
        bottomInSolution = solveStack.indexOf(map[idx(block.x,block.y+1)])>0 || map[idx(block.x,block.y+1)] === currentPlayer;
        topWall = block.walls[0]
        rightWall = block.walls[1]
        bottomWall = block.walls[2]
        leftWall = block.walls[3]

        // fills in some missing intersections
        if (!selfInSolution && rightInSolution && leftInSolution && !rightWall && !leftWall){
            block.showSolution();
        } else if ( !selfInSolution && rightInSolution && topInSolution && !rightWall && !topWall ){
            block.showSolution();
        }   else if ( !selfInSolution && leftInSolution && topInSolution && !leftWall && !topWall ){
            block.showSolution();
        } else if ( !selfInSolution && rightInSolution && bottomInSolution && !rightWall && !bottomWall ){
            block.showSolution();
        } else if ( !selfInSolution && leftInSolution && bottomInSolution && !leftWall && !bottomWall ){
            block.showSolution();
        } else if ( !selfInSolution && bottomInSolution && topInSolution && !bottomWall && !topWall ){
            block.showSolution();
        } else if ( !selfInSolution && map[idx(block.x,block.y+1)] === end && !bottomWall && topInSolution && !topWall){
            block.showSolution();
        } else if ( !selfInSolution && map[idx(block.x,block.y-1)] === end && !bottomWall && bottomInSolution && !topWall){
            block.showSolution();
        } else if ( !selfInSolution && map[idx(block.x-1,block.y)] === end && !leftWall && leftInSolution && !rightWall){
            block.showSolution();
        } else if ( !selfInSolution && map[idx(block.x+1,block.y)] === end && !rightWall && rightInSolution && !leftWall){
            block.showSolution();
        }
        
        
    }
    for (var s=0;s<solveStack.length;s++){
        solveStack[s].showSolution();
    }
    wallColor = backgroundColor;
    //console.log(solveStack);
}

function generateMaze(){
    //draws the cells
    for (var m=0;m<map.length;m++){
        map[m].reveal();
    }


    current.visited = true;
    // step 1
    var next = current.findNext();
    if (next) {
        next.visited = true;

        stack.push(current);

        // step 3
        //remove wall between current and next;
        removeWalls(current, next);

        current = next;
    } else if (stack.length > 0){
        current = stack.pop();
    }
    
    while (stack.length > 0 && current !== map[0]){
        //console.log("current is 0")
        //draws the cells
        for (var m=0;m<map.length;m++){
            map[m].reveal();
        }

        current.visited = true;
        
        var next = current.findNext();
        if (next) {
            next.visited = true;

            stack.push(current);

            // step 3
            //remove wall between current and next;
            removeWalls(current, next);

            current = next;
        } else if (stack.length > 0){
            current = stack.pop();
        } 
    }
}

function drawMaze(){
    //fills map in chosen color
    ctx.fillStyle=backgroundColor;
    ctx.fillRect(0,0, canvas.width, canvas.height);
    //draws the cells
    for (var m=0;m<map.length;m++){
        map[m].reveal();
    }
}


function drawLine(xi,yi,xf,yf){
    ctx.strokeStyle=wallColor;
    ctx.beginPath();
    ctx.moveTo(xi,yi);
    ctx.lineTo(xf,yf);
    ctx.stroke();
}

function removeWalls(a, b) {
    var  xDiff = a.x - b.x;
    if (xDiff === 1){
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (xDiff === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    var yDiff = a.y - b.y;
    if (yDiff === 1){
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (yDiff === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }

}



function movePlayer(evt){
    /* 
    to simulate keypress use
    obj = {keyCode: 37}
    movePlayer(obj)
    */
    x = currentPlayer.x*size;
    y = currentPlayer.y*size;
    i = currentPlayer.x
    j = currentPlayer.y

    keyPushed = evt.keyCode;
    if (keyPushed === 37) {

        if(currentPlayer.walls[3] === false) {
            map[idx(i-1,j)].player=true;
            currentPlayer.player = false;
            currentPlayer = map[idx(i-1,j)]
        }

    }
    if (keyPushed === 38) {

        if(currentPlayer.walls[0] === false) {
            map[idx(i,j-1)].player=true;
            currentPlayer.player = false;
            currentPlayer = map[idx(i,j-1)];
        }
    }
    if (keyPushed === 39) {

        if(currentPlayer.walls[1] === false) {
            map[idx(i+1,j)].player=true;
            currentPlayer.player = false;
            currentPlayer = map[idx(i+1,j)];
        }
    }
    if (keyPushed === 40) {
        if(currentPlayer.walls[2] === false) {
            map[idx(i,j+1)].player=true;
            currentPlayer.player = false;
            currentPlayer = map[idx(i,j+1)];
        }
    }
    if (keyPushed === 13){
        // enter
        if (confirm("New Maze?")){
            // generates new maze
            clearInterval(intID);
            map = []
            stack = []
            setup()
            generateMaze();
            drawMaze();
        } else {
            // no new maze
        }
    }
    if (keyPushed === 32){
        if (solveNum === 0){
            solveMaze()
            intID = setInterval(runSolution, 120)
        }
    }
    if (currentPlayer === end ){
        drawMaze();
        
        alert("Congratulations!");
        map = []
        stack = []
        setup()
        generateMaze();
    }
    drawMaze();
    if (solutionShown) { 
        solveMaze()
        showSolvedMaze();
    }
}

function idx(i, j){
    if (i < 0 || j < 0 || i > cols-1 || j > rows-1){
        return -1;
    }
    return i + j * cols;
}

function Cell(x, y){
    // x coordinate
    this.x=x;
    // y coordinate
    this.y=y;
    this.visited = false;
    // which walls to display
    // top right bottom left
    this.walls = [true, true, true, true];
    // possible moves for solving the maze
    this.possibleMoves = [true, true, true, true];
    // mark the cell as either end or beginning
    this.marked=false;
    // marks the cell as the players location


    this.findNext = function(){
        var possNext = [];
        l = idx(this.x, this.y-1)
        if (l>-1){
            top = map[l]
        } else {
            top = undefined;
        }
        console.log(l)
        console.log(map[l])
        right = map[idx(this.x+1, this.y)];
        bottom = map[idx(this.x, this.y+1)];
        left = map[idx(this.x-1,this.y)];
        if (top && !top.visited) {
            possNext.push(top);
        }
        if (right && !right.visited) {
            possNext.push(right)
        }
        if (bottom && !bottom.visited) {
            possNext.push(bottom)
        }
        if (left && !left.visited) {
            possNext.push(left)
        }
        console.log(possNext)
        if (possNext.length > 0) {
            possNext
            // get random index from neighbors
            rand = Math.round(Math.random() * (possNext.length-1))
            if (possNext[rand] === top){
                return map[l]
            }
            return possNext[rand];
        } else {
            return undefined;
        }
    };

    // I added this in
    this.showSolution = function(){
        ctx.fillStyle=solutionColor;
        ctx.fillRect(this.x*size + size/4,this.y*size+size/4,size/2,size/2);
    ;}

    this.reveal = function(){

        if (this.marked) {
            ctx.fillStyle = markedColor;
            ctx.fillRect(this.x*size,this.y*size,size, size);
        } else if (this.visited){
            // fills in the visited space
            ctx.fillStyle = visitedColor;
            ctx.fillRect(this.x*size, this.y*size, size, size);
        }
        if (this.player){
            ctx.fillStyle = playerColor;
            ctx.fillRect(this.x*size,this.y*size,size,size);
        }

        
        // fills in the walls last to prevent overlapping them
        if (this.walls[0]){
            // top wall
            drawLine(this.x*size,   this.y*size,    this.x*size+size,   this.y*size);
        }
        if (this.walls[1]){
            // right wall
            drawLine(this.x*size+size,  this.y*size,    this.x*size+size,   this.y*size+size);
        }
        if (this.walls[2]){
            // bottom wall
            drawLine(this.x*size+size,  this.y*size+size,   this.x*size,    this.y*size+size);
        }
        if (this.walls[3]){
            // left wall
            drawLine(this.x*size,   this.y*size+size,   this.x*size,    this.y*size);
        }
        
    }
};

setup();
console.log(map);
generateMaze()
drawMaze();


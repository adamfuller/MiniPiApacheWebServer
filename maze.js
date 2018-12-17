var canvas=document.getElementById("mazeCanvas");
var ctx=canvas.getContext("2d");

var cols, rows;
// height and width of sections of the grid
// lower generates high detail mazes
var size = 40;
// symbolic list of the points on the grid
var grid = [];
// keeps track of the current location on the map
var current;
// color to mark progress of visited spots
var visitedColor = "white";
// color of walls
var wallColor = "black";
// background color
var backgroundColor = "black";
// color of current cell
var highlightColor = "springgreen"
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
    cols = Math.floor(canvas.width/size);
    rows = Math.floor(canvas.height/size);

    for (var j = 0; j<rows; j++){
        for (var i = 0; i<cols; i++){
            var cell = new Cell(i,j);
            grid.push(cell);
        }
    }
    current = grid[0];
    if (useRandom){
        end = grid[Math.round(Math.random()*(grid.length-1))];
        
        b = Math.round(Math.random()*(grid.length-1));
        while (grid[b] === end){
            b = Math.round(Math.random()*(grid.length-1));
        }
        beginning = grid[b];
    } else {
        end = grid[grid.length-1];
        beginning = grid[0]
    }
    end.marked = true;
    beginning.marked = true;
    currentPlayer = beginning;
    currentPlayer.player=true;
}


function draw(){
    //fills grid in black
    ctx.fillStyle=backgroundColor;
    ctx.fillRect(0,0, canvas.width, canvas.height);

    if (stack.length === 0 || allVisited()){
        // makes first cell the beginning
        // uncomment to make the first cell the beginning
        //beginning.marked=false;
        //current.marked = true;
    }
    //draws the cells
    for (var m=0;m<grid.length;m++){
        grid[m].show();
    }

    current.visited = true;
    current.highlight();
    // step 1
    var next = current.checkNeighbors();
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
    //console.log(stack.length);
    
}

function solveMaze(){
    solveStack = [];
    solveTurn = 0;
    solveNext = undefined;
    for (x=0; x<grid.length; x++){
        for (n=0; n<grid[x].walls.length; n++){
            grid[x].possibleMoves[n] = !grid[x].walls[n];
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
                ctx.fillRect(solveNext.i*size, solveNext.j*size, size,size)
            }
            if (!solveCurrent.walls[0] && solveCurrent.possibleMoves[0]){
                // can move up
                solveCurrent.possibleMoves[0] = false;
                // picks block upwards
                solveNext = grid[index(solveCurrent.i, solveCurrent.j-1)]
                solveNext.possibleMoves[2] = false;

            }
            else if (!solveCurrent.walls[1] && solveCurrent.possibleMoves[1]){
                // can move to the right
                solveCurrent.possibleMoves[1] = false;
                // picks block to the right
                solveNext = grid[index(solveCurrent.i+1, solveCurrent.j)]
                solveNext.possibleMoves[3] = false;

            }
            else if (!solveCurrent.walls[2] && solveCurrent.possibleMoves[2]){
                // can move down
                solveCurrent.possibleMoves[2] = false;
                // picks block below
                solveNext = grid[index(solveCurrent.i, solveCurrent.j+1)]
                solveNext.possibleMoves[0] = false;
            }
            else if (!solveCurrent.walls[3] && solveCurrent.possibleMoves[3]){
                // can move left
                solveCurrent.possibleMoves[3] = false;
                // picks block to the left
                solveNext = grid[index(solveCurrent.i-1, solveCurrent.j)]
                solveNext.possibleMoves[1] = false;
            } else {
                solveNext = undefined;
            }

            ctx.fillStyle=solutionColor;
            
            solveCurrent.show();
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
        for (x=0; x<grid.length; x++){
            for (n=0; n<grid[x].walls.length; n++){
                grid[x].possibleMoves[n] = !grid[x].walls[n];
            }
        }

        solveCurrent = currentPlayer;
        solveStack.push(solveCurrent);
        while (solveCurrent !== end){

            if (solveNext) {
                solveStack.push(solveCurrent);
                ctx.fillRect(solveNext.i*size, solveNext.j*size, size,size)
            }
            if (!solveCurrent.walls[3] && solveCurrent.possibleMoves[3]){
                // can move left
                solveCurrent.possibleMoves[3] = false;
                // picks block to the left
                solveNext = grid[index(solveCurrent.i-1, solveCurrent.j)]
                solveNext.possibleMoves[1] = false;
            }
            else if (!solveCurrent.walls[2] && solveCurrent.possibleMoves[2]){
                // can move down
                solveCurrent.possibleMoves[2] = false;
                // picks block below
                solveNext = grid[index(solveCurrent.i, solveCurrent.j+1)]
                solveNext.possibleMoves[0] = false;
            }
            else if (!solveCurrent.walls[1] && solveCurrent.possibleMoves[1]){
                // can move to the right
                solveCurrent.possibleMoves[1] = false;
                // picks block to the right
                solveNext = grid[index(solveCurrent.i+1, solveCurrent.j)]
                solveNext.possibleMoves[3] = false;
            }
            else if (!solveCurrent.walls[0] && solveCurrent.possibleMoves[0]){
                // can move up
                solveCurrent.possibleMoves[0] = false;
                // picks block upwards
                solveNext = grid[index(solveCurrent.i, solveCurrent.j-1)]
                solveNext.possibleMoves[2] = false;
            } else {
                solveNext = undefined;
            }

            ctx.fillStyle=solutionColor;
            
            solveCurrent.show();
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
    solveCurrent.show();

}


function showSolvedMaze(){
    // use recursive back tracking
    // and right turn rule to solve the maze
    // movement priority right, up, left, down
    
    for (var p=0;p<grid.length;p++){
        var block=grid[p]
        selfInSolution = solveStack.indexOf(block)>0;
        rightInSolution = solveStack.indexOf(grid[index(block.i+1,block.j)]) >0 || grid[index(block.i+1,block.j)] === currentPlayer;
        topInSolution = solveStack.indexOf(grid[index(block.i,block.j-1)])>0 || grid[index(block.i,block.j-1)] === currentPlayer;
        leftInSolution = solveStack.indexOf(grid[index(block.i-1,block.j)])>0 || grid[index(block.i-1,block.j)] === currentPlayer;
        bottomInSolution = solveStack.indexOf(grid[index(block.i,block.j+1)])>0 || grid[index(block.i,block.j+1)] === currentPlayer;
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
        } else if ( !selfInSolution && grid[index(block.i,block.j+1)] === end && !bottomWall && topInSolution && !topWall){
            block.showSolution();
        } else if ( !selfInSolution && grid[index(block.i,block.j-1)] === end && !bottomWall && bottomInSolution && !topWall){
            block.showSolution();
        } else if ( !selfInSolution && grid[index(block.i-1,block.j)] === end && !leftWall && leftInSolution && !rightWall){
            block.showSolution();
        } else if ( !selfInSolution && grid[index(block.i+1,block.j)] === end && !rightWall && rightInSolution && !leftWall){
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
    for (var m=0;m<grid.length;m++){
        grid[m].show();
    }


    current.visited = true;
    current.highlight();
    // step 1
    var next = current.checkNeighbors();
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
    
    while (stack.length > 0 && current !== grid[0]){
        //console.log("current is 0")
        //draws the cells
        for (var m=0;m<grid.length;m++){
            grid[m].show();
        }

        current.visited = true;
        current.highlight();
        // step 1
        var next = current.checkNeighbors();
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
    //fills grid in chosen color
    ctx.fillStyle=backgroundColor;
    ctx.fillRect(0,0, canvas.width, canvas.height);
    //draws the cells
    for (var m=0;m<grid.length;m++){
        grid[m].show();
    }
}

function allVisited(){
    for (var spot=0;spot<grid.length;spot++){
        if (!grid[spot].visited) {
            //console.log(stack);
            return false;
        }
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
    var  x = a.i - b.i;
    if (x === 1){
        a.walls[3] = false;
        b.walls[1] = false;
    } else if (x === -1) {
        a.walls[1] = false;
        b.walls[3] = false;
    }
    var y = a.j - b.j;
    if (y === 1){
        a.walls[0] = false;
        b.walls[2] = false;
    } else if (y === -1) {
        a.walls[2] = false;
        b.walls[0] = false;
    }

}

function index(i, j){
    if (i < 0 || j < 0 || i > cols-1 || j > rows-1){
        
        return -1;
    }
    return i + j * cols;
}

function movePlayer(evt){
    /* 
    to simulate keypress use
    obj = {keyCode: 37}
    movePlayer(obj)
    */
    x = currentPlayer.i*size;
    y = currentPlayer.j*size;
    i = currentPlayer.i
    j = currentPlayer.j

    keyPushed = evt.keyCode;
    if (keyPushed === 37) {

        if(currentPlayer.walls[3] === false) {
            grid[index(i-1,j)].player=true;
            currentPlayer.player = false;
            currentPlayer = grid[index(i-1,j)]
        }

    }
    if (keyPushed === 38) {

        if(currentPlayer.walls[0] === false) {
            grid[index(i,j-1)].player=true;
            currentPlayer.player = false;
            currentPlayer = grid[index(i,j-1)];
        }
    }
    if (keyPushed === 39) {

        if(currentPlayer.walls[1] === false) {
            grid[index(i+1,j)].player=true;
            currentPlayer.player = false;
            currentPlayer = grid[index(i+1,j)];
        }
    }
    if (keyPushed === 40) {
        if(currentPlayer.walls[2] === false) {
            grid[index(i,j+1)].player=true;
            currentPlayer.player = false;
            currentPlayer = grid[index(i,j+1)];
        }
    }
    if (keyPushed === 13){
        // enter
        if (confirm("New Maze?")){
            // generates new maze
            clearInterval(intID);
            grid = []
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
        grid = []
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

function Cell(i, j){
    // x coordinate
    this.i=i;
    // y coordinate
    this.j=j;
    this.visited = false;
    // which walls to display
    // top right bottom left
    this.walls = [true, true, true, true];
    // possible moves for solving the maze
    this.possibleMoves = [true, true, true, true];
    // mark the cell as either end or beginning
    this.marked=false;
    // marks the cell as the players location


    this.highlight = function(){
        var x = this.i*size;
        var y = this.j*size;
        ctx.fillStyle = highlightColor;
        ctx.fillRect(x,y, size, size);
    }

    this.checkNeighbors = function(){
        neighbors = [];

        var top = grid[index(i, j-1)];
        var right = grid[index(i+1, j)];
        var bottom = grid[index(i, j+1)];
        var left = grid[index(i-1,j)];

        if (top && !top.visited) {
            neighbors.push(top);
        }
        if (right && !right.visited) {
            neighbors.push(right)
        }
        if (bottom && !bottom.visited) {
            neighbors.push(bottom)
        }
        if (left && !left.visited) {
            neighbors.push(left)
        }
        //console.log(neighbors);
        if (neighbors.length > 0) {
            neighbors
            // get random index from neighbors
            r = Math.round(Math.random() * (neighbors.length-1))
            return neighbors[r];
        } else {
            return undefined;
        }
    };

    // I added this in
    this.showSolution = function(){
        ctx.fillStyle=solutionColor;
        ctx.fillRect(this.i*size + size/4,this.j*size+size/4,size/2,size/2);
    ;}

    this.show = function(){
        var x = this.i*size;
        var y = this.j*size;

        if (this.marked) {
            ctx.fillStyle = markedColor;
            ctx.fillRect(x,y,size, size);
        } else if (this.visited){
            // fills in the visited space
            ctx.fillStyle = visitedColor;
            ctx.fillRect(x, y, size, size);
        }
        if (this.player){
            ctx.fillStyle = playerColor;
            ctx.fillRect(x,y,size,size);
        }

        
        // fills in the walls
        if (this.walls[0]){
            //top
            drawLine(x,y,x+size,y);
        }
        if (this.walls[1]){
            //right
            drawLine(x+size,y,x+size,y+size);
        }
        if (this.walls[2]){
            //bottom
            drawLine(x+size, y+size,x,y+size);
        }
        if (this.walls[3]){
            //left
            drawLine(x,y+size, x,y);
        }
        
    }
};

setup();
//setInterval(draw, 120);
console.log(grid);
generateMaze()
drawMaze();


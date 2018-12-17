
var canvasX = 500;
var canvasY = 500;
var zoom=100;

var maxIterations = 100;
var centerX=0;
var centerY=0;
var huePerIteration = 5;
var mouseLoc = {x:0,y:0};
var isChanged = true;
var peak = 64;
//isChanged=!isChanged;


function addText(text,type, locationID){
    let parent = document.createElement(type);
    let node = document.createTextNode(text);
    parent.appendChild(node);
    document.getElementById(locationID).appendChild(parent);
}

function addListeners(){
    let canvas = document.getElementById("defaultCanvas0");
    canvas.addEventListener("mousemove",function (evt){
        let rect = canvas.getBoundingClientRect();
        mouseLoc = {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    });
    document.addEventListener("keydown",function(evt){
        // arrow keys
        if (evt.keyCode == 38){
            //up arrow
            zoom+=zoom/4;
            console.log(zoom);
            isChanged=!isChanged;
        }
        if (evt.keyCode == 40){
            // down arrow
            zoom-=zoom/5;
            console.log(zoom);
            isChanged=!isChanged;
        }

        // wasd keys
        if (evt.keyCode == 65){
            //a
            centerX-=100/zoom;
            isChanged=!isChanged;
        }
        if (evt.keyCode == 87){
            //w
            centerY-=100/zoom;
            isChanged=!isChanged;
        }
        if (evt.keyCode == 68){
            //d
            centerX+=100/zoom;
            isChanged=!isChanged;
        }
        if (evt.keyCode == 83){
            //s
            centerY+=100/zoom;
            isChanged=!isChanged;

        }

        // tfgh keys for fine control
        if (evt.keyCode == 70){
            //f
            centerX-=10/zoom;
            isChanged=!isChanged;
        }
        if (evt.keyCode == 84){
            //t
            centerY-=10/zoom;
            isChanged=!isChanged;
        }
        if (evt.keyCode == 71){
            //g
            centerY+=10/zoom;
            isChanged=!isChanged;
        }
        if (evt.keyCode == 72){
            //h
            centerX+=10/zoom;
            isChanged=!isChanged;
        }

        //i or j
        if (evt.keyCode == 74){
            //j
            zoom-=zoom/5
            isChanged=!isChanged;
            
        }
        if (evt.keyCode == 73){
            //i
            zoom+=zoom/4;
            isChanged=!isChanged;
            
        }

        //number keys
        if (evt.keyCode == 48){
            zoom=100;
            centerX = 0;
            centerY = 0;
            isChanged=!isChanged;
        }
    })
}



function iterationsToEscape(x, y, maxIterations) {
    let tempa;
    let a = 0;
    let b = 0;
    for (let i = 0 ; i < maxIterations ; i++) {
        tempa = a*a - b*b + x;
        b = 2*a*b + y;
        a = tempa;
        if (a*a+b*b > peak) {
            // return i; // discrete
            return i - Math.log(Math.sqrt(a*a+b*b))/Math.log(8); //continuous
        }
    }
    return -1;
}

function hue2rgb(t){
    while (t>360) {
        t -= 360;
    }
    if (t < 60) return 255*t/60;
    if (t < 180) return 255;
    if (t < 240) return 255 * (4 - t/60);
    return 0;
}

function setup(){
    
        createCanvas(canvasX, canvasY);
        pixelDensity(1);
        addListeners();
        
}

function draw(){
    if (isChanged){
        loadPixels();
        let w = width;
        let h = height;
        let r,g,b;
        let xs=[], ys=[];
        for (let px=0;px<w;px++){
            xs[px]= (px-w/2)/zoom + centerX;
        }
        for (let py=0;py<h;py++){
            ys[py]=(py-h/2)/zoom + centerY;
        }
        for (let px=0;px<w;px++){
            for (let py=0;py<h; py++){
                r = g = b = 0;
                let iterations = iterationsToEscape(xs[px], ys[py], maxIterations);
                if (iterations != -1){
                    let h = (huePerIteration * iterations);
                    r = hue2rgb(h+120);
                    g = hue2rgb(h);
                    b = hue2rgb(h+240);
                };
                let loc = (px+py*w)*4;
                pixels[loc+0]=b;
                pixels[log+1]=g;
                pixels[loc+2]=r;
                pixels[loc+3]=255;
            }
        }
        updatePixels();
        isChanged=!isChanged;
    }
}

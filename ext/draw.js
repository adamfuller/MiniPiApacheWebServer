function inscribedPolygon(r, x, y, sides, color){
    // default input values
    var filled;
    var color;
    if (arguments.length <= 6){
        
    }   else if (arguments.length === 6){
        //ctx = arguments[6];
    } else {
        ctx = arguments[6];
    }
    if (arguments.length <= 5){
        filled = true;
    } else {
        filled = arguments[5]
    }
    if (arguments.length <= 4){
        color = "black";
    } else {
        color = arguments[4];
    }

    var dT = 2*Math.PI/sides;
    var points = [];
    for (var g=0;g<sides;g++){
        var T = Math.PI/2;
        var px = Math.sin(T-dT*g) *r + x;
        var py = Math.cos(T-dT*g) * r + y;
        var n = {
            'x':px,
            'y':py
        }
        points.push(n);
    }
    console.log(points);
    
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
    }
};

function drawLine(x, y, xf, yf, color){
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.moveTo(x,y);
    ctx.lineTo(xf,yf);
    ctx.stroke();

}
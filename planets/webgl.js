/*
Each frame is taken as one second in time
Each pixel is 1 meter wide and 1 meter tall
*/
let mouseLoc = { x: 0, y: 0 };
let G = 6.67408e-11;
let num = 5;
let planets = []
let numSuns = 1;
let suns = [];
var sunMap, earthMap, venusMap, marsMap, jupiterMap, saturnMap, neptuneMap, uranusMap, plutoMap, moonMap;

let solarSystem;
let planetsByMap = [];


function addListeners() {
    var canvas = document.getElementById("defaultCanvas0");
    canvas.addEventListener("mousemove", function (evt) {
        let rect = canvas.getBoundingClientRect();
        mouseLoc = {
            x: evt.clientX - rect.left - width / 2,
            y: evt.clientY - rect.top - height / 2
        };
        //console.log("X: "+mouseLoc.x + " Y: "+ mouseLoc.y);
    })
    canvas.addEventListener("mouseout", function (evt) {
        mouseLoc = {
            x: 0,
            y: 0
        }
    });

    canvas.addEventListener("mousedown", function (evt) {
        createPlanet(mouseLoc.x, -mouseLoc.y, 30, true);
    })

}

function velocityForOrbit(M, m, r) {
    return Math.sqrt(G * (M + m) / r);
}

function createPlanet(x, y, z, orbit) {
    let newPlanet = new Planet(x, y, z, orbit);

    for (let i = planetsByMap.length; i<=newPlanet.mapIndex; i++){
        planetsByMap.push([]);
    }

    // add the new planet to it's map's index
    planetsByMap[newPlanet.mapIndex].push(newPlanet);
    planets.push(newPlanet);
}

function velocityForOrbit3D(sun, planet) {
    // magnitude of the distance from the planet to the sun
    let dista = dist(sun.pos.x, sun.pos.y, sun.pos.z, planet.pos.x, planet.pos.y, planet.pos.z)

    // this is the standard gravitational parameter for the sun and the specified planet
    let GM = G * (sun.mass + planet.mass);

    // magnitude of the velocity neaded for orbit
    // this is the square root of the gravitational parameter divided by the distance
    let V = Math.sqrt(GM / dista);

    // magnitudes of the distances from the planet to the sun
    // the direction of this vector is not needed so taking the absolute value will work just as well

    let distX = (sun.pos.x - planet.pos.x);
    let distY = (sun.pos.y - planet.pos.y);
    let distZ = (sun.pos.z - planet.pos.z);


    // vector representing the distance from the planet to the sun;
    let planetToSunVec = createVector(distX, distY, distY);
    let planetToSunUnitVec = createVector(distX, distY, distZ).normalize();

    /*

        Since orbit requires a velocity tangent to the direction of acceleration 
        we must find a vector tangent to the acceleration
        to do this we switch two directions of the acceleration and multiply one by -1;
        This method will generate an incorrect vector if one of the values is 0, so I have a backup
        
        The tangent vectors will be denoted by "T" followed by a number to indicate the order of their creation

    */

    let T1; // this will be a tangent vector to the acceleration
    if (distZ !== 0 && distY !== 0) {
        T1 = createVector(0, -planetToSunVec.z, planetToSunVec.y);
    } else if (distY !== 0 && distX !== 0) {
        T1 = createVector(-planetToSunVec.y, planetToSunVec.x, 0);
    } else if (distX !== 0 && distZ !== 0) {
        T1 = createVector(-planetToSunVec.z, 0, planetToSunVec.x)
    } else {
        T1 = createVector(-planetToSunVec.y, planetToSunVec.x, 0);
    }

    // This will be a vector tangent to both the acceleration and E1
    let T2 = planetToSunVec.cross(T1);

    /*
     The unit vectors of the tangent vectors will be denoted by "U" 
      followed by a number representing the vector they are based off of
    */
    let U1 = T1.normalize();
    let U2 = T2.normalize();


    // list of positive unit angles
    let angs = [0, 1 / 6, 1 / 4, 1 / 3, 1 / 2, 2 / 3, 3 / 4, 5 / 6, 1];

    /*
        Since a tangent vector in 3D space is actually a plane, 
        we have to pick a random direction for the vector to be in
        For this direction I will pick a random unit angle between 0 and pi
    */
    // picks random unit angle
    let omega = random(-1, 1) * Math.PI;

    /*

        Since the two unit vectors are tanget;
        the cosine of one vector the same side/direction as the sine of the other
        to find the any component of the unit vector needed to orbit in the desired direction;
        the sum of the corresponding components of each unit vector must be taken

    */
    let vx = Math.cos(omega) * U1.x + Math.sin(omega) * U2.x;
    let vy = Math.cos(omega) * U1.y + Math.sin(omega) * U2.y;
    let vz = Math.cos(omega) * U1.z + Math.sin(omega) * U2.z;

    /* 
        the vector components created in the step above only create a unit vector
        that must be multiplied by the magnitude of the velocity needed for orbit
        to obtain the final vector
    */
    let velVec = createVector(vx, vy, vz).mult(V);
    return velVec
}

function forceOfGravity(m1, m2, r) {
    let g = G * m1 * m2 / (r * r)
    return g;
}

function preload() {
    sunMap = loadImage("sunmap.jpg");
    venusMap = loadImage("venusmap.jpg");
    earthMap = loadImage("earthmap.jpg");
    marsMap = loadImage("marsmap.jpg");
    jupiterMap = loadImage("jupitermap.jpg");
    saturnMap = loadImage("saturnmap.jpg");
    uranusMap = loadImage("uranusmap.jpg")
    neptuneMap = loadImage("neptunemap.jpg");
    plutoMap = loadImage("plutomap.jpg");
    moonMap = loadImage("moonmap.jpg");
    solarSystem = [marsMap, earthMap, jupiterMap, saturnMap, neptuneMap, uranusMap, plutoMap, moonMap];

}

function setup() {
    let cv = createCanvas(windowWidth, windowHeight, WEBGL);
    cv.parent("JS");

    perspective();

    addListeners();

    for (let s = 0; s < numSuns; s++) {
        suns[s] = new Sun(0, 0, 0, 30000000000000);
    }


    for (let i = 0; i < num; i++) {
        planets[i] = new Planet(i * 30 + 30, i * 30 + 30, i * 30 + 30);
        // provides a velocity necessary for orbit
        planets[i].vel = velocityForOrbit3D(suns[0], planets[i]);
    }

}

function draw() {
    background(0);
    //translate(mouseLoc.x, mouseLoc.y, 0)

    // TODO: Filter using array.filter, make toBeRemoved array to cross check
    for (let p = planets.length - 1; p>=0; p--){
        if (planets[p].toBeRemoved) {
            let tempPos = planetsByMap[planets[p].mapIndex].indexOf(planets[p]);
            planetsByMap[planets[p].mapIndex].splice(tempPos, 1)
            planets.splice(p, 1);
        }
    }

    for (let s = 0; s<suns.length; s++){
        push()
        suns[s].show();
        pop()
    }

    for (let p = planets.length - 1; p >= 0; p--) {

        for (let s = 0; s < suns.length; s++) {
            planets[p].applyGravity(suns[s].mass, suns[s].pos.x, suns[s].pos.y, suns[s].pos.z);
        }

        for (let o = p; o >= 0; o--) {
            if (planets[p] !== planets[o]) {
                planets[p].hasCollided(planets[o]);
                planets[p].applyGravity(planets[o].mass, planets[o].pos.x, planets[o].pos.y, planets[o].pos.z);
                planets[o].hasCollided(planets[p]);
                planets[o].applyGravity(planets[p].mass, planets[p].pos.x, planets[p].pos.y, planets[p].pos.z)
            }
        }

        if (!planets[p].toBeRemoved) {
            planets[p].update();
            if ((planets[p].pos.x > width * 2 || planets[p].pos.x < 0 - width * 2) && (planets[p].pos.y > height * 2 || planets[p].pos.y < 0 - height * 2) && (planets[p].pos.z > (height + width) || planets[p].pos.z < 0 - (height + width))) {
                planets[p].toBeRemoved = true;
            }
            // planets[p].show();
        }
    }

    for (let m = planetsByMap.length-1; m>=0; m--){
        let group = planetsByMap[m];
        if (!group){
            continue;
        }
        texture(solarSystem[m]);
        for (let p = group.length-1; p>=0; p--){
            group[p].show();
        }
    }


}



class Planet {
    constructor(x, y, z, orbit) {
        this.pos = createVector(x || 0, y || 0, z || 0);
        this.vel = createVector(0, 0, 0);
        this.acc = createVector(0, 0, 0);
        this.radius = random(10, 15);
        this.density = 0.001;
        this.volume = (4 / 3) * PI * Math.pow(this.radius, 3);
        this.mass = this.volume * this.density
        this.spin = Math.random() * PI / 30;
        this.spinP = 0;
        this.spinAxis = [floor(random(2)), 1, floor((random(2)))];
        this.toBeRemoved = false;
        this.explode = false;
        this.mapIndex = floor(random(solarSystem.length));
        if (orbit) {
            this.vel = velocityForOrbit3D(suns[0], this)
        }
    }

    update() {
        this.vel.add(this.acc);
        this.pos.add(this.vel);
        this.acc.mult(0);

    };

    applyForce(force) {
        this.acc.add(force);
    }

    applyGravity(M, Mx, My, Mz) {
        let dis = Math.sqrt((Mx - this.pos.x) * (Mx - this.pos.x) + (My - this.pos.y) * (My - this.pos.y) + (Mz - this.pos.z) * (Mz - this.pos.z));
        let Fg = forceOfGravity(M, this.mass, dis);

        // x direction from the other mass to this
        let xDir = Math.sign(Mx - this.pos.x);

        // magnitude of x distance 
        let xDis = Math.abs(Mx - this.pos.x);

        // y direction from other mass to this
        let yDir = Math.sign(My - this.pos.y);

        // magnitude of y distance
        let yDis = Math.abs(My - this.pos.y);

        // z direction from other mass to this
        let zDir = Math.sign(Mz - this.pos.z);

        // magnitude of z distance to this
        let zDis = Math.abs(Mz - this.pos.z);

        // 
        //  F = directionX * (distanceX / distanceTotal) * Force / mass
        //
        // Adds a=F/m for each direction
        this.acc.x += xDir * xDis / dis * Fg / this.mass;
        this.acc.y += yDir * yDis / dis * Fg / this.mass;
        this.acc.z += zDir * zDis / dis * Fg / this.mass;
    }

    hasCollided(otherPlanet) {
        let distance = dist(this.pos.x, this.pos.y, this.pos.z, otherPlanet.pos.x, otherPlanet.pos.y, otherPlanet.pos.z);

        //two planets collide
        if (distance < this.radius + otherPlanet.radius) {
            if (this.mass < otherPlanet.mass) {
                this.toBeRemoved = true;
            }
            if (this.mass > otherPlanet.mass) {
                this.density += otherPlanet.density / 10;
                this.radius += otherPlanet.radius / 20;
            }

            //console.log("collision at :" + this.pos.x + "," + this.pos.y + ',' + this.pos.z);
            //console.log(otherPlanet.pos.x, otherPlanet.pos.y, otherPlanet.pos.z);
            //console.log(distance)
        }

    }

    show() {
        push();
        // texture(solarSystem[this.mapIndex]);
        translate(this.pos.x, -this.pos.y, this.pos.z);
        rotate(this.spin * this.spinP, this.spinAxis);
        this.spinP++;
        if (this.spin >= 2 * PI) {
            this.spinP = 0;
        }
        sphere(this.radius);
        pop();
    }


}


class Sun {
    constructor(x, y, z, mass) {
        this.pos = createVector(x || 0, y || 0, z || 0);
        this.mass = mass || 300000000000;
    }
    show() {
        push();
        texture(sunMap);
        translate(this.pos.x, -this.pos.y, this.pos.z);
        sphere(5);
        pop();
    }
}
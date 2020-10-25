'use strict'
/**
 * @tutorial : Recreating the Asteroids Game - 1979 Classic. 
 * @see https://www.youtube.com/watch?v=H9CSWMxJx84&ab_channel=freeCodeCamp.org 
 * For a follow along to the original source code
 */


/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('gameCanvas');
/**
 * @type {CanvasRenderingContext2D}
 */
const ctx = canvas.getContext('2d');

const scoreDisplay = document.getElementById('score');
const livesDisplay = document.getElementById('lives');


 
//Bug Fix [1] - Making the Canvas Responsive

 /**
 * @var dpi - Obtains the pixel density of the Device
 */
let dpi = window.devicePixelRatio;

/**
 * @var ccsHeight - Obtains the value of the canvas height from the CSS property, it then removes the 'px' from the end of the string and then returns a number. 
 */
 let cssHeight= (Number(getComputedStyle(canvas).getPropertyValue('height').slice(0,-2))/dpi);

 /**
  * @var cssWidth -Obtains the value of the canvas width from the CSS property, it then removes the 'px' from the end of the string and then returns a number.
 */
 let cssWidth = (Number(getComputedStyle(canvas).getPropertyValue('width').slice(0,-2))/dpi);

/**
 * Applying pixel scaling to the css height and width properties
 */
/**
 * @var canvasHeight - Applying pixel ratio to the height
 */
let canvasHeight = cssHeight * dpi;
/**
 * @var canvasWidth - Applying the pixel ratio to the width
 */
let canvasWidth = cssWidth * dpi;
/**
 * Setting the Canvas to respect scaling
 * Removing the Blur
 */
/**
 * @var height - Setting the height to account for pixel density
 * To plot co-ordinates within the canvas:
 * Height(y) = 0 = Top line;
 * 0 < y < canvasHeight;
 */
let height = canvas.height = canvasHeight; 
/**
 * @var width - Setting the width to account for pixel density
 * To plot co-ordinates within the canvas: 
 * Width(x) = 0 Left Line 
 * 0 < x < canvasWidth;
 */
let width = canvas.width = canvasWidth;
//TODO: Make the  canvas resize with the screen and reload the new values for width and height. 




/**
 * @function RandomNumber Generator
 * @param {Number} min -Lowest Number in Range
 * @param {Number} max  - Highest Number in Range
 * @returns Random Number between the range of min - max
 */
function randomNumber(min,max){
    return Math.floor(Math.random()*Math.floor(max-min) + min)
}

/**
 * @function randomNumberDecimal Number
 * @returns Random Decimal number fixed to 4 decimal places. 
 */
function randomNumberDecimal(){
    return +Math.random().toPrecision(4)
}
/**
 * @function convertRadians
 * @param {Number} degrees in Decimal
 * @returns Degrees in Radians
 */
function convertRadians(degrees){
    return +(degrees / 180 * Math.PI)
}
/**
 * @function distanceBetweenPoints
 * @description
 * Takes the cartesian distance between two points A(x,y) and B(x,y) 
 * 
 * @param {Number} x1 - X - Co-ordinate of the Primary Object
 * @param {Number} y1 - Y - Co-ordinate of the Primary Object
 * @param {Number} x2 - X - Co-ordinate of the Secondary Object
 * @param {Number} y2 - Y - Co-ordinate of the Secondary Object
 * @returns Distance in Pixels
 * 
 */
function distanceBetweenPoints(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2))
}

/**
 * @function distanceBetweenCircles
 * @param {Number} x1 - X - Co-ordinate of the Primary Object
 * @param {Number} y1 - Y - Co-ordinate of the Primary Object
 * @param {Number} r2 - R - Co-ordinate of the radius of the Primary Object 
 * @param {Number} x2 - X - Co-ordinate of the Secondary Object
 * @param {Number} y2 - Y - Co-ordinate of the Secondary Object
 * @param {Number} r2 - R - Co-ordinate of the radius of the second Object 
 * @returns 
 * Returns the distance between two circles 
 */   
function distanceBetweenCircles(x1,y1,r1,x2,y2,r2){
    return Math.sqrt((x2 - x1)**2 + (y2-y1)**2 - (r2+r1))
}
// Declaring the Games Global Properties Here

/**
 * @type {Number} 
 * @var FPS - Frames Per Second
 */
const FPS = 60 //frames per second 1 frame every 16.6ms
/**
 * @var Friction 
 * @type {Number}
 * @description Adds a Friction co-efficient to the movement of the ship:
 *  0 - No Friction <= x <= 1 - 100% Friction (maximum resistance)
 */
const FRICTION = 0.5; //Friction in Space (0 = no friction, 1 = 100% friction)
/**
 * @var SHIP_SIZE 
 * @type {Number}
 * @description Size of the Ship
 */
const SHIP_SIZE = 30 // Height of the Ship
/**
 * @var SHIP_THRUST 
 * @type {Number}
 * @description Acceleration of the Ship, in px/sec^2
 */
const SHIP_THRUST = 2 // acceleration of the Ship, px/sec^2
/**
 * @var TURN_DEG
 * @type {Number}
 * @description This is the turning angle in deg/s. 
 */
const TURN_DEG = 360 // Turns in deg/sec
const SHOW_BOUNDING = false; //show or hide collision bounding box
const LASER_MAX=20;//maximum number of lasers on the screen at once
const LASER_SPEED = 500;//speed of laser in px/s
let currentScore = 0;// Keeps track of the score. 
let lives = 5;

/**
 * @class GameObject
 */

class ShipObject{
    /**
     * 
     * @param {Number} x - Position of the Ship on the X - Axis 
     * @param {Number} y - Position of the Ship on the Y - Axis
     * @param {Number} r - Radius of the Ship
     * @param {Number} a - Angle of the Ship 
     * @param {Number} rot - The Rotational max of the ship (360deg)
     * @param {Boolean} thrusting - true if trust is active, false otherwise
     * @param {Object} thrust - {x,y} this provides a thrust vector to the the ship
     */
    constructor(x,y,r,a,rot,thrusting,thrust){
        /**
         * @this this.x -  Position of the Ship on the X - Axis
         */
        this.x = Number(x);
        /**
         * @this this.y -  Position of the Ship on the Y - Axis
         */
        this.y = Number(y);
        /**
         * @this this.r -  Ship's Radius
         */
        this.r = Number(r);
        /**
         * @this this.a - Angle of the ship converted to Radians
         */
        this.a = convertRadians(a); //Converted to Radians
        /**
         * @this this.rot - Ship can only rotate around 360deg of a circle  converted to Radians
         */

        this.rot = convertRadians(rot);//Converted it into Radians
        /**
         * @this this.thrusting - Boolean Flag! True when the ship trust is active
         */
        this.thrusting = Boolean(thrusting);
        /** 
         * @this this.thrust - Provides a vector for the ship when travelling
        */
        this.thrust = {...thrust};

        
        this.exploding=Boolean(false);//State if the ship is exploding
        this.immune = Boolean(false);//State if the ship is immune to asteroid collision or not
        this.laserStatus = Boolean(true);
        this.laserArray = Array();
        this.laserDistance = 0.5 //max distance laser can travel as fraction of the screen width
    }
}


let ship = new ShipObject(
                width/2,
                height/2,
                SHIP_SIZE,
                90,
                360,
                false,
                {x:0,y:0}
            );

function drawShip(obj){
    //drawing the ship
    if(obj.immune){
        ctx.strokeStyle = "gold";
    }else{
        ctx.strokeStyle = "white";
    }
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo( // nose of the ship
        obj.x + 4 / 3 * obj.r * Math.cos(obj.a),
        obj.y - 4 / 3 * obj.r * Math.sin(obj.a)
    );
    ctx.lineTo( // rear left
        obj.x - obj.r * (2 / 3 * Math.cos(obj.a) + Math.sin(obj.a)),
        obj.y + obj.r * (2 / 3 * Math.sin(obj.a) - Math.cos(obj.a))
    );
    ctx.lineTo( // rear right
        obj.x - obj.r * (2 / 3 * Math.cos(obj.a) - Math.sin(obj.a)),
        obj.y + obj.r * (2 / 3 * Math.sin(obj.a) + Math.cos(obj.a))
    );

    ctx.closePath();//Finishes of the Triangle
    ctx.stroke();
    //drawing the Cockpit
    ctx.beginPath();
    if(obj.immune){
        ctx.strokeStyle = "gold";
        ctx.fillStyle = "gold"
    }else{
        ctx.strokeStyle = "white";
        ctx.fillStyle = "blue"
    }
    
    ctx.lineWidth = 2;
    ctx.moveTo( // top of the cockpit
        obj.x - (1 / 5 * obj.r - SHIP_SIZE) * Math.cos(obj.a),
        obj.y + (1 / 5 * obj.r - SHIP_SIZE) * Math.sin(obj.a)
    );
    ctx.lineTo( // rear left of the cockpit
        obj.x - obj.r * (1 / 3 * Math.cos(obj.a) +  0.5*Math.sin(obj.a)),
        obj.y + obj.r * (1 / 3 * Math.sin(obj.a) - 0.5*Math.cos(obj.a))
    );
    ctx.lineTo( // rear right of the cockpit
        obj.x - obj.r * (1 / 3 * Math.cos(obj.a) -  0.5 * Math.sin(obj.a)),
        obj.y + obj.r * (1 / 3 * Math.sin(obj.a) + 0.5 * Math.cos(obj.a))
    );
    ctx.fill();//Fill in the Shape
    ctx.closePath();//Finishes of the Triangle
    ctx.stroke();

    //center dot
    // ctx.fillStyle = "red";
    // ctx.fillRect(obj.x - 1, obj.y - 1, 2, 5);
    
    //Rotate Ship
    
    obj.a += obj.rot

    //Move Ship
    if(obj.thrusting){
        //Add Thrust vector 
        obj.thrust.x += SHIP_THRUST * Math.cos(obj.a) / FPS ** 1/2;
        obj.thrust.y -= SHIP_THRUST * Math.sin(obj.a) / FPS ** 1/2 ;
        //Draw thrust animation
        ctx.beginPath();
        ctx.strokeStyle = "yellow";
        ctx.fillStyle = "red"
        ctx.lineWidth = 2;
        ctx.moveTo( // rear center behind the ship
            obj.x - 4 / 3 * obj.r * Math.cos(obj.a),
            obj.y + 4 / 3 * obj.r * Math.sin(obj.a)
        );
        ctx.lineTo( // rear left
            obj.x - obj.r * (2 / 3 * Math.cos(obj.a) +  0.75 * Math.sin(obj.a)),
            obj.y + obj.r * (2 / 3 * Math.sin(obj.a) - 0.75 * Math.cos(obj.a))
        );
        ctx.lineTo( // rear right
            obj.x - obj.r * (2 / 3 * Math.cos(obj.a) -  0.75 * Math.sin(obj.a)),
            obj.y + obj.r * (2 / 3 * Math.sin(obj.a) + 0.75 * Math.cos(obj.a))
        );
        ctx.fill();//Fill in the Shape
        ctx.closePath();//Finishes of the Triangle
        ctx.stroke();
    }
    
    //Applying Friction to slow down the ship when Not thrusting
    if(!obj.thrusting){
        obj.thrust.x -= FRICTION * obj.thrust.x /FPS
        obj.thrust.y -= FRICTION * obj.thrust.y /FPS
        
    }
    
    //Move the Ship
             
    obj.x += obj.thrust.x;
    obj.y += obj.thrust.y;
    
    //Applying the lasers
    //going backwards through the laser array
    for(let laser = obj.laserArray.length-1 ; laser >= 0; laser-- ){
        //Calculate the distance travelled
        obj.laserArray[laser].distanceTravelled += Math.sqrt(obj.laserArray[laser].vX**2 + obj.laserArray[laser].vY**2);
        if(obj.laserArray[laser].distanceTravelled > obj.laserArray[laser].maxDistance * width){
            obj.laserArray.splice(laser,1)
        }
    }
    obj.laserArray.forEach(laser => {
        //Draw each laser

        ctx.fillStyle = "red"
        ctx.beginPath();
        ctx.arc(laser.x,laser.y,SHIP_SIZE/8,0,Math.PI*2,false);
        ctx.fill();
        ctx.closePath();

        //move the laser
        laser.x += laser.vX
        laser.y += laser.vY
    })
    
    //Collision Detection between laser and the asteroid

    //looping backwards through the asteroid array
    for(let astroIndex = asteroidsArray.length-1; astroIndex >= 0 ; astroIndex--){
        //Grabbing the asteroids properties
        let asteroidX = asteroidsArray[astroIndex].x 
        let asteroidY = asteroidsArray[astroIndex].y
        let asteroidR = asteroidsArray[astroIndex].r

        //Looping backwards through the Laser array
        for(let laserIndex = obj.laserArray.length-1; laserIndex >=0; laserIndex--){
            //Grabbing the laser properties
            let laserX = obj.laserArray[laserIndex].x
            let laserY = obj.laserArray[laserIndex].y

            if(distanceBetweenPoints(asteroidX,asteroidY,laserX,laserY) < asteroidR){
                //remove the laser
                obj.laserArray.splice(laserIndex,1)
                //remove the asteroid
                
                //destroy asteroid
                destroyAsteroid(astroIndex)

            }
        }
    }

    //Handling the Edge Off Screen Adjustments for the ship
    screenEdges(obj)

    //Handling the edge of screen adjustments for the laser
    //Slightly different to the screenEdges function
    obj.laserArray.forEach(laser=>{
        if(laser.x < 0){
            laser.x = width
        }else if(laser.x > width){
            laser.x = 0
        }
        if(laser.y < 0){
            laser.y = height
        }else if(laser.y > height){
            laser.y = 0
        }
    })
    //Collision detection
    displayBoundingBox(obj)
}

function displayBoundingBox(obj){
    if(SHOW_BOUNDING){
        // ctx.strokeStyle = 'green';
        ctx.arc(obj.x,obj.y, obj.r, 0, Math.PI * 2, false);
        ctx.stroke();
    }
}

function screenEdges(obj){
    if(obj.x < 0 - obj.r){
        obj.x = width + obj.r
    }
    else if(obj.x > width + obj.r){
        obj.x = 0 - obj.r
    }
    if(obj.y < 0 - obj.r){
        obj.y = height + obj.r
    }
    else if(obj.y > height + obj.r){
        obj.y = 0 - obj.r
    }
}        
function shootLasers(obj){
    //create the laser object
    if(obj.laserStatus && obj.laserArray.length < LASER_MAX){
        obj.laserArray.push({
            //Shooting from the nose of the ship;
            x:obj.x + 4 / 3 * obj.r * Math.cos(obj.a),
            y:obj.y - 4 / 3 * obj.r * Math.sin(obj.a),
            //Applying the velocity
            vX: LASER_SPEED * Math.cos(obj.a) / FPS,
            vY: -LASER_SPEED * Math.sin(obj.a) / FPS,
            maxDistance:0.6,//Distance of the laser can travel as a fraction of the screen width
            distanceTravelled:0,//Tracks the distance of the laser travelling
        })
       
    }
    if(obj.laserArray.length >= LASER_MAX){
        obj.laserArray.push({
            //Shooting from the nose of the ship;
            x:obj.x + 4 / 3 * obj.r * Math.cos(obj.a),
            y:obj.y - 4 / 3 * obj.r * Math.sin(obj.a),
            vX: LASER_SPEED * Math.cos(obj.a) / FPS,
            vY: -LASER_SPEED * Math.sin(obj.a) / FPS,
        })
        obj.laserArray = []
    }

    //prevent further shooting
    obj.canShoot = false
}

let asteroidsArray = [];
let asteroidsNum = 5; //Asteroids Number

function createAsteroidField (){ 
    //Clear the Array
    asteroidsArray = [];
    let x,y,r;
    //Loop over the array
    for(let index = 0; index < asteroidsNum; ++index){
            x= randomNumber(0,width) ;
            y= randomNumber(0,height);
            r= randomNumber(50,100);
           
            if(distanceBetweenPoints(ship.x,ship.y,x,y) <= ship.r * 5 + ship.r){
                x = randomNumber(0,width) + (ship.x + ship.r + 20);
                y = randomNumber(0,height) + (ship.y + ship.r + 20);
            }
            
            
        asteroidsArray.push(newAsteroid(x,y,r));
    }
    return asteroidsArray;
}

function newAsteroid (x,y,r){

    let asteroid = {
        x : x,
        y:y,
        vX: randomNumber(15,30)/FPS * (randomNumberDecimal() <0.5 ? 1 : -1) ,
        vY: randomNumber(15,30)/FPS * (randomNumberDecimal() <0.5 ? 1 : -1),
        r:r ,
        a: Math.random() * Math.PI * 2, // in radians
        vertices : Math.floor(randomNumber(2,8) + randomNumber(2,8)),//Each asteroid has a random number of vertices
        jaggedness: randomNumberDecimal(), // 0 = none 1 = 100
        offsets : [],
    }
    //create the jaggedness to the asteroid
    for (let offset = 0; offset < asteroid.vertices; offset++){
        //create a random multiplier to the radius
        asteroid.offsets.push(Math.random() * asteroid.jaggedness * 2 + 1 - asteroid.jaggedness)
    }
    
    return asteroid
    
}
function drawAsteroids (){
   
    asteroidsArray.forEach((asteroid,index) =>{
        //Draw Asteroids
        ctx.strokeStyle = '#BADA55';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'transparent';
        //draw a path
        ctx.beginPath();
            ctx.moveTo(
        asteroid.x + (asteroid.offsets[0]  * asteroid.r) * Math.cos(asteroid.a),
        asteroid.y + (asteroid.offsets[0]  * asteroid.r) * Math.sin(asteroid.a)
        )
        //draw the polygon and jaggedness
        for(let polygon = 1; polygon < asteroid.vertices; polygon++){
            ctx.lineTo(
                asteroid.x + (asteroid.offsets[polygon] * asteroid.r) *  Math.cos(asteroid.a + polygon * Math.PI * 2 / asteroid.vertices),
                asteroid.y + (asteroid.offsets[polygon] * asteroid.r)*  Math.sin(asteroid.a + polygon * Math.PI * 2 / asteroid.vertices)
                )
            }
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        //Check for asteroid Collision with the ship
        if(distanceBetweenPoints(ship.x,ship.y,asteroid.x,asteroid.y) < ship.r + asteroid.r && !ship.immune ){
            // console.log('collision detected')
            ship.exploding  = true
            
            ship.thrusting = false
            
            explodeShip(ship)
            

        }else{
            ship.exploding=false;
            explodeShipDuration = 0;
        }
        function asteroid2asteroidCollision(asteroid,index){
            let currentAsteroid = asteroid
            let currentAsteroidIndex = index
            for(let index = 0; index < asteroidsArray.length; index++){
                if(index != currentAsteroidIndex){
                   //Turns out its easier to just calculate the distance between circles than between polygons. 
                    if(distanceBetweenCircles(currentAsteroid.x,currentAsteroid.y,currentAsteroid.r,asteroidsArray[index].x,asteroidsArray[index].y,asteroidsArray[index].r) <= (asteroidsArray[index].r ) ){
                        //Make the Asteroids ricochet off each other
                        
                        currentAsteroid.vX = -(currentAsteroid.vX + (Math.sin(currentAsteroid.a))  )
                        currentAsteroid.vY = -(currentAsteroid.vY + (Math.cos(currentAsteroid.a)) )
                        asteroidsArray[index].vX = -(asteroidsArray[index].vX + (Math.sin(asteroidsArray[index].a))  )
                        asteroidsArray[index].vY = -(asteroidsArray[index].vY + (Math.cos(asteroidsArray[index].a)) )
                        
                    }
                    
                }
                
            }
        }
        asteroid2asteroidCollision(asteroid,index)
        
        
        //move asteroid
        asteroid.x += asteroid.vX
        asteroid.y += asteroid.vY
        
        //handle edge of screen
        screenEdges(asteroid)
        //apply bounding box to asteroid
        displayBoundingBox(asteroid)
    })
    
}
function destroyAsteroid(index){
    // let asteroidCopy = asteroidsArray[index]
    let x = asteroidsArray[index].x;
    let y = asteroidsArray[index].y;
    let r = asteroidsArray[index].r;

    //split the larger asteroid into two when shot at
   if( r <= 60 && r >=30){
       //Adding the size of the asteroid as the value to be added to the score
       currentScore += r
       //Remove the asteroid that is shot at
       asteroidsArray.splice(index,1)
       //Create the smaller asteroid debris 
       asteroidsArray.push(newAsteroid(x,y,r/2))
       asteroidsArray.push(newAsteroid(x,y,r/2))
    }
    if( r <= 30 && r >=15){
        //Adding the size as the asteroid as the value to be added to the score
        currentScore += r
        //Remove the asteroid that is shot at
        asteroidsArray.splice(index,1)
        //Create the smaller asteroid debris 
       asteroidsArray.push(newAsteroid(x,y,r/2))
       asteroidsArray.push(newAsteroid(x,y,r/2))
   }
   if( r < 15){
       //Adding the size as the asteroid as the value to be added to the score
       currentScore += r
       //Remove the smallest asteroid 
       asteroidsArray.splice(index,1)
   }
   
}
let explodeShipDuration = 0
function explodeShip(obj){

    explodeShipDuration++
    

    
    //Prevent the ship from moving
    obj.thrust = {
        x:0,
        y:0
    }

    //Drawing the Explosion
        ctx.beginPath();
        //Outermost circle - Dark Orange
        ctx.strokeStyle = '#db4200';
        ctx.fillStyle='#db4200'
        ctx.arc(obj.x,obj.y, obj.r +10, 0, Math.PI * 2, false);
        ctx.fill()
        ctx.stroke();
        // n-1 circle - Orange
        ctx.beginPath();
        ctx.strokeStyle = '#f26900';
        ctx.fillStyle='#f26900'
        ctx.arc(obj.x,obj.y, obj.r + 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke()
        // n-2 circle - Yellow
        ctx.beginPath();
        ctx.strokeStyle = '#f29d00';
        ctx.fillStyle='#f29d00'
        ctx.arc(obj.x,obj.y, obj.r + 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();


       
            setTimeout(resetShip,500  )
   
            
  
 }
 function resetShip(){
    //remove the old ship
    
    ship = null
    //create a new ship
    let newShip = new ShipObject(
        width/2,
        height/2,
        SHIP_SIZE,
        90,
        TURN_DEG,
        false,
        {x:0,y:0});
    //Making the New Ship immune to Being Exploded
    newShip.immune = true
    console.log('resetting ship')
    console.count
    return ship = newShip
        
}



 function removeImmunity(obj){
   // removes the immunity from the ship after 3 seconds
        setTimeout(()=>{
            obj.immune = false
        },3000  )
 }
                
/**
 * @function keyDown
 * @param {KeyboardEvent} event 
 * 
 */
 function keyDown(event){
    if(event.key === 'ArrowUp' || event.key === 'w'){
        //Start Thrusting
        ship.thrusting = true
    }
    if(event.key === 'ArrowRight' || event.key === 'a' ){
        //Rotate Right
        ship.rot = convertRadians(TURN_DEG) / FPS
    }
    if(event.key === 'ArrowLeft' || event.key === 'd' ){
        //Rotate Left
        ship.rot = -convertRadians(TURN_DEG) / FPS
        
    }
    if(event.key === ' ' || event.key === 'Spacebar' ){
        //shoot laser
        shootLasers(ship);
        
    }
}

/**
 * @function keyUp
 * @param {KeyboardEvent} event 
 * @description 
 * Ends KeyDown events when the Key Press is released.
 */
function keyUp(event){
    if(event.key === 'ArrowUp' || event.key === 'w'){
        //Stop Thrusting
        ship.thrusting = false
    }
    if(event.key === 'ArrowRight' || event.key === 'a' ){
        //Stop Rotating Right
        ship.rot = 0;
    }
    if(event.key === 'ArrowLeft' || event.key === 'd' ){
        ship.rot = 0;
    }
    if(event.key === ' ' || event.key === 'Spacebar' ){
        //lock the shooting, one shot per press
        ship.laserStatus = true
    }
}



/**
 * @function gameAnimation
 * @description 
 * Contains the callback functions used in the game animation loop
 */
function gameAnimation(){
 
    
    //Draw the Background -Space
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,width,height);
    //Draw the Ship
    drawShip(ship)
    
    if(ship.immune){
        removeImmunity(ship) 
        
    }
    if(ship.exploding){
        console.log('ship exploding')
        lives--
    }
    //Draw the Asteroids
    drawAsteroids();
    
    scoreDisplay.textContent = `Score : ${currentScore}`
    
    livesDisplay.textContent = `Lives Left : ${lives}`
    //Request animation frame
    requestAnimationFrame(gameAnimation)


}

//Create the AsteroidField()
createAsteroidField();
//Start the Game Animation
gameAnimation()



// document.addEventListener('keydown',keyDown,false
// )

document.addEventListener('keyup',keyUp,false
)
document.addEventListener('keydown',keyDown)
// )

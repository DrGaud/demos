'use strict'//Enable Global strict mode 

//Setting up the global variables


/**
 * @type {HTMLCanvasElement}
 */
const canvas = document.getElementById('gameCanvas');

/**
 * @type {CanvasRenderingContext2D} 
 */
const ctx = canvas.getContext('2d');
console.log(ctx)

/**
 * @var scoreDisplay - Displays the Score on the DOM
 * @type {HTMLBodyElement}
 */
const scoreDisplay = document.getElementById('score');
/**
 * @var livesDisplay - Displays the Score on the DOM
 * @type {HTMLBodyElement}
 */
const livesDisplay = document.getElementById('lives');

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
    return Math.sqrt((x2 - x1)** 2 + (y2 - y1)**2)
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
    return Math.ceil(Math.sqrt((x2 - x1)**2 + (y2-y1)**2) - (r2+r1))
}


class GameConstants{
    constructor(){
        /**@this this.FPS - Frames per Second */
        this.FPS = Number(60)
        
        /**@this this.SHOW_BOUNDING - Displays bounding box */
        this.SHOW_BOUNDING = Boolean(false)
       /**@this this.AstroidArray - Array which would contain the asteroids in the asteroid field */
        this.asteroidField = []
        /**@this this.lives - Number of game lives*/
        this.lives = 5
        /**@this this.shipExploding - Registers a flag if the ship is exploding */
        this.shipExploding = false

        /**
        * @this this._width - Private width variable that would store the size of the window width
        */
        this._width = Number();
       
        /**
         * @this this._height - Private Height variable that would store the height of the window
         */
        this._height= Number();
        
        /**
         * Calls the getCanvasDimensions method
         */
        this.getCanvasDimensions();
       
        //Getting the Width and Height as soon as the Window loads
        window.addEventListener('load',()=>{
            this.getCanvasDimensions()
        })
       
        //As the window is resized we are getting the new Canvas Dimensions
        window.addEventListener('resize',()=>{
            this.getCanvasDimensions();
        })
       
    }
    getCanvasDimensions() {
        // Width is determined by the css value for the viewport width this is then respected by the device pixel ratio. This is then used to set the canvas.width value
        this._width = Math.round((Number(getComputedStyle(canvas).getPropertyValue('width').slice(0,-2))/devicePixelRatio) * devicePixelRatio);
        //Setting the canvas width 
        canvas.width = this._width
        
        // height is determined by the css value for the viewport height this is then respected by the device pixel ratio. This is then used to set the canvas.height value
        this._height = Math.round((Number(getComputedStyle(canvas).getPropertyValue('height').slice(0,-2))/devicePixelRatio) * devicePixelRatio);
        //Setting the canvas height
        canvas.height = this._height
        
    }
    get width(){
        //This sets the width to the private _width value
        return this._width
        
    }
    get height(){
        //This sets the height to the private _height value
        return this._height
    }

    keyDown(event){
        
        if(event.key === 'ArrowUp' || event.key === 'w'){
            //Start Thrusting
            spaceship.thrusting = true
        }
        if(event.key === 'ArrowRight' || event.key === 'a' ){
            //Rotate Right
            spaceship.rot = convertRadians(spaceship.TURN_DEG) / reference.FPS
        }
        if(event.key === 'ArrowLeft' || event.key === 'd' ){
            //Rotate Left
            spaceship.rot = -convertRadians(spaceship.TURN_DEG) / reference.FPS
            
        }
        // if(event.key === ' ' || event.key === 'Spacebar' ){
        //     //shoot laser
        //     shootLasers(spaceship);
            
        // }
    }
    keyUp(event){
        if(event.key === 'ArrowUp' || event.key === 'w'){
            //Stop Thrusting
            spaceship.thrusting = false
        }
        if(event.key === 'ArrowRight' || event.key === 'a' ){
            //Stop Rotating Right
            spaceship.rot = 0;
        }
        if(event.key === 'ArrowLeft' || event.key === 'd' ){
            spaceship.rot = 0;
        }
        // if(event.key === ' ' || event.key === 'Spacebar' ){
        //     //shoot laser
        //     shootLasers(spaceship);
            
        // }
    }
    screenEdges(obj){
        if(obj.x < 0 - obj.r){
            obj.x = this.width + obj.r
        }
        else if(obj.x > this.width + obj.r){
            obj.x = 0 - obj.r
        }
        if(obj.y < 0 - obj.r){
            obj.y = this.height + obj.r
        }
        else if(obj.y > this.height + obj.r){
            obj.y = 0 - obj.r
        }
    }
    
    createAsteroidField(numberOfAsteroids){
        /**
         * @function createNewAsteroid
         * @param {Number} x 
         * @param {Number} y 
         * @param {Number} r 
         * @description generates a new Asteroid Object 
         */
        function createNewAsteroid(x,y,r,asteroidIndex){
            let asteroid = new AsteroidObject(x,y,r,asteroidIndex);
            //Setting the values for the asteroids jaggedness
            for(let offset = 0; offset < asteroid.vertices; offset++ ){
                asteroid.offsets.push(
                   Math.random() * asteroid.jaggedness * 2 + 1 - asteroid.jaggedness
                )
            }
            return asteroid
        }
        
        //clear the existing array
        this.asteroidField = new Array();
        //creating placeholders
        let x,y,r,i

        for(let index = 0; index< numberOfAsteroids; index++){
            x = randomNumber(0,this.width)
            y = randomNumber(0,this.height)
            r = randomNumber(50, 100);
            //Giving the asteroid a Label
            i = index

            //Creating a buffer zone around the ship to prevent the asteroids randomly spawning on the ship
    
            if(distanceBetweenPoints(spaceship.x,spaceship.y,x,y) <= spaceship.r * 5 + spaceship.r){
                x = randomNumber(0,this.width) + (spaceship.x + spaceship.r + 20);
                y = randomNumber(0,this.height) + (spaceship.y + spaceship.r + 20);
            }
            this.asteroidField.push(createNewAsteroid(x,y,r,i))
        }
        return this.asteroidField
    }
     reduceLife(){
       

    }
    
    createNewSpaceShip(){
        if(spaceship){
            //Delete the existing spaceship
            spaceship = null;
            
        }
        //Reduce the lives count by one
        // this.lives--
        // console.log(this.lives)
        let newSpaceship = new ShipObject(
            reference.width /2,
            reference.height/2,
            30,
            90,
            360,
            false,
            {x:0,y:0}
        )
         //Making the New Ship immune to Being Exploded
         newSpaceship.immune = true
         reference.shipExploding = false
         newSpaceship.thrusting =false
        return spaceship = newSpaceship;
    }
}
/**
 * @var reference - this holds the values of the constants used throughout the game
 */
let reference = (new GameConstants())//Prevents the values being changed



//creating a shared object class between asteroids and spaceship

class GameObject{
    /**
     * 
     * @param {Number} x - Position of Object on X - Axis 
     * @param {Number} y - Position of Object on Y - Axis
     * @param {Number} r - Radius of the Object
     * @param {Number} a - Angle of the Object (in deg)
     */
    constructor(x,y,r,a){
        /**
         * @this this.x -  Position of the Object on the X - Axis
         */
        this.x = Number(x);
        /**
         * @this this.y -  Position of the Object on the Y - Axis
         */
        this.y = Number(y);
        /**
         * @this this.r -  Radius of the Object
         */
        this.r = Number(r);
        /**
         * @this this.a - Angle of the Object - converted to Radians
         */
        this.a = convertRadians(a); //Converted to Radians

    }
}


//Creating a spaceship Class

class ShipObject extends GameObject{
    constructor(x,y,r,a,rot,thrusting,thrust){
        super(x,y,r,a)
     
        /**
         * @this this.rot - spaceship can only rotate around 360deg of a circle  converted to Radians
         */
        this.rot = convertRadians(rot);//Converted it into Radians
     
        /**
         * @this this.thrusting - Boolean Flag! True when the spaceship trust is active
         */
        this.thrusting = Boolean(thrusting);
     
        /** 
         * @this this.thrust - Provides a vector for the spaceship when travelling
        */
        this.thrust = {...thrust};
        /**@this this.immune - Immunity from Explosions Flag */
        this.immune = Boolean(false)
        /**
         * @this this.SHIP_SIZE 
         * @description Height of the spaceship in px's - Same as the Radius
         */
        this.SHIP_SIZE = Number(r);
     
        /**
         * @this this.Friction 
         * @description Adds a Friction co-efficient to the movement of the spaceship:Friction in Space (0 = no friction, 1 = 100% friction)
         */
        this.FRICTION = Number(0.5); 
        
        /**
         * @this this.SHIP_THRUST 
         * @description Acceleration of the spaceship, in px/sec^2
         */
        this.SHIP_THRUST = Number(2); // acceleration of the spaceship, px/sec^2
     
        /**
         * @this this.TURN_DEG
         * @description This is the turning angle in deg/sec. 
         */
        this.TURN_DEG = Number(360); // Turns in deg/sec


    }

    draw(){
        if(this.immune){
            ctx.strokeStyle = "gold";
            ctx.fillStyle = "gold"
        }else{
            ctx.strokeStyle = "white";
            ctx.fillStyle = "red"
        }
       //The outer Triangle
       ctx.beginPath();
       ctx.moveTo(
           //Nose of the spaceship

            this.x + 4 / 3 * this.r * Math.cos(this.a),
            this.y - 4 / 3 * this.r * Math.sin(this.a)
        );
        ctx.lineTo( // rear left
            this.x - this.r * (2 / 3 * Math.cos(this.a) + Math.sin(this.a)),
            this.y + this.r * (2 / 3 * Math.sin(this.a) - Math.cos(this.a))
        );
        ctx.lineTo( // rear right
            this.x - this.r * (2 / 3 * Math.cos(this.a) - Math.sin(this.a)),
            this.y + this.r * (2 / 3 * Math.sin(this.a) + Math.cos(this.a))
        );
    
        ctx.closePath();//Finishes of the Outer Triangle
        ctx.stroke();

        //Drawing the Cockpit
        ctx.beginPath();
        // ctx.fillStyle = 'red';
        ctx.lineWidth = 2;
        ctx.moveTo( // top of the cockpit
            this.x - (1 / 5 * this.r - this.SHIP_SIZE) * Math.cos(this.a),
            this.y + (1 / 5 * this.r - this.SHIP_SIZE) * Math.sin(this.a)
        );
        ctx.lineTo( // rear left of the cockpit
            this.x - this.r * (1 / 3 * Math.cos(this.a) +  0.5 * Math.sin(this.a)),
            this.y + this.r * (1 / 3 * Math.sin(this.a) - 0.5 * Math.cos(this.a))
        );
        ctx.lineTo( // rear right of the cockpit
            this.x - this.r * (1 / 3 * Math.cos(this.a) -  0.5 * Math.sin(this.a)),
            this.y + this.r * (1 / 3 * Math.sin(this.a) + 0.5 * Math.cos(this.a))
        );
        ctx.fill();//Fill in the Shape
        ctx.closePath();//Finishes of the Triangle
        ctx.stroke();

        // center dot
        // ctx.fillStyle = "red";
        // ctx.fillRect(this.x - 1, this.y - 1, 2, 5);
       
        
        if(this.thrusting){
            //Add Thrust vector 
            this.thrust.x += this.SHIP_THRUST * Math.cos(this.a) / reference.FPS **1/2;
            this.thrust.y -= this.SHIP_THRUST * Math.sin(this.a) / reference.FPS **1/2 ;
            //Draw thrust animation
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.fillStyle = "red"
            ctx.lineWidth = 2;
            ctx.moveTo( // rear center behind the spaceship
                this.x - 4 / 3 * this.r * Math.cos(this.a),
                this.y + 4 / 3 * this.r * Math.sin(this.a)
            );
            ctx.lineTo( // rear left
                this.x - this.r * (2 / 3 * Math.cos(this.a) +  0.75 * Math.sin(this.a)),
                this.y + this.r * (2 / 3 * Math.sin(this.a) - 0.75 * Math.cos(this.a))
            );
            ctx.lineTo( // rear right
                this.x - this.r * (2 / 3 * Math.cos(this.a) -  0.75 * Math.sin(this.a)),
                this.y + this.r * (2 / 3 * Math.sin(this.a) + 0.75 * Math.cos(this.a))
            );
            ctx.fill();//Fill in the Shape
            ctx.closePath();//Finishes of the Triangle
            ctx.stroke();
        }
        
        //Applying Friction to slow down the spaceship when Not thrusting
        if(!this.thrusting){
            this.thrust.x -= this.FRICTION * this.thrust.x /reference.FPS
            this.thrust.y -= this.FRICTION * this.thrust.y /reference.FPS
            
        }

        //Rotate spaceship
    
        this.a += this.rot
        //Move the spaceship
                 
        this.x += this.thrust.x;
        this.y += this.thrust.y;

        //handle screen edges
        reference.screenEdges(this)


        
    }
    explodeShip(){
        //Prevent the ship from moving
       if(!this.immune){ this.thrust = {
            x:0,
            y:0
        }}

        //Drawing the Explosion
        ctx.beginPath();
        //Outermost circle - Dark Orange
        ctx.strokeStyle = '#db4200';
        ctx.fillStyle='#db4200'
        ctx.arc(this.x,this.y, this.r +10, 0, Math.PI * 2, false);
        ctx.fill()
        ctx.stroke();
        // n-1 circle - Orange
        ctx.beginPath();
        ctx.strokeStyle = '#f26900';
        ctx.fillStyle='#f26900'
        ctx.arc(this.x,this.y, this.r + 5, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke()
        // n-2 circle - Yellow
        ctx.beginPath();
        ctx.strokeStyle = '#f29d00';
        ctx.fillStyle='#f29d00'
        ctx.arc(this.x,this.y, this.r + 2, 0, Math.PI * 2, false);
        ctx.fill();
        ctx.stroke();


    }
    
}
let spaceship = new ShipObject(
    reference.width /2,
    reference.height/2,
    30,
    90,
    360,
    false,
    {x:0,y:0}
);


class AsteroidObject extends GameObject {
    constructor(x,y,r,asteroidIndex){
        super(x,y,r)
        /**@this this.a - returns a random angle in radians */
        this.a = Math.random() * Math.PI * 2
        /**@this this.vX - random Velocity on the x-axis  */
        this.vX =randomNumber(15,30)/reference.FPS * (randomNumberDecimal() <0.5 ? 1 : -1)
        /**@this this.vY - random Velocity on the y-axis  */
        this.vY = randomNumber(15,30)/reference.FPS * (randomNumberDecimal() <0.5 ? 1 : -1)
        /**@this this.vertices - Random number of vertices for the polygon to be generated */
        this.vertices =Math.floor(randomNumber(2,8) + randomNumber(2,8)),//Each asteroid has a random number of vertices
        /**@this this.jaggedness - random determination on the amount of jaggedness on the asteroid */
        this.jaggedness = randomNumberDecimal(), // 0 = none 1 = 100
        /**@this this.offsets - Array of positions for the dimensions of the polygon */
        this.offsets = []
        /**@this this.asteroidIndex - Asteroid Index position in the Array */
        this.asteroidIndex = Number(asteroidIndex);
    }

    draw(){
        //Draw Asteroids
        ctx.strokeStyle = '#BADA55';
        ctx.lineWidth = 2;
        ctx.fillStyle = 'transparent';
        //draw a path
        ctx.beginPath();
            ctx.moveTo(
        this.x + (this.offsets[0]  * this.r) * Math.cos(this.a),
        this.y + (this.offsets[0]  * this.r) * Math.sin(this.a)
        )
        //draw the polygon and jaggedness
        for(let polygon = 1; polygon < this.vertices; polygon++){
            ctx.lineTo(
                this.x + (this.offsets[polygon] * this.r) *  Math.cos(this.a + polygon * Math.PI * 2 / this.vertices),
                this.y + (this.offsets[polygon] * this.r)*  Math.sin(this.a + polygon * Math.PI * 2 / this.vertices)
                )
            }
        ctx.fill();
        ctx.closePath();
        ctx.stroke();
        
        //Handle collision Detection
        this.asteroid2asteroidCollision()
        this.asteroid2shipCollision()    
        
        //move asteroid
        this.x += this.vX
        this.y += this.vY
        
        //handle edge of screen
        reference.screenEdges(this)

        
    }

    asteroid2asteroidCollision(){
        let currentAsteroid = this;
        reference.asteroidField.forEach((otherAsteroid)=>{
            if(currentAsteroid != otherAsteroid){
                if(distanceBetweenCircles(currentAsteroid.x,currentAsteroid.y,currentAsteroid.r,otherAsteroid.x,otherAsteroid.y,otherAsteroid.r) < currentAsteroid.r + currentAsteroid.x && !spaceship.immune){
                    // console.log(currentAsteroid.vX)
                    //Make the asteroids 'softly' ricochet off each other
                    //There has been many different attempts at getting this right, this is by far the best attempt at getting the asteroids to move off and change direction and their velocity that produces the least amount of Janking

                    currentAsteroid.vX = currentAsteroid.vX/( (reference.FPS / 2))  + Math.sin(-currentAsteroid.a) 
                    otherAsteroid.vX = otherAsteroid.vX/ (reference.FPS / 2)  + Math.sin(-otherAsteroid.a) 

                    currentAsteroid.vY = currentAsteroid.vY/ (reference.FPS / 2)  + Math.cos(-currentAsteroid.a)  
                    otherAsteroid.vY = otherAsteroid.vY/ (reference.FPS / 2)  + Math.cos(-otherAsteroid.a)

                }
            }
        })
    }
    asteroid2shipCollision(){
        if(distanceBetweenPoints(this.x,this.y,spaceship.x,spaceship.y) < spaceship.r + this.r && !spaceship.immune){
            // register that the ship is exploding 
            reference.shipExploding = true
        }

    }
}




document.addEventListener('keydown',reference.keyDown)
document.addEventListener('keyup',reference.keyUp)



reference.createAsteroidField(15)
//Game Animation Loop
function gameAnimation(){
    ctx.fillStyle = 'black'
    ctx.fillRect(0,0,reference.width,reference.height);

   
    if(!reference.shipExploding) {
        spaceship.draw()  
    }else{
        spaceship.explodeShip();

        //Timeouts to carry out these functions after a certain period of time.        
        setTimeout(reference.createNewSpaceShip,1000)
        setTimeout(()=>{
         //Removing the ships immunity after 5 secs
            spaceship.immune = false
         
        },5000)

    } 

    //Drawing each asteroid on the screen
    reference.asteroidField.forEach((asteroid)=>{
        asteroid.draw()
    })

    //Request animation frame
    requestAnimationFrame(gameAnimation)
}
gameAnimation()
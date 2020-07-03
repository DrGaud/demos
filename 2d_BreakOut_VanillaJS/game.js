//Global Strict Mode
'use strict';
/**
 * -= 2D Breakout Game using  Vanilla JS =-
 * 
 * {@tutorial https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_Breakout_game_pure_JavaScript BreakoutGame}
 * @see https://github.com/end3r/Gamedev-Canvas-workshop
 * 
 * Tutorial Author: end3r (GitHub)
 * 
 * Follow Along for the Breakout Game using pure JavaScript. 
 * This is built from a 10-part tutorial.
 * 
 * Re-written to ES6 standard, along with JSDoc annotations
 * Bug corrections:
 * 1) Canvas and pixels drawn on canvas is blurry when redraw and is not responsive to the viewport. 
 * 2)Creating an Object to store the ball properties
 *  - Setting the drawBall() to the Object
 * 
 * written by: DrGaud
 * 
 * 
*/


/**
 * @var canvas - Gets the Canvas from the DOM
 */
const canvas = document.getElementById('game');

/**
 * @var ctx - Sets the CONTEXT of the canvas to display 2D elements
 */
const ctx = canvas.getContext('2d');

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
const height = canvas.height = canvasHeight; 
/**
 * @var width - Setting the width to account for pixel density
 * To plot co-ordinates within the canvas: 
 * Width(x) = 0 Left Line 
 * 0 < x < canvasWidth;
 */
const width = canvas.width = canvasWidth;

function random(min,max) {
    const num = Math.floor(Math.random()*(max-min)) + min;
    return num;
};


//Testing to see if we can paint to the canvas: 
//Single Blue Square on the canvas
// ctx.beginPath();//Begins the Paint Path-Start Tag
// ctx.rect(1,1,50,50);//Defines the dimensions of the rectangle shape
// ctx.fillStyle = 'blue';//colours it Blue
// ctx.fill();//Paints the shape on the canvas
// ctx.closePath();//Closes the shape -End Tag
//Drawing a Circle on the Canvas
// ctx.beginPath();
// ctx.arc(width/2, height/2, 15, 0, (2*Math.PI), false) //Draws the Circle
// ctx.fillStyle = 'green';
// ctx.fill();
// ctx.closePath();
// Drawing a Stroke Rectangle
// ctx.beginPath();
// ctx.rect(160,10,100,40);
// ctx.strokeStyle = 'rgba(0,0,255,0.5)';
// ctx.stroke();
// ctx.closePath();

/**
 * [2] - Ball Constructor Object
 * @class GameBall
 * @classdesc Controls of the ball properties. 
 */
class GameBall {
    /**
     * @constructor Creates the Ball object
     * @param {Number} x - The horizontal (x-axis) co-ordinate of the center of the ball @this this.x
     * @param {Number} y - The Vertical (y-axis) co-ordinate of the center of the ball @this this.y
     * @param {Number} speed - The speed the ball will be moving @this this.xVelocity & @this this.yVelocity
     * @param {Number} radius - Radius of the ball @this this.radius
     * @param {String} colour - colour of the ball @this this.colour
     */
    constructor(x, y, speed, radius, colour) {
        /**@this this.x - The horizontal (x-axis) co-ordinate of the center of the ball */
        this.x = Number(x);
        /**@this this.y - The Vertical (y-axis) co-ordinate of the center of the ball */
        this.y = Number(y);
        /**@this this.xVelocity - Velocity of the ball along the x-axis */
        this.xVelocity = Number(speed);
         /**@this this.yVelocity - Velocity of the ball along the y-axis */
        this.yVelocity = -Number(speed);
        /**@this this.radius - The radius of the ball */
        this.radius = Number(radius);
        /**@this this.colour - The Colour of the ball */
        this.colour = String(colour);
    }
    /**
     * @method drawBall
     * @description Draws the Ball on the screen
     */
    drawBall() {
        ctx.beginPath();//Beings Path instruction
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);//Sets the Dimensions of the ball
        ctx.fillStyle = this.colour;//Sets the colour
        ctx.fill();//Fills in the shape
        ctx.closePath();//Finishes the drawing of the Ball
    }
    /**
     * @method physics
     * @description Applies The AABB Collision detection to the ball.
     * This is done by taking in the Balls outer point and testing it to see if the ball has overlapped the object.
     */
    physics(){
        //Applying AABB Collision detection to the ball
        //If the ball hits the sides
        if((this.x + this.radius + this.xVelocity) > width ||
        (this.x +  this.xVelocity) < 0) {
            this.xVelocity = -this.xVelocity;//Alter Direction
            this.colour = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';//Change Colour
        }
        //If the ball hits the top of the canvas
        else if((this.y + this.yVelocity ) < 0){
            this.yVelocity = - this.yVelocity;//Alters Direction
            this.colour = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';//Change Colour
            
        }
        //If the ball drops below the canvas
        if((this.y) > height + this.radius){
            //We will reload the screen with Ball and the Paddle in the stating locations
            this.x = width/2
            this.y = height/2;
            paddle.padPosition = (width - paddle.padWidth)/2
            //Decrease the Lives
            settings.lives--;
        }
        
        //Making the ball move
        this.x += this.xVelocity;
        this.y += this.yVelocity;
    }
}
/**@class GameBall @const ball -Instantiating the Ball object*/
const ball = new GameBall(width/2,height/2,2,10,'skyblue');

/**
 * @class Paddle
 * @classdesc Controls the properties of the Paddle
 */
class Paddle {
    /**
     * @constructor Paddle Properties
     */
    constructor() {
        /**@this this.padHeight - height of the Paddle*/
        this.padHeight = 20;
        /**@this this.padWidth - Width of the Paddle*/
        this.padWidth = 100;
        /**@this this.padPosition - Position of the Paddle */
        this.padPosition = (width - this.padWidth) / 2; //Defaults to the center
    }
    /**
     * @method drawPad()
     * @description Draws the Paddle on the Screen
     */
    drawPad() {
        ctx.beginPath();
        ctx.rect(this.padPosition, (height - this.padHeight) - 1, this.padWidth, this.padHeight);
        ctx.fillStyle = 'skyblue';
        ctx.fill();
        ctx.closePath();
    }
    /**
     * @method physics()
     * @description Applies the AABB collision detection to the object
     */
    physics(){
        //If the ball is beyond the height of the paddle 
        if(ball.y > height - this.padHeight && 
            //Bounded Ball Object > The left edge of the paddle
            ball.x + ball.radius > this.padPosition  &&
                //Bounded Ball Object < the right side of the paddle
                ball.x + ball.radius < (this.padPosition + this.padWidth)){
                    ball.yVelocity = -ball.yVelocity;//Alter direction on contact
                }
        //Making the paddle move
        if((events.rightBtnPressed) && this.padPosition < width - this.padWidth){
            //To the right
            this.padPosition += 10;//Speed of the paddle moving
        }
        else if((events.leftBtnPressed) && this.padPosition > 0){
            //To the left
            this.padPosition -= 10; //Speed of the paddle moving
        }
    }
        

    
}
/**@class Paddle @const paddle - Instantiating the Paddle Object */
const paddle = new Paddle();

/**
 * @class Bricks
 * @classdesc Controls the properties for the bricks
 * The Bricks will be presented on a 2-Dimensional Array:
 * [[col[row]{brick}][col[row]{brick}]...]
 * Each brick is an object
 */
class Bricks {
    /**
     * @param {Number} noColumns - Set the number of columns
     * @param {Number} noRows -Set the number of rows
     * @param {Number} strength - Sets the strength of the bricks
     */
    constructor(noColumns, noRows, strength) {
        /**@this this.columns - Number of Columns */
        this.columns = noColumns;
        /**@this this.rows - Number of Rows */
        this.rows = noRows;
        //Sets the size of the bricks
        /**@this this.width - Width of the brick as a fraction of Canvas Width */
        this.width = width/8;
        /**@this this.height - Height of the brick as a % of Canvas Height */
        this.height = height * 0.05;
        /**@this this.padding - Sets the padding of each brick */
        this.padding = 10;
        /**@this this.offsetTop - Distance from the top of each row taken as a % */
        this.offsetTop = height*0.1;
        /**@this this.offsetLeft - Distance to the object to the left taken as a % */
        this.offsetLeft = width * 0.1;
        /**@this this.strength - Strength of the wall - This can be changed to increase the difficulty */
        this.strength = strength;
        /**@this this.bricksArray - 2D Array of Bricks */
        this.bricksArray = [];
        //Creating a 2-dimensional Array for the Bricks by Columns then Rows
        for (let col = 0; col < this.columns; col++) {
            this.bricksArray[col] = [];
            for (let row = 0; row < this.rows; row++) {
                this.bricksArray[col][row] = { 
                    //Brick Object
                    x: 0, 
                    y: 0, 
                    strength,
                }
            }
        }
    }
    /**
     * @method drawBricks - This draws the bricks
     */
    drawBricks() {
        for(let col = 0; col < this.columns ; col++){
            for(let row = 0; row< this.rows; row++){
                if(this.bricksArray[col][row].strength === 1){
                    /**@var brickXPos - Sets the position of each brick on number of bricks in each row */
                    let brickXPos =(row*(this.width+this.padding)) + this.offsetLeft;
                    //Sets the x co-ordinate  of each brick
                    this.bricksArray[col][row].x = brickXPos;
                    /** @var brickYPos -Sets the position of the brick based on the number columns*/
                    let brickYPos = (col*(this.height+this.padding))+ this.offsetTop;
                    //Sets their y co-ordinate of each brick
                    this.bricksArray[col][row].y = brickYPos;
                    //Drawing the brick
                    ctx.beginPath();
                    ctx.rect(brickXPos, brickYPos, this.width, this.height);
                    ctx.fillStyle = 'red';
                    ctx.fill();
                    ctx.closePath();
                }
            }
        }
    }
    /**
     * @method physics - Applying the AABB collision detection to the bricks
     * @description We are interested when the Bounded Ball Object overlaps the brick, we would decrease the strength of the brick upon each collision until it disappears
     */
    physics(){
        //For Loop to go through the 2D Array
        for(let col = 0; col<this.columns; col++){
            for(let row = 0; row< this.rows; row++){
                /**@var brick - Brick Object{x , y , strength} */
                let brick = this.bricksArray[col][row];
                //If brick is alive
                if(brick.strength >= 1){
                    //Collision Box
                    if(ball.x + ball.radius > brick.x && //The Bounded Ball is greater than the xPos of the brick
                        ball.x + ball.radius < brick.x + this.width &&//The Bounded Ball is within the width of the brick
                        ball.y + ball.radius > brick.y &&//The Bounded Ball is greater than the yPos of the brick
                        ball.y + ball.radius < brick.y + this.height//The Bounded Ball is within the height of the Brick
                        ){
                            //Increasing the Speed of the ball proportionate to the no.of hits req to complete the game
                            ball.xVelocity += (this.columns *this.rows *this.strength)/50
                            ball.yVelocity += -(this.columns *this.rows *this.strength)/50
                            ball.yVelocity = - ball.yVelocity;//Reverse Direction
                            
                            brick.strength-- //Reduce the strength of the brick
                            settings.score++ // Add to the score

                        }
                }
            }
        }
    }
}
/**@class Bricks @var wall - Instantiating the Bricks Object */
const wall = new Bricks(3,6,1);

/**
 * @class Event Handlers
 * @classdesc Handles the keypress events by registering if a key press has occurred. 
 */
class EventHandler {
    /**
     * @constructor EventHandler
     */
    constructor() {
        /**@this this.rightBtnPressed {Boolean} - Registers if the right button is currently pressed */
        this.rightBtnPressed = false;
        /**@this this.leftBtnPressed {Boolean} - Registers if the left button is currently pressed */
        this.leftBtnPressed = false;
    }
    /**
     * @method keyDown - registers when the downward keystroke is applied to the right & left keyboard keys
     * @param {Trigger} event - Event is triggered by keyPress
     */
    keyDown(event) {
        if (event.key == "Right" || event.key == "ArrowRight") {
            //Registers the event
            events.rightBtnPressed = true;
        }
        else if (event.key == "Left" || event.key == "ArrowLeft") {
            //Registers the event
            events.leftBtnPressed = true;
        }
    }
    /**
     * @method keyUp - registers when the downward keystroke is applied to the right & left keyboard keys
     * @param {Trigger} event - Event is triggered by keyPress
     */
    keyUp(event) {
        if (event.key == "Right" || event.key == "ArrowRight") {
             //Registers the event
            events.rightBtnPressed = false;
        }
        else if (event.key == "Left" || event.key == "ArrowLeft") {
             //Registers the event
            events.leftBtnPressed = false;
        }
    }
    /**
     * @method mouse - registers when the mouse has moved 
     * @param {Trigger} event - Event is triggered by the mouse movement within the window
     */
    mouse(event) {
        /**@var mousePositionX - Takes the x co-ordinate of the mouse */
        let mousePositionX = event.clientX - canvas.offsetLeft;//the offset is the difference between the left edge of the document on the viewport and the left edge of the canvas  
        if (mousePositionX > 0 && mousePositionX < width) {
            //Takes the position of the mouse = to the middle of the paddle
            paddle.padPosition = mousePositionX - paddle.padWidth / 2;
        }
        ;
    }
}
/**@class EventHandler @var events - Instantiating the Events Handler */
const events = new EventHandler();

/**
 * @class GameSettings
 * @classdesc Controls the game properties and methods
 */
class GameSettings {
    constructor() {
        /**@this this.score - Keeps track of the score */
        this.score = 0;
        /**@this this.lives - Keeps track of the lives in the game (Default:3) */
        this.lives = 3;
    }
    /**
     * @method drawScore
     * @description Prints the score on the screen
     */
    drawScore() {
        ctx.font = "18px Arial";
        ctx.fillStyle = 'skyblue';
        //Sets the position from the center
        ctx.fillText("Score: " + this.score, (width/2) - 100, 25);
    }
    /**
     * @method drawLives
     * @description Prints the Lives on the screen
     */
    drawLives() {
        ctx.font = "18px Arial";
        ctx.fillStyle = 'skyblue';
        //Sets the position from the center
        ctx.fillText("Lives: " + this.lives, (width/2) + 45, 25);
    }
    /**
     * @method endGame
     * @description Triggers EndGame events
     */

    endGame(){
        if(this.score == (wall.rows*wall.columns)*wall.strength){
            alert("!!!WINNING!!! - You just Won the Game, but lost the Game at the same time ..... =p ");
            document.location.reload();
        }
        if(this.lives === 0){
            alert("No Joy, Try again");
            document.location.reload();
        }
        
    }
   

}
/**@class GameSettings @const settings - Instantiating the GameSettings Object */
const settings = new GameSettings();

/**
 * Main Animation Loop
 * 
 * @description - This is the main animation loop being recursively called by the 
 * requestAnimationFrame()
 */
function animation(){
    //Clear the Previous Frame
    ctx.clearRect(0,0,width,height);
    //Drawing the Objects
    ball.drawBall();
    paddle.drawPad();
    wall.drawBricks();
    //Applying the physics
    ball.physics();
    paddle.physics();
    wall.physics();
    //Apply Settings
    settings.drawScore();
    settings.drawLives();
    //End Game
    settings.endGame();

    //Request Animation Frame
    requestAnimationFrame(animation)
}
//Applying Event listeners to the Document.
document.addEventListener('keydown',events.keyDown,false);
document.addEventListener('keyup',events.keyUp,false);
document.addEventListener('mousemove',events.mouse,false);

//Calls the Animation loop
animation();
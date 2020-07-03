//Global Strict Mode
'use strict';
/**@var canvas - Obtains the canvas from the DOM */
const canvas = document.querySelector('canvas');
/**@var ctx - sets the visual context of the canvas to 2D */
const ctx = canvas.getContext('2d');
/**@var width - Defines and sets the canvas to full width */
const width = canvas.width = window.innerWidth;
/**@var height - Defines and sets the canvas to full height */
const height = canvas.height = window.innerHeight;
/**
 * Random Number Generator
 * @param {Number} min - Minimum number in the range
 * @param {Number} max - Maximum number in the range
 * @returns random number 
 */
function randomNumber(min, max){
    const num = Math.floor(Math.random()*(max-min))+ min;
    return num
}
/**@var ballcount - This keeps track of the ball count*/
let ballcount = 0
/**@var counter - Display the counter, obtains the <p> node on the DOM */
const counter = document.querySelector('p');


//Defining the Parent Shape Object
/**
 * @class Shape
 * @classdesc Defines the properties given to Each Shape
 * 
 * @param {Number} x - Random x co-ordinate
 * @param {Number} y - Random y co-ordinate
 * @param {Number} xVel - Random Velocity on the x-axis
 * @param {Number} yVel - Random Velocity on the y-axis
 * @param {Boolean} exists - If exists on the screen then true
 * 
 */
function Shape(x, y ,xVel, yVel, exists){
    /**@this this.x - X position of the Object */
    this.x = x;
    /**@this this.y - Y position of the Object */
    this.y = y;
    /**@this this.xVel - Velocity on the x-axis */
    this.xVel = xVel;
    /**@this this.yVel - Velocity on the y-axis */
    this.yVel = yVel;
    /**@this. this.exists - Tracks Object's existence: Boolean  */
    this.exists = exists;
}

//Defining the Ball Object 

/**
 * @class Ball @extends Shape
 * @constructor Ball 
 * @param {String} color - Random color for Ball
 * @param {Number} size  - Random Size of Ball
 * @memberof Shape
 * @this this.x - X position of the Ball 
 * @this this.y - Y position of the Ball 
 * @this this.xVel - Velocity on the x-axis 
 * @this this.yVel - Velocity on the y-axis 
 * @this. this.exists - Tracks balls existence: Boolean 
 */
function Ball(x,y,xVel,yVel,exists,color,size){
    /**@see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Details_of_the_Object_Model */
   

    Shape.call(this, x ,y,xVel,yVel, exists,)
    /**@this this.color - color of the ball */
    this.color = color;
    /**@this this.size - Size of the ball */
    this.size = size;
}
//Setting the Ball prototype 
Ball.prototype = Object.create(Shape.prototype);
//Setting the Ball Constructor
Ball.prototype.constructor = Ball;

//Defining the methods on the Prototype Chain

Ball.prototype.draw = function(){
    ctx.beginPath();
    ctx.fillStyle = this.color;
    ctx.arc(this.x,this.y,this.size, 0 , 2*Math.PI);
    ctx.fill();

};
Ball.prototype.update = function(){
    //Making the balls bounce around the canvas

    if(this.x + this.size >= width){
        this.xVel = -(this.xVel)
    }
    if(this.x + this.size <= 0){
        this.xVel = -(this.xVel)
    }
    if(this.y + this.size >= height){
        this.yVel = -(this.yVel);
    }
    if(this.y + this.size <= 0){
        this.yVel = -(this.yVel);
    }

    //Making the ball move;

    this.x += this.xVel;
    this.y += this.yVel;
}

Ball.prototype.collisions = function(){
    for(let index = 0; index < balls.length; index++){
        if(!(this === balls[index])){
            const dx = (this.x - balls[index].x);
            const dy = (this.y - balls[index].y);
            const distance = Math.sqrt((dx**2)+(dy**2));
            
            if(distance < this.size + balls[index].size){
                balls[index].color = this.color = 'rgb(' + randomNumber(0,255) + ',' + randomNumber(0,255) + ',' + randomNumber(0,255) +')';
                //Making the Balls go crazy
                this.xVel += randomNumber(-1,1);
                this.yVel += randomNumber(-1,1);
            }
        }
    }
}
//Defining Evil Circle

/**
 * @class Evil
 * @classdesc Object Property for the Evil circle. 
 * @extends  Shape
 * @param x — Random x co-ordinate
 * @param y — Random y co-ordinate
 * @param xVel — Set Velocity for Evil on the x-axis
 * @param yVel — Set Velocity for Evil y-axis
 * @param exists — If exists on the screen then true
 */
function Evil(x,y,exists){
    //Made the velocity faster to keep up with the frame rate
    Shape.call(this, x , y, 20, 20, exists);

    this.color= 'ghostwhite';
    this.size = 15;
}
//Defining the Prototype for Evil
Evil.prototype = Object.create(Shape.prototype);
//defining the Constructor
Evil.prototype.constructor = Evil;

Evil.prototype.draw = function(){
    ctx.beginPath();
    ctx.strokeStyle = this.color;
    ctx.lineWidth = 4
    ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI)
    ctx.stroke();
    ctx.fill();
}
Evil.prototype.checkBounds = function(){

    if(this.x + this.size >= width){
        this.x = width - 5
    }
    if(this.x + this.size <= 0){
        this.x = 5
    }
    if(this.y + this.size >= height){
        this.y = height - 5;
    }
    if(this.y + this.size <= 0){
        this.y = 5;
    }

}
Evil.prototype.devour = function(){
    for(let index = 0; index < balls.length ; index++){
        if(balls[index].exists){
            const dx = (this.x - balls[index].x);
            const dy = (this.y - balls[index].y);
            const distance = Math.sqrt((dx**2)+(dy**2));

            if(distance < this.size + balls[index].size){
                //Taking away the balls existence (that sounds so wrong)
                balls[index].exists = false;
                //decreasing the count
                ballcount--
                //Updating the counter
                counter.textContent = `Number of Balls Left: ${ballcount}`;
                
            }
        }
    }
}
Evil.prototype.keyboardInput = function(){
    var _this = this;
    window.onkeydown = function(event){
        if(event.key === 'a' || event.key == 'Left' || event.key == 'ArrowLeft'){
            _this.x -= _this.xVel;
        }
        else if(event.key == 'd' || event.key == 'Right' || event.key == 'ArrowRight' ){
            _this.x += _this.xVel;
        }
        else if(event.key == 'w' || event.key == 'Up' || event.key == 'ArrowUp' ){
           _this.y -= _this.yVel;
        }
        else if(event.key == 's' || event.key == 'Down' || event.key == 'ArrowDown' ){
            _this.y += _this.yVel;
        };
        
    }
}
/**@var blackHole - Instantiating the Evil Object*/
let blackHole = new Evil(randomNumber(50,500),randomNumber(50,500),true);


function mouseMove(){

    let mouseX = +event.clientX;
    let mouseY = +event.clientY;

    if(mouseX > 0 && mouseX < width){
        blackHole.x = mouseX;
    }
    if(mouseY > 0 && mouseY < height){
        blackHole.y = mouseY;
    }
    console.log('Mouse ('+mouseX+','+mouseY+')');
}
//Event Listener for Moving the Mouse
document.addEventListener('mousemove',mouseMove,false);


/**@var balls - Balls Array - Where the Balls will be stored */
let balls = [];


//While Loop to draw the balls into the array

while(balls.length < 25){
    const size = randomNumber(5,20);
    let ball = new Ball(
        randomNumber(0 , size, width - size),
        randomNumber(0 , size, height - size),
        randomNumber(-10,10),
        randomNumber(-10,10),
        true,
        'rgb(' + randomNumber(0,255) + ',' + randomNumber(0,255) + ',' + randomNumber(0,255) +')',
        size,
    );
    balls.push(ball);
    // //Increments the ball count
    ballcount++;
    // //Ball Counter String Literal
    counter.textContent = `Number of Balls: ${ballcount}`;
    counter.append();
}


//Main Draw Animation Loop
/**@var loop - Main Animation Loop */
function loop(){
    ctx.fillStyle='rgba(0,0,0,0.25)';
    ctx.fillRect(0,0,width,height);
    //Found A glitch where if it was placed lower in the execution order, you get the inner fill colour changing, which shouldn't happen
    blackHole.draw();
    for(let index = 0; index < balls.length; index++){
        if(balls[index].exists){
            balls[index].draw()
            balls[index].update()
            balls[index].collisions()
        }    
    }
    //Placing this higher in the exec order. 
    //blackHole.draw()
    blackHole.checkBounds();
    blackHole.keyboardInput();
    blackHole.devour();
    
    //Restarting the Game 
    if(ballcount === 0 ){
        alert('Congratulations You have Cleared the Board of the Bouncing Balls \n would you like to Play Again?');
        //Reloads the Page
        document.location.reload();

    }  

    //Request Animation to be drawn every 60fps - This is called recursively
    requestAnimationFrame(loop)
}

loop();

//Global Strict Mode
'use strict';


/**
 * Re-writing @see assessment.js - bringing it inline with ES6 syntax.
 * Looking to apply the class module to the objects.
 * 
 * Increasing the functionality of the script.
 * IWL:
 *  - a game timer
 *  - record the previous score
 *  - have levels of increasing difficulty.
 *
 */

 
//Global


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
let ballcount = 0;
/**@var counter - Display the counter, obtains the <p> node on the DOM */
const counter = document.getElementById('counter');
/**@var timer - Display the timer, obtains the <p> node on the DOM */
const timer = document.getElementById('timer');
/**@var score - Keeps track of the score*/
let scoreCurrent = 0;
/**@var score - Display the score, obtains the <p> node on the DOM */
const score = document.getElementById('score');
/**@var hiScoreOutput - Displays the High Score, obtains the <p> node on the DOM */
const hiScoreOutput = document.getElementById('highScore');



/**
 * @class Shape
 * @classdesc Defines the properties given to Each Shape
 * 
 */
class Shape {
    /**
     * @constructor Shape 
     * @param {Number} x - Random x co-ordinate
     * @param {Number} y - Random y co-ordinate
     * @param {Number} xVel - Random Velocity on the x-axis
     * @param {Number} yVel - Random Velocity on the y-axis
     * @param {Boolean} exists - If exists on the screen then true
     */
    constructor(x, y, xVel, yVel, exists){
        /**@this this.x - X position of the Object */
        this.x = +x;
        /**@this this.y - Y position of the Object */
        this.y = +y;
        /**@this this.xVel - Velocity on the x-axis */
        this.xVel = +xVel;
        /**@this this.yVel - Velocity on the y-axis */
        this.yVel = +yVel;
        /**@this. this.exists - Tracks Object's existence: Boolean  */
        this.exists = Boolean(exists);
    }
}


/**
 * @class Ball @extends Shape
 * @classdesc This defines the Object properties that would be inherited/applied to each Ball that would be generated. 
 * 
 */
class Ball extends Shape {
    /**
     * @constructor Ball 
     * @param {Number} x - Random x co-ordinate
     * @param {Number} y - Random y co-ordinate
     * @param {Number} xVel - Random Velocity on the x-axis
     * @param {Number} yVel - Random Velocity on the y-axis
     * @param {Boolean} exists - If exists on the screen then true
     * @param {String} color - Random color for the Ball 
     * @param {Number} size -Random Size for the Ball
     */
    constructor(x, y, xVel, yVel,exists, color,size){
        //Inherits from Shape
        super(x,y,xVel,yVel,exists);
        /**@this this.color - Random Color */
        this.color = String(color);
        /**@this this.size - Random Size */
        this.size = +size;
    }
    /**
     * @method draw 
     * @description Instructions on drawing the ball
     */
    draw(){
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x,this.y,this.size, 0 , 2*Math.PI);
        ctx.fill(); 
    }
    /**
     * @method update 
     * @description Applying boundary Collision Detection to the Ball, 
     * As it interacts with bounds of the viewport it would instruct the balls to reverse their direction
     */
    update(){
        //Making the ball bounce around inside the canvas

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
    /**
     * @method collisions
     * @description Applying AABB Collision detection to each ball
     */
    collisions(){
        for(let index = 0; index < game.ballsArray.length; index++){
            //Check to see if the ball we are iterating with is the same as the ball. Since we want to apply this to every other ball and not the current ball
            if(!(this === game.ballsArray[index])){
                //Obtain the horizontal difference between current ball and other balls in the array
                const dx = (this.x - game.ballsArray[index].x);
                //Obtain the vertical difference between current ball and other balls in the array
                const dy = (this.y - game.ballsArray[index].y);
                //Distance = squareRoot(dx^2 + dy^2)
                const distance = Math.sqrt((dx**2)+(dy**2));
                
                //Applying the Collision Detection to the Ball
                if(distance < this.size + game.ballsArray[index].size){
                    game.ballsArray[index].color = this.color = 'rgb(' + randomNumber(0,255) + ',' + randomNumber(0,255) + ',' + randomNumber(0,255) +')';
                    //Making the Balls go crazy
                    this.xVel += randomNumber(-5,5);
                    this.yVel += randomNumber(-5,5);
                }
            }
        }
    }
}
/**
 * @class Evil @extends  Shape
 * @classdesc Object Property for the Evil circle. 
 */

class Evil extends Shape{
/**
 * @constructor Evil
 * @param x —  x co-ordinate
 * @param y —  y co-ordinate
 * @param exists — If exists on the screen then true
 */
    constructor(x,y,exists){
        /**@super Shape */
        super(x,y,25,25,exists);
        /**@this this.color - Color of the circle */
        this.color = 'red';
        /**@this this.size - Size of the circle */
        this.size = 15;
    }
    /**
     * @method draw
     * @description Instructions on Drawing the Evil Shape
     */
    draw(){
        ctx.beginPath();
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4
        ctx.arc(this.x, this.y, this.size, 0, 2*Math.PI)
        ctx.stroke();
        ctx.fill();
    }
    /**
     * @method checkBounds
     * @description Applies Collision detection to keep the object within the view port
     */
    checkBounds(){
            
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
    /**
     * @method devour
     * @description Applying AABB collision Detection to the object
     * As the Balls enter the parameters of the object we will remove the 
     * ball from the screen.
     */
    devour(){
        for(let index = 0; index < game.ballsArray.length ; index++){
            //Check to see if the ball we are interacting with exists 
            if(game.ballsArray[index].exists){
                //Obtain the horizontal difference between current ball and other balls in the array
                const dx = (this.x - game.ballsArray[index].x);
                //Obtain the vertical difference between current ball and other balls in the array
                const dy = (this.y - game.ballsArray[index].y);
                //Distance = squareRoot(dx^2 + dy^2)
                const distance = Math.sqrt((dx**2)+(dy**2));
    
                if(distance < this.size + game.ballsArray[index].size){
                    //Taking away the balls existence (that sounds so wrong)
                    game.ballsArray[index].exists = false;
                    //decreasing the count
                    ballcount--
                    //Updating the counter
                    counter.textContent = `Number of Balls Left: ${ballcount}`;
                    //Adding to the Score
                    scoreCurrent++
                    //updating the score
                    score.textContent = `Current Score : ${scoreCurrent}`
                }
            }
        }
    }

}


//Game Settings

/**
 * @class Game
 * @classdesc General settings of the game 
 */
class Game {
    constructor(){
        //Ball Properties
        /**@this this.ballsArray - Array of Balls */
        this.ballsArray = [];
        /**@this this.numBalls - Number of balls to be generated (default= 2) */
        this.numBalls = 2;
        //Generate the Array
        this.generateBalls()
        
        //Game Level
        /**@this this.level - Stores the level count of the game */
        this.level = 1;
        
        //Highest Score
        /**@this this.hiScore - obtains the High Score from Session Storage */
        this.hiScore= sessionStorage.getItem('hiScore') | 0;

        //Timer Properties
        /**@this this.duration - Sets the Game timer (defaults 60secs) */
        this.duration = 60;//secs
        /**@this this.start - takes the time when the DOM loads */
        this.start= Date.now();
        /**@this.difference - Time difference between the start and finish times */
        this.difference = 0
        /**@this this.minutes - Stores the minutes */
        this.minutes=0;
        /**@this this.seconds - Stores the secondes */
        this.seconds= 0;
        /**@this this.output - Stores the Time output */
        this.output = '';
        
    }
    /**
     * @method animationLoop
     * @description This is the main animation loop, it is recursively called by the requestAnimationFrame().
     * Here we define the actual game elements that would be played on the canvas. 
     */
    animationLoop(){
        //Instruct to fill the background of the canvas
        ctx.fillStyle='rgba(227, 227, 227,0.75)';
        //Fills the full screen
        ctx.fillRect(0,0,width,height);
        //Drawing the black hole circle
        blackHole.draw();
        //Timer
        game.timer()
        //High Score
        game.highScore();
      
        //Looping through the Array of Balls
        for(let index = 0; index < game.ballsArray.length; index++){
            if(game.ballsArray[index].exists){
                game.ballsArray[index].draw()
                game.ballsArray[index].update()
                game.ballsArray[index].collisions()
            }    
        }
        
        blackHole.checkBounds();
        blackHole.devour();
        
        //increasing the difficulty
        if(ballcount <= 0 && game.minutes >= 0 && game.seconds > 0 ){
            game.level++
            game.difficulty();

        } 
        //Game over
        if(game.output ==='00:00'){
            game.saveScore(scoreCurrent);
            game.restart();
        
        }
        //Request Animation 
        requestAnimationFrame(game.animationLoop)
    }
    /**
     * @method difficulty
     * @description Increasing the difficulty of the game
     */
    difficulty(){
        if(!(this.level === 1)){
            //Increase the Number Of Balls
            Math.floor(this.numBalls *= 1.5);
            //Clears the current Array
            this.ballsArray =[];
            //Regenerates the Array
            this.generateBalls(); 
        }
    }
    /**
     * @method generateBalls
     * @description Generate an array of Balls 
     */
    generateBalls(){
        //Generate the balls array
        //Change the while loop for a more efficient for-loop
        for(let index = 0; index < this.numBalls; index++){
            //Defining a random ball size
            const size = randomNumber(10,20);
            //Instantiating a new Ball
            let ball = new Ball(
                randomNumber(0, width , width - size),
                randomNumber( 0, height , height - size),
                randomNumber(-30,30),
                randomNumber(-30,30),
                true,
                'rgb(' + randomNumber(0,255) + ',' + randomNumber(0,255) + ',' + randomNumber(0,255) +')',
                size,
            );
            //Pushing the Ball to the Array
            this.ballsArray.push(ball);
            //Increments the ball count
            ballcount++;
            //Ball Counter String Literal
            counter.textContent = `Number of Balls: ${ballcount}`;
            counter.append();
        }
    }
    /**
     * @method timer
     * @description Countdown Timer. This method was provided by 'robbmj' from StackOverflow.
     * 
     * We take the difference between the time the DOM loaded and the current time and subtract it from the duration of the game, this provides us with a count down timer. We Interpolate the results into a string that can be displayed as a timer on the screen
     * 
     * @see https://stackoverflow.com/questions/20618355/the-simplest-possible-javascript-countdown-timer
     *
     * 
     */
    timer(){
        //Get the number of seconds that have elapsed since the method was called

        this.difference = this.duration- (((Date.now() - this.start)/1000) | 0);

        //minutes
        this.minutes = (this.difference /60) | 0;
        //Interpolating the result
        this.minutes = this.minutes < 10 ? '0'+ this.minutes : this.minutes;
        //Seconds
        this.seconds = (this.difference % 60) | 0;
        //Interpolating the result
        this.seconds = this.seconds < 10 ? '0'+ this.seconds : this.seconds;
        
        //Adding a Timer Warning
        this.output = this.minutes + ':' + this.seconds;
            if(this.difference < 30){
                timer.style.color = 'red';
            }
        //Make the Countdown timer start at the full duration
        if( this.difference <= 0){
            //// add one second so that the count down starts at the full duration
            this.start = Date.now() + 1000;
        }
        
        //Updating the timer 
        timer.textContent = this.output;
     
        
    }
    /**
     * @method keyboardController
     * @description Creating controller inputs to affect the position of the object on the canvas
     * @param {event} event - KeyPress Event
     */
    keyboardController(event){
        if(event.key === 'a' || event.key == 'Left' || event.key == 'ArrowLeft'){
            blackHole.x -= blackHole.xVel;
        }
        else if(event.key == 'd' || event.key == 'Right' || event.key == 'ArrowRight' ){
            blackHole.x += blackHole.xVel;
       }
        else if(event.key == 'w' || event.key == 'Up' || event.key == 'ArrowUp' ){
           blackHole.y -= blackHole.yVel;
        }
        else if(event.key == 's' || event.key == 'Down' || event.key == 'ArrowDown' ){
            blackHole.y += blackHole.yVel;
        };
    
    }
    /**
     * @method mouseController
     * @description Controlling the mouse movements to also move the position of the object through the canvas
     * @param {event} event - MouseMove 
     */
    mouseController(event){
        /**@var mouseX - Tracks the mouse X-Position */
        let mouseX = +event.clientX;
        /**@var mouseY - Tracks the mouse Y-Position */
        let mouseY = +event.clientY;
        
        //If the mouse is in the ViewPort
        if(mouseX > 0 && mouseX < width){
            blackHole.x = mouseX;
        }
        if(mouseY > 0 && mouseY < height){
            blackHole.y = mouseY;
        }
    }
    /**
     * @method restart
     * @description Provides game ending instructions and restarting the game 
     */
    restart(){
        if(scoreCurrent < this.hiScore){
            alert(`!!! Game Over !!! \nYou managed to capture ${scoreCurrent} balls in ${game.duration} seconds\nYour Personal Best of ${this.hiScore} wasn't broken unfortunately.\nWould you like to try again`)
        }else{
            alert(`!!! You Beat Your Personal Best !!! \nYou managed to capture ${scoreCurrent} balls in ${game.duration} seconds\nThanks For Playing!`);
        }
        //Saving the HighScore

        this.saveScore(scoreCurrent);
        //Reload the document
        document.location.reload();
    }
    /**
     * @method saveScore
     * @method Saves the score of the game at the end of each game
     * @param {Number} score - Takes in the current score
     */
    saveScore(score){
        //removes the previous game score
        sessionStorage.removeItem('prevGameScore');
        //Sets the new previous game score
        sessionStorage.setItem('prevGameScore',score);
    }
    /**
     * @method highScore
     * @description Keeps track of the Users Highest Score
     */
    highScore(){
        /**@var prevGameScore - takes in the previous score from Session Storage */
        let prevGameScore = sessionStorage.getItem('prevGameScore') | 0;
        /**@var highScore - local variable to keep track of the score as it changes */
        let highScore;
        if(scoreCurrent > this.hiScore && scoreCurrent > prevGameScore){
            // If the current game is higher than the previous game and High score
            highScore = scoreCurrent;
            //If a High Score already exists in memory
            if(sessionStorage.getItem('hiScore')){
                //Removes the previous entry
                sessionStorage.removeItem('hiScore');
            }
            //Stores the new High Score
            sessionStorage.setItem('hiScore',highScore);
            
        }
        else if(prevGameScore > this.hiScore){
            //if the prev game beat the high score
            highScore = prevGameScore;
            //If a High Score already exists in memory
            if(sessionStorage.getItem('hiScore')){
                //Removes the previous entry
                sessionStorage.removeItem('hiScore');
            }
            //Save the Score
            sessionStorage.setItem('hiScore',highScore);
        }
        else{
            //Set the new high score for the game
            highScore = this.hiScore;
            
        }
        //Output the score
        hiScoreOutput.textContent = `Personal Best : ${highScore}`;
        
    }
}

//Instantiating Objects
/**@var game - Instantiating the Game Object */
let game = new Game();
/**@var blackHole - Instantiating the Evil Object*/
let blackHole = new Evil(randomNumber(50,500),randomNumber(50,500),true);

//Function calls on the Global Scope
game.highScore();
game.animationLoop();

//Applying the Event Handlers
document.addEventListener('keypress',game.keyboardController,false);
document.addEventListener('mousemove',game.mouseController,false);
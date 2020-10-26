
class GameSettings{
    /**
     * 
     * @param {Number} FPS - Frames Per Second (Default - 30fps == 60hz)
     * @param {Number} Friction - Friction Co-Efficient
     * @param {Number} SHIP_SIZE -Size of the Ship
     * @param {Number} SHIP_THRUST - Magnitude of the Ship Acceleration 
     * @param {Number} TURN_DEG - Turning Angle in Degrees (Default 360)
     */
    constructor(FPS,Friction,SHIP_SIZE,SHIP_THRUST,TURN_DEG){
        /**
         * @this this.FPS  Frames Per Second
         * @type {Number} 
         */
        this.FPS = Number(FPS); 
        /**
         * @this this.Friction Friction Co-efficient
         * @type {Number}
         * @description Adds a Friction co-efficient to the movement of the ship:
         *  0 - No Friction <= x <= 1 - 100% Friction (maximum resistance)
         */
        this.FRICTION = Number(Friction); 
        /**
         * @this this.SHIP_SIZE Size of the Ship
         * @type {Number}
         * @description Size of the Ship
         */
        this.SHIP_SIZE = Number(SHIP_SIZE);
        /**
         * @this this.SHIP_THRUST 
         * @type {Number}
         * @description Acceleration of the Ship, in px/sec^2
         */
        this.SHIP_THRUST = Number(SHIP_THRUST);
        /**
         * @this this.TURN_DEG
         * @type {Number}
         * @description This is the turning angle in deg/s. 
         */
        this.TURN_DEG = Number(TURN_DEG);

    }
    
}   


const gameSettings = new GameSettings(30,0.5,15,2,360);

class ParentObject{
    /**
     * 
     * @param {Number} posX - Position of Object on the X-Axis
     * @param {Number} posY - Position of Object on the y-Axis
     * @param {Number} radius - Radius of the Object in px's
     * @param {Number} angle  - The Angle of the Object
     * @param {Number} rotation  - The number of Degrees the Object can Turn
     */
    constructor(posX,posY,radius,angle,rotation){
        /**
         * @this this.x - Position of the Object on the X-Axis
         */
        this.x = Number(posX);
        /**
         * @this this.y - Position of the Object on the Y-Axis
         */
        this.y = Number(posY);
        /**
         * @this this.r - Radius of the object
         */
        this.r = Number(radius);
        /**
         * @this this.a - Angle of the Object 
         * @returns Angle from Degrees to Radians
         */
        this.a = convertRadians(angle);
        /**
         * @this this.rot - The Maximum Rotational Amount in Radian, which is 2Pi, or 360deg 
         */
        this.rot = convertRadians(rotation);
    }

}

class ShipObj extends ParentObject{
    /**
     * @param {Number} posX - Position of Object on the X-Axis
     * @param {Number} posY - Position of Object on the y-Axis
     * @param {Number} radius - Radius of the Object in px's
     * @param {Number} angle  - The Angle of the Object
     * @param {Number} rotation  - The number of Degrees the Object can Turn 
     * @param {Boolean} thrusting - Registers if Thrust is Active (True - on)
     * @param {Object} thrustVector - Provides a vector for the thrust
     */
    constructor(posX,posY,radius,angle,rotation,thrusting,thrustVector){
        //Inheriting Properties from the ParentObject Class
        super(posX,posY,radius,angle,rotation);
        const objProto = Object.getPrototypeOf(this);
        console.log(Object.getOwnPropertyNames(objProto))
        console.log(this.moveShip)
        /**
         * @this this.thrusting - True - Ship Thrust is On: False - Ship Thrust is off
         */
        this.thrusting = Boolean(thrusting);
        /**
         * @this this.thrust - Imports a vector object containing  directional or magnitude of the thrust {x,y}
         */
        this.thrust = {...thrustVector};
    }
    drawShip(){
        //drawing the ship
        ctx.strokeStyle = "white";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo( // nose of the ship
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
    
        ctx.closePath();//Finishes of the Triangle
        ctx.stroke();
    
        //center dot
        ctx.fillStyle = "green";
        ctx.fillRect(this.x - 1, this.y - 1, 2, 2);
    
        //Rotate Ship
        
        this.a += this.rot
    
        //Move Ship
        if(this.thrusting){
            //Add Thrust vector 
            this.thrust.x += gameSettings.SHIP_THRUST * Math.cos(this.a) / FPS ** 1/2;
            this.thrust.y -= gameSettings.SHIP_THRUST * Math.sin(this.a) / FPS ** 1/2 ;
            //Draw thrust animation
            ctx.beginPath();
            ctx.strokeStyle = "yellow";
            ctx.fillStyle = "red"
            ctx.lineWidth = 2;
            ctx.moveTo( // rear center behind the ship
                this.x - 4 / 3 * this.r * Math.cos(this.a),
                this.y + 4 / 3 * this.r * Math.sin(this.a)
            );
            ctx.lineTo( // rear left
                this.x - this.r * (2 / 3 * Math.cos(this.a) +  0.5*Math.sin(this.a)),
                this.y + this.r * (2 / 3 * Math.sin(this.a) - 0.5*Math.cos(this.a))
            );
            ctx.lineTo( // rear right
                this.x - this.r * (2 / 3 * Math.cos(this.a) -  0.5 * Math.sin(this.a)),
                this.y + this.r * (2 / 3 * Math.sin(this.a) + 0.5 * Math.cos(this.a))
            );
            ctx.fill();//Fill in the Shape
            ctx.closePath();//Finishes of the Triangle
            ctx.stroke();
        }
        if(!this.thrusting){
            //Applying Friction to slow down the ship when Not thrusting
            this.thrust.x -= gameSettings.FRICTION * this.thrust.x /FPS
            this.thrust.y -= gameSettings.FRICTION * this.thrust.y /FPS
    
        }
        //Move the Ship
        this.x += this.thrust.x;
        this.y += this.thrust.y;
    
        //Handling the Edge Off Screen Adjustments
        screenEdges(this)
    }
    

}
let newShip = new ShipObj(
                canvas.width/2,
                canvas.height/2,
                gameSettings.SHIP_SIZE/2,
                90,
                gameSettings.TURN_DEG,
                false,
                {x:5,y:0})



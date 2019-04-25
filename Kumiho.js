window.countFPS = (function () {
  var lastLoop = (new Date()).getMilliseconds();
  var count = 1;
  var fps = 0;

  return function () {
    var currentLoop = (new Date()).getMilliseconds();
    if (lastLoop > currentLoop) {
      fps = count;
      count = 1;
    } else {
      count += 1;
    }
    lastLoop = currentLoop;
    return fps;
  };
}());

class Kumiho{
	constructor(CanvasID) {
		this.Canvas = document.getElementById(CanvasID);
		this.$global = {};
		this.MouseClick = false;
		this.keyPressed = new Array();
		this.MouseX= 0;
		this.MouseY= 0;
		
		this.Controls = {



			keydown: function(e) {
				this.keyPressed[e.keyCode] = true;
			},

			keyup: function(e) {
				this.keyPressed[e.keyCode] = false;
			},

			Mousedown: function(e) {
				this.MouseClick = true;
				this.MouseX = e.clientX;
				this.MouseY = e.clientY;
			},

			Mouseup: function(e) {
				this.MouseClick = false;
				this.MouseX = 0;
				this.MouseY = 0;
			},

		};
		

		this.Context = this.Canvas.getContext("2d");
		this.Camera = new Camera(this.Canvas.width,this.Canvas.height);	
		this.counter = 0;
		this.Canvas.addEventListener('mousedown', this.Controls.Mousedown);
		this.Canvas.addEventListener('mouseup', this.Controls.Mouseup);
		
		document.addEventListener("keydown", this.Controls.keydown);
		document.addEventListener("keyup", this.Controls.keyup);


	}
	
	Text (options) {return new Text(this.Context,this.Camera,options);}
	
	Regtengel (options) {return new Regtengel(this.Context,this.Camera,options);}
	
	Scene (Image) {return new Scene(this.Canvas,this.Context,this.Camera,Image);}
	

	run(game) {
		this.then = Date.now();
		this.game = game;
		this.game.init(this.$global);
		this.loop();
	}

	loop(){
		this.setDelta();
		this.game.update(this.$global);
		this.Context.clearRect(0, 0, this.Canvas.width, this.Canvas.height);
		this.game.draw(this.$global);
		window.webkitRequestAnimationFrame(this.loop.bind(this));
	}

	setDelta() {
        this.now = Date.now();
        this.delta = (this.now - this.then) / 1000; // seconds since last frame
        this.then = this.now;
    }
	

	
	static random(a, b) { 
		return Math.floor(Math.random() * b) + a;
	}
	
	

}

class Camera {

	constructor(width,height) {
		this.X =  0;
		this.Y = 0;
		this.width = width;
		this.height = height;
		this.MaxW = width;
		this.MaxH = height;
		this.Speed = 10;
		this.MinX = 0;
		this.MinY = 0;

	}



    fallow(GameObject) {

        var currentX = (GameObject.x - (this.X + (this.width / 2))) + this.X;
        var currentY = (GameObject.y - (this.Y + (this.height / 2))) + this.Y;


        if (currentX >= this.MinX && currentX <= this.MaxW - this.width) {
            this.X = currentX;
        }

        if (currentY >= this.MinY && currentY <= this.MaxH - this.height) {
            this.Y = currentY;
        }

    }



};

class GameObject {
	constructor(Context,Camera,options) {
		this.Context = Context
		this.Camera = Camera
		this.w = options.width;
        this.h = options.height;
        this.speed = options.Speed;
        this.x = options.X;
        this.y = options.Y;

	}

	draw() {}
}

class Regtengel extends GameObject {
	constructor(Context,Camera,options) {
		super(Context,Camera, options);
		this.Color =  options.Color || "#E88813" ;
	}

	draw() {
        this.Context.fillStyle = this.Color;
        this.Context.fillRect(this.x - this.Camera.X, this.y - this.Camera.Y, this.w, this.h);
    }
}

class Text extends GameObject {
	constructor(Context,Camera,options) {
		super(Context,Camera, options);
		this.Color =  options.Color || "#E88813" ;
		this.font = options.font || "30px Arial";;
        this.message = options.message || "";
	}

    draw () {
        this.Context.font = this.font;
        this.Context.fillStyle = this.Color;
        this.Context.fillText(this.message, this.x, this.y);

    };

}

class Sprite extends GameObject {
	 
	constructor(Context,Camera,options) {
		super(Context,Camera, options);
        this.image = options.image;
        this.cols = options.cols;
        this.rows = options.rows;
        this.tileIndex = options.tileIndex;
	}

        CalCoordinate (value) {

            var xy = {};
			
			if(value == that.rows * that.cols)
			{
				xy.y = that.rows -1
				xy.x = that.cols -1					
			}			
		
			if(value > that.cols)
			{
		
				if(value % that.cols > 0)
				{
					xy.y = Math.floor(value / that.cols);
					xy.x = value % that.cols -1;					
				}
				else
				{
					xy.y = Math.floor(value / that.cols)-1;
					xy.x = that.cols-1;					
				}
				
			}
			else
			{
				xy.y = 0
				xy.x = value -1;
			}


            return xy;
        }
		




        Draw () {

			if(Kumiho.CheckCollision(that.x,that.y,that.w,that.h,Kumiho.Camera.X,Kumiho.Camera.Y,Kumiho.GameObject.Canvas.width,Kumiho.GameObject.Canvas.height)){
				var Cor = CalCoordinate(that.tileIndex)
				Kumiho.GameObject.Context.drawImage(
					that.image,
					Cor.x * that.w,
					Cor.y * that.h,
					that.w -5 ,
					that.h -5,
					that.x - Math.round(Kumiho.Camera.X),
					that.y - Math.round(Kumiho.Camera.Y),
					that.w,
					that.h);
			}
        };

    }

class Scene  {
	
	constructor(Canvas,Context,Camera,Image) {
		this.Canvas	= Canvas;
		this.Context = Context
		this.Camera = Camera
		this.Image =  Image;
		this.w = this.Image.width;
        this.h = this.Image.height;
		this.speed =  50;

	
	}	

    draw () {
	
        this.Context.drawImage(
        this.Image,
       (this.Camera.X * this.speed) / 100,
       (this.Camera.Y * this.speed) / 100,
        this.Canvas.width,
        this.Canvas.height,
        0,
        0,
        this.Canvas.width,
        this.Canvas.height);

    }

};

class SpriteCollaction {

	constructor() {
        this.SpriteArray = [];
	}


    add (sprite) {
          this.SpriteArray.push(sprite);
    }

    each (f) {

        for (var i = 0; i < this.SpriteArray.length; i++) {
            let s = this.SpriteArray[i];
            f(s);
		}

   }

   eachWhitIndex (f) {

        for (var i = 0; i < this.SpriteArray.length; i++) {
            let s = this.SpriteArray[i];
            f(s, i);
        }

   }

    remove (sprite) {

        for (var i = this.SpriteArray.length - 1; i >= 0; i--) {

            if (this.SpriteArray[i] == sprite) {
                this.SpriteArray.splice(i, 1);
            }
        }
    }

    draw() {

        for (var i = 0; i < this.SpriteArray.length; i++) {
              this.SpriteArray[i].draw();
        }

    };

    get (index) {

        return this.SpriteArray[index];

    }


    checkCollision (x1, y1, w1, h1, x2, y2, w2, h2) {
        if (x1 + w1 > x2 && x2 + w2 > x1 && y1 + h1 > y2 && y2 + h2 > y1) { return true; }
        return false;
    }

}



function createEnemy(){

	var r=genRandom(0,1);
		
	var cfg = {
		img : "enemy",

		x : r?500:0,
		y : 294,

		//x/y坐标的最大值和最小值, 可用来限定移动范围.
		minX : 0,
		maxX : 500,
		minY : 0,
		maxY : 294,
		
		handleInput : function(){
			var s=genRandom(-4,4);
			var moveSpeed=(150+s*10)/1000;			
			this.speedX=this.speedX||moveSpeed;
			if (this.x<=this.minX){
				this.x=this.minX;
				this.speedX= moveSpeed;
			}else if (this.x>=this.maxX){
				this.x=this.maxX;
				this.speedX=-moveSpeed;
			}
		},

		defaultAnimId : "move",		
		anims : {
			
			"move" : new Animation({
					img : "enemy" ,
					frames : [
						{x : 0, y : 0, w : 50, h : 50, duration : 100 },
						{x : 50, y : 0, w : 50, h : 50, duration : 100  },
						{x : 100, y : 0, w : 50, h : 50, duration : 100  },
						{x : 150, y : 0, w : 50, h : 50, duration : 100  }
					]
				})
		}
			
	};
	return new Sprite(cfg) ;
}


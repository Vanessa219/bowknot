
function Game(cfg){
	for (var attr in cfg){
		this[attr]=cfg[attr];
	}
}

Game.prototype={
	constructor : Game ,
	
	width : 640,
	height : 480,
	
	canvas : null,
	gc : null,

	FPS : 40 ,
	sleep : 0,	

	sprites : null,
	
	init : function(){
	
		this.canvas=document.createElement("canvas");
		this.canvas.width=this.width;
		this.canvas.height=this.height;
		document.body.appendChild(this.canvas);
	
		this.gc=this.canvas.getContext("2d");
		
		this.initEvent();
		
		if (this.FPS){
			this.sleep=Math.floor(1000/this.FPS);
		}
		
		this.sprites=this.sprites||[];
		for (var i=0,len=this.sprites.length;i<len;i++){
			this.sprites[i].init();
		}

	},

	initEvent : function(){
		//监听整个document的keydown,keyup事件, 为了保证能够监听到, 监听方式使用Capture
		
		document.addEventListener("keydown",function(evt){
			//按下某按键, 该键状态为true 
			KeyState[evt.keyCode]=true;
		},true);
		document.addEventListener("keyup",function(evt){
			//放开下某按键, 该键状态为true 
			KeyState[evt.keyCode]=false;
		},true);	
	},
	
	start : function(){
		var Me=this;
		//主循环
		this.mainLoop=setInterval(function(){
		
			//距上一次执行相隔的时间.(时间变化量), 目前可近似看作sleep.
			var deltaTime=Me.sleep;
			
			Me.update(deltaTime);
			Me.clear(deltaTime);
			Me.draw(deltaTime);

			//处理输入,当前输入,影响下一次迭代.
			Me.handleInput();
			
		},Me.sleep);
	
	},

	
	update : function(deltaTime){
		for (var i=0,len=this.sprites.length;i<len;i++){
			var sprite=this.sprites[i];
			sprite.update(deltaTime);
		}
	},

	clear : function(deltaTime){
		//使用背景覆盖的方式 清空之前绘制的图片
		this.gc.drawImage(ImgCache["bg"],0,0);
	},
	
	draw : function(deltaTime){
		for (var i=0,len=this.sprites.length;i<len;i++){
			var sprite=this.sprites[i];
			sprite.draw(this.gc);
		}
	},
	handleInput : function(){
		for (var i=0,len=this.sprites.length;i<len;i++){
			var sprite=this.sprites[i];
			if (sprite.handleInput){
				sprite.handleInput();
			}
		}
	}
	
};
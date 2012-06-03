
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
			Me.run(deltaTime);
		},Me.sleep);
	
	},
	
	//主循环中要执行的操作
	run : function(deltaTime){
	
		//碰撞检测
		var coll=this.checkCollide();
		if (coll){
			//如果发生敌人和玩家的碰撞,则结束游戏.
			clearInterval(this.mainLoop);
			alert("Game Over");
			return;
		}
			
		this.update(deltaTime);
		this.clear(deltaTime);
		this.draw(deltaTime);

		//处理输入,当前输入,影响下一次迭代.
		this.handleInput();

	},

	//碰撞检测,返回true 则发生了主角和敌人的碰撞.
	checkCollide : function(){
		//本示例中, 主角为第一个精灵.
		var player=this.sprites[0];
		for (var i=1,len=this.sprites.length;i<len;i++){
			var sprite=this.sprites[i];
			var coll=sprite.collideWidthOther(player);
			if (coll){
				return coll;
			}
		}
		return false;
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
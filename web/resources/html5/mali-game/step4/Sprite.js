

function Sprite(cfg){
	for (var attr in cfg){
		this[attr]=cfg[attr];
	}
}

Sprite.prototype={
	constructor :Sprite ,
	
	//精灵的坐标
	x : 0,
	y : 0,
	//精灵的速度
	speedX : 0,
	speedY : 0,

	//精灵的坐标区间
	minX : 0,
	maxX : 9999,
	minY : 0,
	maxY : 9999,
	
	//精灵包含的所有 Animation 集合. Object类型, 数据存放方式为" id : animation ".
	anims : null,
	//默认的Animation的Id , string类型
	defaultAnimId : null,
	
	//当前的Animation.
	currentAnim : null,	
	
	//初始化方法
	init : function(){
		//初始化所有Animtion
		for (var animId in this.anims){
			var anim=this.anims[animId];
			anim.id=animId;
			anim.init();
		}
		//设置当前Animation
		this.setAnim(this.defaultAnimId);
	},
	
	//设置当前Animation, 参数为Animation的id, String类型
	setAnim : function(animId){
		this.currentAnim=this.anims[animId];
		//重置Animation状态(设置为第0帧)
		this.currentAnim.setFrame(0);
	},
	
	// 更新精灵当前状态.
	update : function(deltaTime){
		//每次循环,改变一下绘制的坐标. 
		this.x=this.x+this.speedX*deltaTime; //向右移动
		this.y=this.y+this.speedY*deltaTime; //向上移动, 坐标y减小,这点和数学中的坐标系不同.
		
		//限定移动范围
		this.x=Math.max(this.minX,Math.min(this.x,this.maxX));
		this.y=Math.max(this.minY,Math.min(this.y,this.maxY));
		
		if (this.currentAnim){
			this.currentAnim.update(deltaTime);
		}
		
	},

	//绘制精灵
	draw : function(gc){
		if (this.currentAnim){
			this.currentAnim.draw(gc, this.x, this.y);
		}
	}
	
};


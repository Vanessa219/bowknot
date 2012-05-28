
// 加载图片
function loadImage(srcList,callback){
	var imgs={};
	var totalCount=srcList.length;
	var loadedCount=0;
	for (var i=0;i<totalCount;i++){
		var img=srcList[i];
		var image=imgs[img.id]=new Image();		
		image.src=img.url;
		image.onload=function(event){
			loadedCount++;
		}		
	}
	if (typeof callback=="function"){
		var Me=this;
		function check(){
			if (loadedCount>=totalCount){
				callback.apply(Me,arguments);
			}else{		
				setTimeout(check,100);
			}	
		}
		check();
	}
	return imgs;
}

//取得闭区间那的随机整数
function genRandom(lower, higher) {
	lower = lower || 0;
	higher = higher || 9999;
	return Math.floor( (higher - lower + 1) * Math.random() ) + lower;
}

//定义全局对象
var ImgCache=null;

//用来记录按键状态
var KeyState={};

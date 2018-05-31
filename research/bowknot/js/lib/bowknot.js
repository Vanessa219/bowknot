/*
 * Copyright (C) 2011, Liyuan Li
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

(function($){
    var Bowknot=function(){};
    
    $.extend(Bowknot.prototype,{
        bowknot:{
            version:"0.0.0.9",
            author:"lly219@gmail.com"
        },
        
        getDefaults:function(defaults,settings,key){
            if(key==="styleClass"){
                if(settings.theme==="default"||settings.theme===undefined){
                    return defaults.styleClass
                }
                settings.styleClass={};
                
                for(var styleName in defaults[key]){
                    settings.styleClass[styleName]=settings.theme+"-"+defaults.styleClass[styleName]
                }
            }else if((key==="height"&&settings[key]!=="auto")||key==="width"){
                if(settings[key]===null||settings[key]===undefined){
                    return defaults[key]+"px"
                }else{
                    return settings[key]+"px"
                }
            }else{
                if(settings[key]===null||settings[key]===undefined){
                    return defaults[key]
                }
            }
            return settings[key]
        },
        
        strToInt:function(str){
            if(!str){
                return;
            }
            return parseInt(str.substring(0,str.length-2))
        },
        
        sortNumber:function(a,b){
            return a-b
        },
        
        getMaxNumber:function(arr){
            arr.sort(this.sortNumber);
            return arr[arr.length-1]
        },
        
        getMinNumber:function(arr){
            arr.sort(this.sortNumber);
            return arr[0]
        },
        
        getDate:function(a,b){
            var c=new Date(a);
            var d=c.getFullYear().toString().substr(2, 2),month=c.getMonth()+1,day=c.getDate(),hours=c.getHours(),seconds=c.getSeconds(),minutes=c.getMinutes();
           
            switch(b){
                case undefined:
                    return month + "/" + day + "/" + d;
                    break;
                case 1:
                    return d+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds;
                    break;
                default:
                    return false;
                    break
            }
        },
        
        ellipsis:function(a,b){
            var c=0,strTrim=a.replace(/(^\s*)|(\s*$)/g,""),strArray=strTrim.split(""),resultStr="";
            for(var i=0;i<strArray.length;i++){
                if(c<b){
                    if(strArray[i]&&strArray[i].match(/[^u4E00-u9FA5]/)){
                        c+=2
                    }else{
                        c++
                    }
                    resultStr+=strArray[i]
                }
            }
            if(strTrim!==resultStr){
                resultStr+="..."
            }
            return resultStr
        },
        
        goTop:function(acceleration,time){
            acceleration=acceleration||0.1;
            time=time||16;
            var x1=0;
            var y1=0;
            var x2=0;
            var y2=0;
            var x3=0;
            var y3=0;
            if(document.documentElement){
                x1=document.documentElement.scrollLeft||0;
                y1=document.documentElement.scrollTop||0
            }
            if(document.body){
                x2=document.body.scrollLeft||0;
                y2=document.body.scrollTop||0
            }
            var x3=window.scrollX||0;
            var y3=window.scrollY||0;
            var x=Math.max(x1,Math.max(x2,x3));
            var y=Math.max(y1,Math.max(y2,y3));
            var speed=1+acceleration;
            window.scrollTo(Math.floor(x/speed),Math.floor(y/speed));
            if(x>0||y>0){
                var invokeFunction="$.bowknot.goTop("+acceleration+", "+time+")";
                window.setTimeout(invokeFunction,time)
            }
        }
    });
    $.bowknot=new Bowknot()
})(jQuery);
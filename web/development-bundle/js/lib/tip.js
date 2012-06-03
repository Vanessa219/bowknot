(function($){
    $.fn.extend({
        tip:{
            version:"0.0.0.3",
            author:"lly219@gmail.com"
        }
    });
    var f=new Date().getTime();
    var g='tip';
    var h=function(){
        this._defaults={
            "styleClass":{
                "panel":"tip-panel"
            }
        },this._settingsDataFormat={}
    };

    $.extend(h.prototype,{
        _attach:function(a,b){
            if(!a.id){
                this.uuid++;
                a.id='dp'+this.uuid
            }
            var c=this._newInst($(a));
            c.settings=$.extend({},b||{});
            $.data(a,g,c);
            this._init(a)
        },
        _newInst:function(a){
            var b=a[0].id.replace(/([^A-Za-z0-9_])/g,'\\\\$1');
            return{
                id:b
            }
        },
        _getInst:function(a){
            try{
                return $.data(a,g)
            }catch(err){
                throw'Missing instance data for this tip.';
            }
        },
        _destroyTip:function(a){
            $.removeData(a,g);
            $("#"+a.id+"Panel").remove()
        },
        _init:function(a){
            var b=this._getInst(a);
            var c=b.id,settings=b.settings;
            var d='',styleClass=settings.className?settings.className:this._getDefaults($.tip._defaults,settings,"styleClass").panel;
            d="<div id='"+c+"Panel' class='"+styleClass+"'>"+settings.content+"</div>";
            $(settings.appendId?"#"+settings.appendId:"body").append(d);
            $(a).hover(function(){
                $.tip._parsePosition(settings,a);
                $("#"+c+"Panel").fadeIn("normal")
            },function(){
                $("#"+c+"Panel").fadeOut("normal")
            })
        },
        _optionTip:function(a,b,c){
            var d=$.tip._getInst(a[0]);
            var e=d.settings;
            if(c){
                e[b]=c;
                $("#"+a[0].id+"Panel").html(c)
            }
            return e[b]
        },
        _parsePosition:function(a,b){
            var c="",$targetPanel=$("#"+b.id+"Panel");
            if(a.left===undefined&&a.right===undefined&&a.bottom===undefined&&a.top===undefined&&a.position===undefined){
                a.position="bottom"
            }
            if(a.position){
                var d=$(b);
                switch(a.position){
                    case"top":
                        c="left: "+parseInt(d.position().left)+"px; top: "+parseInt(d.position().top-$targetPanel.height()-6-parseInt(d.css("padding-top"))-parseInt($targetPanel.css("padding-top")))+"px;";
                        break;
                    case"bottom":
                        c="left: "+parseInt(d.position().left)+"px; top: "+parseInt(d.position().top+d.height())+"px;";
                        break;
                    default:
                        alert("Has no type!");
                        break
                }
                $targetPanel.attr("style",c);
                return
            }
            if(a.left!==undefined){
                c+="left:"+a.left+"px;"
            }
            if(a.top!==undefined){
                c+="top:"+a.top+"px;"
            }
            if(a.bottom!==undefined){
                c+="bottom:"+a.bottom+"px;"
            }
            if(a.right!==undefined){
                c+="right:"+a.right+"px;"
            }
            $targetPanel.attr("style",c)
        },
        _getDefaults:function(a,b,c){
            if(c==="styleClass"){
                if(b.theme==="default"||b.theme===undefined){
                    return a.styleClass
                }
                b.styleClass={};
        
                for(var d in a[c]){
                    b.styleClass[d]=b.theme+"-"+a.styleClass[d]
                }
            }else if(c==="height"||c==="width"){
                if(b[c]===null||b[c]===undefined){
                    return"auto"
                }else{
                    return b[c]+"px"
                }
            }else{
                if(b[c]===null||b[c]===undefined){
                    return a[c]
                }
            }
            return b[c]
        }
    });
    $.fn.tip=function(a){
        var b=Array.prototype.slice.call(arguments);
        if(a==="option"){
            b.shift();
            return $.tip['_'+a+'Tip'].apply($.tip,[this].concat(b))
        }
        return this.each(function(){
            typeof a=='string'?$.tip['_'+a+'Tip'].apply($.tip,[this].concat(b)):$.tip._attach(this,a)
        })
    };
    
    $.tip=new h();
    window['DP_jQuery_'+f]=$
})(jQuery);
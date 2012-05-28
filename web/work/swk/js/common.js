/**
 * @fileoverview common js.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.1, Apr 8, 2012
 */

var Common = {
    resize: function () {
        $(window).resize(function () {
            Common.setMain();
        });
    },
    
    setMain: function () {
        var winHeight = $(window).height();
        if (winHeight < 650) {
            return;
        }
        var margin = (winHeight - $("#slider").height() - $(".header").height() - $(".footer").height() - 50) / 2;
        $(".main").css("margin", margin + "px 0 " +  margin + "px 0");    
    }  
};


$(document).ready(function(){	
    $("#slider").easySlider({
        auto: false, 
        continuous: true
    });
    
    Common.setMain();
    Common.resize();
});	
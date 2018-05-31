var yx = {};
yx.init = {
    frame: function () {
        
    },
    
    nav: function () {
        $(".nav li").click(function () {
            var $it = $(this);
            if ($it.hasClass("current")) {
                return;
            }
			
            var $lastCur = $(".nav li.current"),
            $cur = $("#" + $it.data("index"));
			
            // nav style
            $lastCur.removeClass("current");
            $it.addClass("current");
			
            // content
            $("#" + $lastCur.data("index")).hide();
            if ($cur.html().replace(/\s/g, "") === "") {
                $cur.load("/" + $it.data("index") + "/index.html", function () {
					
                    });
            } else {
                $cur.show();
            }
        });
    }
};

(function () {
    yx.init.nav();
})();
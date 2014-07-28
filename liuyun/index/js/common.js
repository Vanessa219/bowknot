/*
 * Copyright (c) 2009, 2010, 2011, 2012, B3log Team
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
/**
 * @fileoverview liuyun index js.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.0, July 24, 2014
 */
var index = {
    headerScroll: function() {
        $(window).scroll(function() {
            var scrollTop = $(this).scrollTop();
            if (scrollTop > 360) {
                $(".nav").addClass("stuck");
            } else {
                $(".nav").removeClass("stuck");
            }
        });
    },
    init: function() {
        $("#skills").mouseover(function() {
            $(this).find(".progress").each(function() {
                var $progresse = $(this),
                        percentage = $progresse.data("percentage");
                $progresse.find(".bar").width($progresse.width() / 100 * percentage).html(percentage + "% &nbsp;");
            });
            
            $("#skills").unbind();
        });
    }
};

$(document).ready(function() {
    index.headerScroll();
    index.init();
    $(window).scroll();
});

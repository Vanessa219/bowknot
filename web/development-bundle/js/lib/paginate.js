/*
 * Copyright (C) 2011 Liyuan Li
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
(function ($) {
    $.fn.extend({
        paginate: {
            version: "0.0.0.7",
            author: "lly219@gmail.com"
        }
    });

    var dpuuid = new Date().getTime();
    var PROP_NAME = "paginate";

    var Paginate = function () {
        this._defaults = {
            "styleClass": {
                "pageCountClass": "paginate-pageCount",
                "goPageClass": "paginate-goPage",
                "inputPageClass": "paginate-inputPage",
                "goPageHoverClass": "paginate-goPageHover",
                "prePageClass": "paginate-prePage",
                "nextPageClass": "paginate-nextPage",
                "prePageDisableClass": "paginate-prePageDisable",
                "nextPageDisableClass": "paginate-nextPageDisable",
                "prePageHoverClass": "paginate-prePageHover",
                "nextPageHoverClass": "paginate-nextPageHover",
                "paginateClass": "paginate-paginate"
            }
        }
    };

    $.extend(Paginate.prototype, {
        _attach: function (target, settings) {
            if (!target.id) {
                this.uuid++;
                target.id = "dp" + this.uuid;
            }
            var inst = this._newInst($(target));

            inst.settings = $.extend({
                "errorMessage": "input error!"
            }, settings || {});
            $.data(target, PROP_NAME, inst);

            this._init(target);
        },

        /* Create a new instance object. */
        _newInst: function (target) {
            // escape jQuery meta chars
            var id = target[0].id.replace(/([^A-Za-z0-9_])/g, "\\\\$1");
            return {
                id: id
            };
        },

        _getInst: function (target) {
            try {
                return $.data(target, PROP_NAME);
            } catch (err) {
                throw "Missing instance data for this paginate";
            }
        },

        _init: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;

            $("#" + id).html("<div id='" + id + "Paginate' class='"
                +  this._getDefaults($.paginate._defaults, settings, "styleClass").paginateClass
                + "'></div>");

            this._build(target);
        },

        _build: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;
            var styleClass = this._getDefaults(this._defaults, settings, "styleClass"),
            pageCount = settings.pageCount,
            currentPage = settings.currentPage;
            var prePageHTML = "<$tagStart class='button paginate-page'>\
                <span class='button-left'></span>\
                <span class='button-bg'>" + settings.previousPageText + "</span>\
                <span class='button-right'></span>\
            </$tagEnd>",
            nextPageHTML = "<$tagStart class='button paginate-page'>\
                <span class='button-left'></span>\
                <span class='button-bg'>" + settings.nextPageText + "</span>\
                <span class='button-right'></span>\
            </$tagEnd>",
            pagesHTML = "",
            pageCountHTML = "<span class='" + styleClass.pageCountClass + "'>"
            + currentPage + "/" + pageCount + "</span>",
            goToPageHTML = "<div class='button'>\
                <span class='button-left'></span>\
                <span class='button-bg'>\
                    <input class='" + styleClass.inputPageClass + "' id='"+ id + "PaginateInput'/>\
                </span>\
                <span class='button-right'></span>\
            </div>\
            <a href='javascript:void(0);' class='button' id='" + id + "PaginateSubmit'>\
                <span class='button-left'></span>\
                <span class='button-bg'>" + settings.goText + "</span>\
                <span class='button-right'></span>\
            </a>";

            if (currentPage === 1 || currentPage === 0) {
                prePageHTML =  prePageHTML.replace("$tagStart", "div").replace("$tagEnd", "div");
            } else {
                prePageHTML = prePageHTML.replace("$tagStart", "a href='javascript:void(0)'").
                replace("$tagEnd", "a");
            }

            if (currentPage !== pageCount) {
                nextPageHTML = nextPageHTML.replace("$tagStart", "a href='javascript:void(0)'").
                replace("$tagEnd", "a");
            } else {
                nextPageHTML = nextPageHTML.replace("$tagStart", "div").replace("$tagEnd", "div");
            }

            switch (settings.type) {
                case "taobao":
                    var pages = this._getTaobaoPages(currentPage, pageCount),
                    currentClass = "";
                    goToPageHTML = "";
                    for (var i = 0; i < pages.length; i++) {
                        if (currentPage === pages[i].pageNum) {
                            currentClass = " pagination-current-page";
                        } else {
                            currentClass = "";
                        }
                        pagesHTML += "<span data-page='" + pages[i].pageNum
                        + "' class='pagination-pages" + currentClass + "'>"
                        + pages[i].text + "</span>";
                    }
                    break;
                case "custom":
                    var pages = settings.custom,
                    currentClass = "";
                    for (var i = 0; i < pages.length; i++) {
                        if (currentPage === pages[i]) {
                            currentClass = " pagination-current-page";
                        } else {
                            currentClass = "";
                        }
                        pagesHTML += "<span data-page='" + pages[i]
                        + "' class='pagination-pages" + currentClass + "'>"
                        + pages[i] + "</span>";
                    }
                    break;
                default:
                    break;
            }

            if (pageCount === 1) {
                $("#" + id + "Paginate").html(pageCountHTML);
            } else {
                $("#" + id + "Paginate").html(prePageHTML + pagesHTML + nextPageHTML
                    + pageCountHTML + goToPageHTML);
            }

            this._bindEvent(target);
        },
        
        _getTaobaoPages: function (currentPage, pageCount) {
            var pagination = [],
            i = 2,
            len = 4,
            begin = 3,
            end = 0,
            maxEnd = 0,
            pre = 0;

            if (currentPage >= len) {
                begin = currentPage - Math.ceil(len/2);
                maxEnd = currentPage + Math.ceil(len/2) + 1;
                if (maxEnd < pageCount) {
                    end = maxEnd;
                } else {
                    end = pageCount;
                }
            } else if (currentPage < len) {
                maxEnd = currentPage + Math.ceil(len/2) + 1;
                if (maxEnd < pageCount) {
                    end = maxEnd;
                } else {
                    end = pageCount;
                }
            }

            if (begin < 3) {
                begin = 3;
            }

            for (i = begin; i <= end; i++) {
                pagination.push({
                    "pageNum": i,
                    "text": i
                });
            }

            if (begin > 3) {
                pre = 2 + (begin -2);
                pagination.unshift({
                    "pageNum": pre,
                    "text": "..."
                });
            }

            if (pageCount < 2) {
                i = (currentPage === 0) ? 0 : 1;
            } else {
                i = 2;
            }

            for (; i >= 1; i = i-1) {
                pagination.unshift({
                    "pageNum": i,
                    "text": i
                });
            }

            if (end < pageCount) {
                pre = end + Math.ceil(len/2);
                if (pre > pageCount) {
                    pre = pageCount;
                }
                pagination.push({
                    "pageNum": pre,
                    "text": "..."
                });
            }

            return pagination;
        },

        _bindEvent: function (target) {
            var inst = this._getInst(target);
            var id = inst.id;

            // go page.
            $("#" + id + "PaginateInput").bind("keypress", {
                target: target
            }, function (event) {
                if (event.keyCode === 13) {
                    $.paginate._goToPageAction(event);
                }
            });

            $("#" + id + "Paginate .pagination-pages").bind("click", {
                target: target,
                isPage: true
            }, function (event) {
                $.paginate._goToPageAction(event);
            });
            
            $("#" + id + "PaginateSubmit").bind("click", {
                target: target
            }, this._goToPageAction);

            $("#" + id + "Paginate a.paginate-page").bind("click", {
                target: target,
                isPage: true
            }, function (event) {
                $.paginate._goToPageAction(event);
            });
        },

        _goToPageAction: function (event) {
            var target = event.data.target;
            var inst = $.paginate._getInst(target);
            var id = inst.id,
            settings = inst.settings;
            var currentPage = $("#" + id + "PaginateInput").val();

            // process click next page and pre page.
            if (event.data.isPage) {
                currentPage = settings.currentPage;
                var text = event.target.parentNode.innerText ? event.target.parentNode.innerText : event.target.parentNode.text;
                if ($.trim(text) === settings.previousPageText) {
                    currentPage--;
                } else if ($.trim(text) === settings.nextPageText){
                    currentPage++;
                } else {
                    // click page
                    currentPage = parseInt($(event.target).data("page"));
                }
            }

            // process input and submit.
            if (settings.currentPage === currentPage) {
                return;
            }
            var r =/^[0-9]*[1-9][0-9]*$/;
            if (currentPage > 0 && currentPage <= settings.pageCount &&
                r.test(currentPage)) {
                if (settings.bind(currentPage)) {
                    settings.currentPage = currentPage;
                    $.paginate._updatePaginate(target);
                }
            } else {
                alert(settings.errorMessage);
                $("#" + id + "PaginateInput").val("");
            }
        },

        _updatePaginate: function (target, updateSettings) {
            if (updateSettings) {
                $.extend(this._getInst(target).settings, updateSettings);
            }
            this._build(target);
        },

        _getDefaults: function (defaults, settings, key) {
            if (key === "styleClass") {
                if (settings.theme === "default" || settings.theme === undefined) {
                    return defaults.styleClass;
                }

                settings.styleClass = {};
                for (var styleName in defaults[key]) {
                    settings.styleClass[styleName] = settings.theme + "-" + defaults.styleClass[styleName];
                }
            } else if ((key === "height" && settings[key] !== "auto") || key === "width") {
                if (settings[key] === null || settings[key] === undefined) {
                    return defaults[key] + "px";
                } else {
                    return settings[key] + "px";
                }
            } else {
                if (settings[key] === null || settings[key] === undefined) {
                    return defaults[key];
                }
            }
            return settings[key];
        },

        _destroyPaginate: function () {

        }
    });

    $.fn.paginate = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments);

        if (typeof options === 'string') {
            otherArgs.shift();
            return $.paginate['_' + options + 'Paginate'].apply($.paginate, [this[0]].concat(otherArgs));
        }
        return this.each(function () {
            $.paginate._attach(this, options);
        });
    };

    $.paginate = new Paginate();

    // Add another global to avoid noConflict issues with inline event handlers
    window["DP_jQuery_" + dpuuid] = $;
})(jQuery);
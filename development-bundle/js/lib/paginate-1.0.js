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
            version: "0.0.1.1",
            author: "lly219@gmail.com"
        }
    });

    var dpuuid = new Date().getTime();
    var PROP_NAME = "paginate";

    var Paginate = function () {
        this._defaults = {
            "styleClass": {
                "pageCountClass": "pagination-pageCount",
                "goPageClass": "pagination-goPage",
                "prePageClass": "pagination-prePage",
                "nextPageClass": "pagination-nextPage",
                "lastPageClass": "pagination-lastPage",
                "firstPageClass": "pagination-firstPage",
                "prePageHoverClass": "pagination-prePageHover",
                "nextPageHoverClass": "pagination-nextPageHover",
                "lastPageHoverClass": "pagination-lastPageHover",
                "firstPageHoverClass": "pagination-fitstPageHover",
                "goInputClass": "pagination-goInput",
                "submitClass": "pagination-submit",
                "pageClass": "pagination-page",
                "pageHoverClass": "pagination-pageHover",
                "pageCurrentClass": "pagination-pageCurrent",
                "paginationClass": "pagination-pagination"
            },
            "pageCount": 1,
            "currentPage": 1,
            "windowSize": 5,
            "bindEvent": "",
            "isGoTo": true,
            "isPageCount": true,
            // default and black
            "theme": "default",
            "errorMessage": undefined,
            // taobao and google
            "style": "taobao",
            "firstPage": "",
            "lastPage": "",
            "nextPage": "",
            "previousPage": ""
        }
    };

    $.extend(Paginate.prototype, {
        _attach: function (target, settings) {
            if (!target.id) {
                this.uuid++;
                target.id = "dp" + this.uuid;
            }
            var inst = this._newInst($(target));

            inst.settings = $.extend({}, settings || {});
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
                throw "Missing instance data for this pagination";
            }
        },

        _destroyPagination: function () {

        },

        _updatePagination: function (target, updateSettings) {
            var inst = this._getInst(target),
            settings = inst.settings;

            for (var element in updateSettings) {
                if (typeof(updateSettings[element]) === "string" || element === "data"
                    || typeof(updateSettings[element]) === "number") {
                    settings[element] = updateSettings[element];
                } else {
                    settings[element] = $.extend(settings[element], updateSettings[element]);
                }
            }

            $.paginate._build(target);
        },

        _init: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;

            $("#" + id).append("<div id='" + id + "Pagination' class='"
                +  $.paginate._getDefaults($.paginate._defaults, settings, "styleClass").paginationClass
                + "'></div>");

            this._build(target);
        },

        _build: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;
            var currentPage = $.paginate._getDefaults($.paginate._defaults, settings, "currentPage"),
            pageCount = settings.pageCount,
            pages = [],
            bindEvent = settings.bindEvent,
            styleClass = $.paginate._getDefaults($.paginate._defaults, settings, "styleClass");
            var paginationHTML = "",
            pageCountHTML = "",
            goToPageHTML = "",
            windowSize = $.paginate._getDefaults($.paginate._defaults, settings, "windowSize"),
            style = $.paginate._getDefaults($.paginate._defaults, settings, "style");

            if ($.paginate._getDefaults($.paginate._defaults, settings, "isGoTo")) {
                goToPageHTML = "<div class='bowknot-left'>��</div><input class='" + styleClass.goInputClass + "' id='" + id
                + "PaginationInput'/><div class='bowknot-left'>ҳ</div>&nbsp;<button class='" + styleClass.submitClass + "' id='"
                + id + "PaginationSubmit'>ȷ��</button>";
            }

            if ($.paginate._getDefaults($.paginate._defaults, settings, "isPageCount")) {
                pageCountHTML = "<div class='bowknot-left'>&nbsp;��" + pageCount + "ҳ&nbsp;</div>";
            }

            switch (style) {
                case "taobao":
                    pages = this._getTaobaoPages(currentPage, pageCount);
                    break;
                case "google":
                    pages = this._getGooglePages(currentPage, pageCount, windowSize);
                    break;
                default:
                    alert("has no style!");
                    break;
            }

            // build pagination style.
            for (var i = 0; i < pages.length; i++) {
                var  paginationClass = " class='" + styleClass.pageClass + "'",
                currPageNumber = 0,
                currDisplayPageNumber = 0;
                if (pages[i] === currentPage) {
                    paginationClass = " class='" + styleClass.pageCurrentClass + "'";
                }

                if (typeof(pages[i]) === "number") {
                    currPageNumber = currDisplayPageNumber = pages[i];
                } else {
                    var currPage = pages[i].split("&");
                    currPageNumber = parseInt(currPage[0]);
                    currDisplayPageNumber = currPage[1];

                    if (currDisplayPageNumber === ">") {
                        paginationClass = " class='" + styleClass.nextPageClass + "'";
                    }

                    if (currDisplayPageNumber === "<") {
                        paginationClass = " class='" + styleClass.prePageClass + "'";
                    }
                }

                paginationHTML += "<span title='" + currPageNumber
                + "' onclick=\"jQuery.paginate._changePages('" + id + "');" + bindEvent
                + "(" + currPageNumber + ")\"" + paginationClass + ">" + currDisplayPageNumber + "</span>";
            }

            // lastPage, nextPage, previousPage and firstPage
            if (pages[0] !== 1) {
                if (settings.previousPage) {
                    paginationHTML = "<span class='"+ styleClass.prePageClass + "' title='" + (currentPage - 1)
                    + "' onclick=\"jQuery.paginate._changePages('" + id + "');" + bindEvent
                    + "(" + (currentPage - 1) + ");\">" + settings.previousPage + "</span>" + paginationHTML;
                }
                if (settings.firstPage) {
                    paginationHTML = "<span title='1' class='"+ styleClass.firstPageClass + "' onclick=\"jQuery.paginate._changePages('"
                    + id + "');" + bindEvent
                    + "(1);\">" + settings.firstPage + "</span>" + paginationHTML;
                }
            }
            if (pages[pages.length - 1] !== pageCount) {
                if (settings.nextPage) {
                    paginationHTML += "<span class='"+ styleClass.nextPageClass + "' title='" + (currentPage + 1)
                    + "' onclick=\"jQuery.paginate._changePages('" + id + "');" + bindEvent
                    + "(" + (currentPage + 1) + ");\">" + settings.nextPage + "</span>";
                }
                if (settings.lastPage) {
                    paginationHTML += "<span class='"+ styleClass.lastPageClass + "' title='" + pageCount
                    + "' onclick=\"jQuery.paginate._changePages('" + id + "');" + bindEvent
                    + "(" + pageCount + ");\">" + settings.lastPage + "</span>";
                }
            }

            $("#" + id + "Pagination").html(paginationHTML + pageCountHTML + goToPageHTML);

            // mouseover, mouseout action for page number.
            $("#" + id + "Pagination span").mouseover(function () {
                if ($(this).hasClass(styleClass.prePageClass)) {
                    this.className = styleClass.prePageHoverClass;
                } else if ($(this).hasClass(styleClass.nextPageClass)) {
                    this.className = styleClass.nextPageHoverClass;
                } else {
                    $(this).addClass(styleClass.pageHoverClass);
                }
            }).mouseout(function () {
                if ($(this).hasClass(styleClass.prePageHoverClass)) {
                    this.className = styleClass.prePageClass;
                } else if ($(this).hasClass(styleClass.nextPageHoverClass)) {
                    this.className = styleClass.nextPageClass;
                } else {
                    $(this).removeClass(styleClass.pageHoverClass);
                }
            });

            // enter action for page input.
            $("#" + id + "PaginationInput").bind("keypress", {
                target: target
            }, $.paginate._goToPage).focus();

            // submit page action.
            $("#" + id + "PaginationSubmit").bind("click", {
                target: target
            }, $.paginate._goToPage);
        },

        _changePages: function (id) {
            var target = id;

            if (typeof(id) === "string") {
                target = $("#" + id)[0];
            }

            $.paginate._build(target);
        },

        _goToPage: function (event) {
            var target = event.data.target;
            var inst = $.paginate._getInst(target);
            var id = inst.id,
            settings = inst.settings;
            var currentPage = parseInt($("#" + id + "PaginationInput").val());

            if (this.id.search(/PaginationInput/) !== -1 && event.keyCode !== 13) {
                return;
            }

            settings.currentPage =  parseInt($("#" + id + "PaginationInput").val());

            if (currentPage > 0 && currentPage <= settings.pageCount) {
                eval(settings.bindEvent + "(" + currentPage + ");");
                $.paginate._changePages(id);
            } else if (settings.errorMessage) {
                alert(settings.errorMessage);
                $("#" + id + "PaginationInput").val("");
            }
        },

        _getGooglePages: function (currentPage, pageCount, windowSize) {
            var ret = [];
            if (pageCount < windowSize) {
                for (var i = 0; i < pageCount; i++) {
                    ret.push(i + 1);
                }
            } else {
                var first = currentPage - parseInt(windowSize / 2);
                first = first < 1 ? 1 : first;
                first = first + windowSize > pageCount ? pageCount - windowSize + 1
                : first;
                for (var j = 0; j < windowSize; j++) {
                    ret.push(first + j);
                }
            }

            return ret;
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
                pagination.push(i);
            }

            if (begin > 3) {
                pre = 2 + (begin -2);
                pagination.unshift(pre + "&...");
            }

            if (pageCount < 2) {
                i = (currentPage === 0) ? 0 : 1;
            } else {
                i = 2;
            }

            for (; i >= 1; i = i-1) {
                pagination.unshift(i);
            }

            if (end < pageCount) {
                pre = end + Math.ceil(len/2);
                if (pre > pageCount) {
                    pre = pageCount;
                }
                pagination.push(pre + "&...");
            }

            if (currentPage > 1) {
                pagination.splice(0, 0, (currentPage - 1) + "&<");
            }

            if (currentPage < pageCount) {
                pagination.push((currentPage + 1) + "&>");
            }

            return pagination;
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
        }
    });

    $.fn.paginate = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments);
        return this.each(function () {
            if (options.update) {
                $.paginate._updatePagination(this, options.update);
            } else {
                typeof options === "string" ?
                $.paginate["_" + options + "Pagination"].
                apply($.paginate, [this].concat(otherArgs)) :
                $.paginate._attach(this, options);
            }
        });
    };

    $.paginate = new Paginate();

    // Add another global to avoid noConflict issues with inline event handlers
    window["DP_jQuery_" + dpuuid] = $;
})(jQuery);
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
            version: "0.0.0.9",
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
            var id = inst.id;

            $("#" + id).html("<div id='" + id + "Paginate' class='paginate-paginate'></div>");

            this._build(target);
        },

        _build: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings,
            pageCount = settings.pageCount,
            currentPage = settings.pageNo,
            totalRecords = settings.totalRecords;
            var pageCounts = Math.ceil(totalRecords / pageCount);
            
            var prePageHTML = "<$tagStart class='paginate-pre'>Pre</$tagEnd> ",
            nextPageHTML = "<$tagStart class='paginate-next'>Next</$tagEnd> ",
            goToPageHTML = "到<input class='paginate-input' id='"+ id + "PaginateInput'/>页\
            <button class='paginatie-go' href='javascript:void(0);' id='" + id + "PaginateSubmit'>go</button>";

            if (currentPage === 1 || currentPage === 0) {
                prePageHTML =  prePageHTML.replace("$tagStart", "span").replace("$tagEnd", "span");
            } else {
                prePageHTML = prePageHTML.replace("$tagStart", "a href='javascript:void(0)'").
                replace("$tagEnd", "a");
            }

            if (currentPage === pageCounts) {
                nextPageHTML = nextPageHTML.replace("$tagStart", "span").replace("$tagEnd", "span");
            } else {
                nextPageHTML = nextPageHTML.replace("$tagStart", "a href='javascript:void(0)'").
                replace("$tagEnd", "a");
            }

            $("#" + id + "Paginate").html("共" + totalRecords + "条 " 
                +  currentPage + "/" + pageCounts + "页 " + prePageHTML + nextPageHTML + goToPageHTML);

            this._bindEvent(target);
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
            
            $("#" + id + "PaginateSubmit").bind("click", {
                target: target
            }, this._goToPageAction);

            $("#" + id + "Paginate a.paginate-pre").bind("click", {
                target: target,
                type: "pre"
            }, function (event) {
                $.paginate._goToPageAction(event);
            });
            
            $("#" + id + "Paginate a.paginate-next").bind("click", {
                target: target,
                type: "next"
            }, function (event) {
                $.paginate._goToPageAction(event);
            });
        },

        _goToPageAction: function (event) {
            var target = event.data.target;
            var inst = $.paginate._getInst(target);
            var id = inst.id,
            settings = inst.settings;
            var currentPage = parseInt($("#" + id + "PaginateInput").val());
            
            var pageCounts = Math.ceil(settings.totalRecords / settings.pageCount);

            // process click next page and pre page.
            if (event.data.type === "next") {
                currentPage = settings.pageNo;
                currentPage++;
            } else if (event.data.type === "pre") {
                currentPage = settings.pageNo;
                currentPage--;
            }

            // process input and submit.
            if (settings.pageNo === currentPage) {
                return;
            }
            var r = /^[0-9]*[1-9][0-9]*$/;
            if (currentPage > 0 && currentPage <= pageCounts &&
                r.test(currentPage)) {
                settings.bind(currentPage);
            // XXX:因为异步调用，页码更新应由开发人员进行手动更新
            } else {
                settings.bind(currentPage, settings.errorMessage);
                $("#" + id + "PaginateInput").val("");
            }
        },

        _updatePaginate: function (target, updateSettings) {
            if (updateSettings) {
                $.extend(this._getInst(target).settings, updateSettings);
            }
            this._build(target);
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
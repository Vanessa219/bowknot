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
(function ($) {
    $.fn.extend({
        tabs: {
            version: "0.0.1.9",
            author: "lly219@gmail.com"
        }
    });

    var dpuuid = new Date().getTime();
    var PROP_NAME = 'tabs';

    var Tabs = function () {
    };

    $.extend(Tabs.prototype, {
        _attach: function (target, settings) {
            if (!target.id) {
                this.uuid++;
                target.id = 'dp' + this.uuid;
            }
            var inst = this._newInst($(target));

            inst.settings = $.extend({
                length: 0
            }, settings || {});
            $.data(target, PROP_NAME, inst);
            this._init(target);
        },

        /* Create a new instance object. */
        _newInst: function (target) {
            // escape jQuery meta chars
            var id = target[0].id.replace(/([^A-Za-z0-9_])/g, '\\\\$1');
            return {
                id: id
            };
        },

        _getInst: function (target) {
            try {
                return $.data(target, PROP_NAME);
            } catch (err) {
                throw 'Missing instance data for this tabs';
            }
        },

        _init: function (target) {
            var inst = this._getInst(target);
            var settings = inst.settings,
            id = inst.id;
            var $tabs = $(target).find("li");
            settings.data = [];

            for (var i = 0, j = 0; i < $tabs.length; i++) {
                if ($tabs[i].children[0].id) {
                    settings.data[j] = $tabs[i].children[0].id.replace(id + "_", "");
                    j++;
                }
            }
        },
        
        _setCurrentTabs: function (target, tabId) {
            var inst = this._getInst(target);
            var settings = inst.settings,
            id = inst.id;
            
            if ($("#" + id + "_" + tabId + " a").hasClass("tab-current")) {
                return;
            }
            
            var data = settings.data;
            for (var i = 0; i < data.length; i++) {
                var $panel = $("#" + id + "Panel_" + data[i]),
                $tab = $("#" + id + "_" + data[i]);
                if (tabId === data[i]) {
                    $panel.show();
                    $tab.find("a").addClass("tab-current");
                } else {
                    $panel.hide();
                    $tab.find("a").removeClass("tab-current");
                }
            }
        },
        
        _addTabs: function (target, addData) {
            var inst = this._getInst(target);
            var settings = inst.settings,
            id = inst.id;
            
            settings.data.push(addData.id);
            var tabHTML = "";
            if (addData.hash) {
                tabHTML = "<a href='" + addData.hash + "'>" + addData.text + "</a>";
            } else {
                tabHTML = "<span>" + addData.text + "</span>";
            }
            
            $(addData.target).before("<li><div id='" + id + "_" +
                addData.id + "'>" + tabHTML + "</div></li>");
            $("#" + id + "Panel").append("<div id=" + id + "Panel_" + addData.id + " class='none'>" + addData.content + "</div>");
        }, 
        
        _removeTabs: function (target, tagId) {
            var inst = this._getInst(target);
            var data = inst.settings.data,
            id = inst.id;
            
            for (var i = 0; i < data.length; i++) {
                if (data[i] === tagId) {
                    data.splice(i, 1);
                }
            }
            $("#" + id + "_" + tagId).remove();
            $("#" + id + "Pabel_" + tagId).remove();
        }
    });

    $.fn.tabs = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments);

        if (typeof options === 'string') {
            otherArgs.shift();
            return $.tabs['_' + options + 'Tabs'].apply($.tabs, [this[0]].concat(otherArgs));
        }
        return this.each(function () {
            $.tabs._attach(this, options);
        });
    };

    $.tabs = new Tabs();

    // Add another global to avoid noConflict issues with inline event handlers
    window['DP_jQuery_' + dpuuid] = $;
})(jQuery);
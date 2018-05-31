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
        chart: {
            version: "0.0.0.8",
            author: "lly219@gmail.com"
        }
    });

    var dpuuid = new Date().getTime();
    var PROP_NAME = 'chart',
    SCROLLBAR_WIDTH = 17;

    var Chart = function () {
        this._defaults = {
            'bgColors':['#FDEADA','#DBEEF3','#E5E0EC','#EBF1DD','#FFCBCC','#FBD5B5','#B7DDE8','#CCC1D9','#D7E3BC','#FF9999',
            '#FAC08F','#92CDDC','#B2A2C7','#C3D69B','#FF6566','#E36C09','#31859B','#5F487A'],
            'styleClass': {
                "hbPicClass": "chart-hb-pic",
                "hbCountClass": "chart-hb-count",
                "hbBarClass": "chart-bh-bar",
                "panelClass": "chart-panel",
                "vbBarClass": "chart-vb-bar",
                "vbPicClass": "chart-vb-pic",
                "vbMarkClass":"chart-vb-mark"
            }
        },

        this._settingsDataFormat = {
        }
    };

    $.extend(Chart.prototype, {
        _attach: function (target, settings) {
            if (!target.id) {
                this.uuid++;
                target.id = 'dp' + this.uuid;
            }
            var inst = this._newInst($(target));

            inst.settings = $.extend({}, settings || {});
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
                throw 'Missing instance data for this chart';
            }
        },

        _destroyChart: function () {

        },

        _init: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;

            $("#" + id).html("<div id='" + id + "Chart' style='height:"
                + settings.height + "px;width:" + settings.width + "px' class='"
                + $.chart._getDefaults(this._defaults, settings, "styleClass").panelClass + "'></div>");

            switch (settings.type) {
                case 'hb':
                    this._horizontalBar(id + "Chart", settings);
                    break;
                case 'vb':
                    this._verticalBar(id + "Chart", settings);
                    break;
                default:
                    alert('type is error!');
                    break;
            }
        },

        _verticalBar: function (id, settings) {
            var bgColors = $.chart._defaults.bgColors,
            data = settings.data,
            loading = settings.loading;
            var styleClass = $.chart._getDefaults(this._defaults, settings, "styleClass"),
            maxCount = this._getMaxCount(data),
            markWidth = 30,
            barsWidth = settings.width - 32,
            barsHeight = settings.height - 36; // 36: title height and top count heignt
            // 2: left border and right border
            var barWidth = Math.floor(barsWidth / data.length * 2 / 3 - 2),
            chartHTML = '',
            marginLeftHTML = "margin:0 " + Math.floor(barsWidth / data.length / 6)  + "px; ",
            markHTML = '';
            for(var i = 0; i < data.length; i++){
                var title = data[i].title,
                count = data[i].count,
                bgColor = bgColors[i%18],
                picHTML = '';

                var barHeight = Math.floor(count * barsHeight / maxCount),
                barMarginTop = barsHeight - barHeight;
                if (maxCount <= 0) {
                    barMarginTop = barsHeight;
                }

                if (count > -1) {
                    picHTML = "<span>" + count + "</span>" + "<div class='"
                    + styleClass.vbPicClass + "' style='width:" +  barWidth + "px;background-color:"
                    + bgColor + "; height:" + barHeight + "px;'></div>";
                }

                for (var j = 0; j < loading.length; j++) {
                    if (loading[j] === title.toString()) {
                        picHTML = settings.loadingHTML ? settings.loadingHTML : 'loading...';
                        barMarginTop = barsHeight;
                    }
                }

                chartHTML += "<div class='left " + styleClass.vbBarClass
                + "' style='" + marginLeftHTML + "margin-top:" + barMarginTop
                + "px;width:" +  barWidth + "px'>" + picHTML + "<div>" + title + "</div></div>";

            }

            if (data.length > 0) {
                markHTML = "<div class='" + styleClass.vbMarkClass
                + "' style='width:" + markWidth + "px;' class='left'>";
                for(var m = 5; m > 0; m--){
                    var marginTop = (barsHeight / 5) - 5; // 5: line-height
                    if(m == 5){
                        markHTML += "<div>" + maxCount + "</div>";
                    }else if(m == 1){
                        markHTML += "<div style='margin-top:" + marginTop + "px'>0</div>";
                    } else{
                        markHTML += "<div style='margin-top:" + marginTop + "px'>" + Math.ceil(maxCount / 5) * m + "</div>";
                    }
                }
            }

            document.getElementById(id).innerHTML = markHTML + "</div>" + chartHTML;
        },

        _horizontalBar: function (id, settings) {
            var bgColors = $.chart._defaults.bgColors,
            data = settings.data,
            loading = settings.loading ? settings.loading : [];
            var styleClass = $.chart._getDefaults(this._defaults, settings, "styleClass"),
            maxCount = this._getMaxCount(data),
            labelWidth = Math.floor(settings.width * 2 / 5 - 2 - SCROLLBAR_WIDTH), // 2: left border and right border
            picWidth = Math.floor(settings.width * 3 / 5),
            charHTML = '';

            for(var i = 0; i < data.length; i++){
                var title = data[i].title,
                label = '',
                count = data[i].count,
                picHTML = "";

                var barWidth = Math.floor(count * picWidth / maxCount),
                bgColor = bgColors[i%18];

                if(title.length > 7){
                    label = title.substr(0, 6);
                    label += '...';
                }else{
                    label = title;
                }

                if (count > -1) {
                    picHTML = "<div class='left " + styleClass.hbPicClass
                    + "' style='background-color:" + bgColor + "; width:" + barWidth + "px'>"
                    + "</div>";
                }

                for (var j = 0; j < loading.length; j++) {
                    if (loading[j] === title) {
                        picHTML = settings.loadingHTML ? settings.loadingHTML : 'loading...';
                    }
                }

                charHTML += "<div class='" + styleClass.hbBarClass + "'><span class='left' style='width:"
                + labelWidth + "px' title='" + title + "'>"
                + label + "：<span class='" + styleClass.hbCountClass + "'>" + count + "</span></span>"
                +  picHTML + "<div class='clear'></div></div>";
            }

            document.getElementById(id).innerHTML = charHTML + "<div class='clear'></div>";

            // scroll
            if ($("#" + id).attr("scrollHeight") < $("#" + id).attr("clientHeight")) {
                $("#" + id).css("margin-left", SCROLLBAR_WIDTH / 2);
            }
        },

        _getMaxCount: function (data) {
            var counts = [];
            for (var i = 0; i < data.length; i++) {
                counts[i] = data[i].count;
            }
            return $.chart._getMaxNumber(counts);
        },

        _getMaxNumber: function (arr) {
            arr.sort($.chart._sortNumber);
            return arr[arr.length - 1];
        },

        _sortNumber: function(a, b) {
            return a - b;
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

    $.fn.chart = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments);
        return this.each(function () {
            typeof options == 'string' ?
            $.chart['_' + options + 'Chart'].
            apply($.chart, [this].concat(otherArgs)) :
            $.chart._attach(this, options);
        });
    };

    $.chart = new Chart();

    // Add another global to avoid noConflict issues with inline event handlers
    window['DP_jQuery_' + dpuuid] = $;
})(jQuery);
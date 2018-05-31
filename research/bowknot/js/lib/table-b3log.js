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
        table: {
            version: "0.0.1.0",
            author: "lly219@gmail.com"
        }
    });

    var dpuuid = new Date().getTime();
    var PROP_NAME = "table";

    // Table value.
    var Table = function () {
        // If these attributes undefined in new, should be use those default value.
        this._defaults = {
            "styleClass": {
                "lineSelectedClass": "table-lineSelected",
                "mainClass": "table-main",
                "bodyClass": "table-body",
                "headerClass": "table-header",
                "lineHoverClass": "table-lineHover",
                "sortClass": "table-sort",
                "sortASCClass": "table-sortASC",
                "sortDESCClass": "table-sortDESC",
                "sortUnASCClass": "table-sortUnactiveASC",
                "sortUnDESCClass": "table-sortUnactiveDESC",
                "oddRowClass": "table-oddRow",
                "evenRowClass": "table-evenRow",
                "subTitleClass": "table-subTitle",
                "subTitleHoverClass": "table-subTitleHover",
                "subTitleShowClass": "table-subTitleShow",
                "subTitleHideClass": "table-subTitleHide",
                "expendRowClass": "table-expendRow",
                "hasExpendClass": "table-hasExpend"
            }
        }
    };

    $.extend(Table.prototype, {
        _attach: function (target, settings) {
            if (!target.id) {
                this.uuid++;
                target.id = "dp" + this.uuid;
            }
            var inst = this._newInst($(target));

            inst.settings = $.extend({
                length: 0,
                noDataTip: "no data!",
                selectedRows: []
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
                throw "Missing instance data for this table";
            }
        },

        _init: function (target) {
            var inst = this._getInst(target),
            settings = inst.settings;

            $(target).html("<div class='" + this._getDefaults(this._defaults, settings, "styleClass").mainClass
                + "' id='" + inst.id + "Table'></div>");

            this._build(target);
        },

        _build: function (target) {
            var inst = this._getInst(target),
            settings = inst.settings;
            var id = inst.id;

            var styleClass = this._getDefaults(this._defaults, settings, "styleClass");

            var tableHTML = "<div id='"
            + id + "TableHeader' class='" + styleClass.headerClass
            + "'></div>" + "<div id='" + id + "TableMain' class='" + styleClass.bodyClass
            + "' style='height:" + (settings.height ?  settings.height + "px" : "auto") + "'></div>";

            $("#" + id + "Table").html(tableHTML);

            this._buildHeader(target);
            if (settings.data) {
                this._buildBody(target);
                this._bindEvent(target);
            } 
        },

        _buildHeader: function (target) {
            var settings = this._getInst(target).settings;
            var colModel = settings.colModel,
            id = this._getInst(target).id,
            headerHTML = "<table cellpadding='0' cellspacing='0' style='width:100%'><tr>";

            for (var i = 0; i < colModel.length; i++) {
                var headerId = id + "_" + colModel[i].index;
                if (colModel[i].minWidth) {
                    headerHTML += "<th style='min-width:" + colModel[i].minWidth + "px;'>";
                } else {
                    headerHTML += "<th style='width:" + colModel[i].width + "px;'>";
                }

                if (colModel[i].type === "checkbox") {
                    if (colModel[i].isLabel) {
                        headerHTML += colModel[i].text;
                    } else {
                        headerHTML += "<input id='" + headerId
                        + "' onclick=\"DP_jQuery_" + dpuuid
                        + ".table._selectHeaderCheckbox(this);\" type='checkbox'/></th>";
                    }
                } else {
                    // TODO: sort
                    headerHTML += "<span id='" + headerId + "'>"
                    + colModel[i].text ? colModel[i].text : "" + "</span></th>";
                }
            }

            $("#" + id + "TableHeader").html(headerHTML + "</tr></table>");
        },

        _buildBody: function (target) {
            var id = this._getInst(target).id,
            settings = this._getInst(target).settings,
            data = settings.data;
            var styleClass = this._getDefaults(this._defaults, settings, "styleClass"),
            bodyHTML = "";

            for (var groupNum = 0; groupNum < data.length; groupNum++) {
                if (data[groupNum].groupName !== "all") {
                    // build sub title
                    bodyHTML += "<div  id='" + id + "SubTitle"
                    + groupNum + "'class='" + styleClass.subTitleClass
                    + "'><div class='left "
                    + styleClass.subTitleShowClass
                    + "'></div><div class='left'>" + data[groupNum].groupName
                    + "</div><div class='clear'></div></div>";
                }
                bodyHTML += "<table id=" + id + "SubTable" + groupNum
                + " style='width:100%;' cellpadding='0' cellspacing='0'>"
                + this._buildData(target, data[groupNum].groupData, groupNum) + "</table>";
            }

            $("#" + id + "TableMain").html(bodyHTML);
        },

        _buildData: function (target, data, groupNum) {
            var id = this._getInst(target).id,
            settings = this._getInst(target).settings;
            var colModel = settings.colModel,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass");
            var bodyHTML = "";
            for (var i = 0; i < data.length; i++) {
                var row = data[i],
                tBodyHTML = "<tbody class='$CLASS'>",
                trHTML = "<tr>",
                rowClass = styleClass.oddRowClass;

                if (i%2 === 1) {
                    rowClass = styleClass.evenRowClass;
                }

                if (settings.expendRow) {
                    trHTML = '<tr class="' + styleClass.hasExpendClass + '">';
                }

                // add uuid
                row.uuuid = settings.length++;

                for (var j = 0; j < colModel.length; j++) {
                    var index = colModel[j].index;
                    var dataValue = row[index],
                    styleHTML = colModel[j].align ? "text-align:"
                    + colModel[j].align + ";" : "";

                    if (dataValue === undefined || dataValue === null || $.trim(dataValue) === "") {
                        dataValue = "&nbsp;";
                    }

                    if (i === 0) {    // For first row, give it width.
                        if (colModel[j].minWidth) {
                            styleHTML += "min-width:" + colModel[j].minWidth + "px;";
                        } else {
                            styleHTML += "width:" + colModel[j].width + "px;";
                        }
                    }
                    trHTML += "<td style='" + styleHTML + "'>";

                    if (colModel[j].type) {
                        var inputHTML = "",
                        isCheckedHTML = "",
                        isDisabledHTML = "",
                        inputId = id + "_" + index + "_" + groupNum  + "_" + i;

                        if (row[index].value) {
                            isCheckedHTML = "checked='checked'";
                            tBodyHTML = tBodyHTML.replace("$CLASS", styleClass.lineSelectedClass
                                + " " + rowClass);
                            settings.selectedRows.push(row);
                        }

                        if (row[index].disabled) {
                            isDisabledHTML = "disabled='disabled'";
                        }

                        inputHTML = "<input name='" + id + "_" + index + "' id='" + inputId + "' type='"
                        + colModel[j].type + "' onclick=\"DP_jQuery_" + dpuuid
                        + ".table._selectCheckbox(this);\" "
                        + isCheckedHTML + " " + isDisabledHTML + "/>";
                        dataValue = inputHTML;
                    }

                    if (colModel[j].style) {
                        dataValue = "<div style='" + colModel[j].style + "'>"
                        + dataValue + "</div>";
                    }

                    trHTML += dataValue + "</td>";
                }
                bodyHTML += tBodyHTML.replace("$CLASS", rowClass) + trHTML + "</tr>";
                if (settings.expendRow) {
                    var expendRowData = row[settings.expendRow.index];
                    if (expendRowData === undefined) {
                        expendRowData = "";
                    }
                    bodyHTML += "<tr class='none " + styleClass.expendRowClass + " " + rowClass + "'><td colspan='" + colModel.length + "'>"
                    + expendRowData + "</td></tr>";
                }
                bodyHTML += "</tbody>";
            }
            
            if (data.length === 0) {
                bodyHTML = "<tbody><tr><td align='center' colspan='" + colModel.length + "'>" + 
                    settings.noDataTip + "</td></tr></tbody>";
            }
            return bodyHTML;
        },

        _bindEvent: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings,
            colModel = inst.settings.colModel,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass"),
            data = settings.data;

            for (var dataNum = 0; dataNum < data.length; dataNum++) {
                // bind group show or hide.
                if (data[0].groupName !== "all") {
                    $("#" + id + "SubTitle" + dataNum).click(function () {
                        var it = $(this).find("div")[0];
                        if (it.className.indexOf(styleClass.subTitleShowClass) != -1) {
                            it.className = it.className.replace(styleClass.subTitleShowClass, styleClass.subTitleHideClass);
                            $(this).next().hide();
                        } else {
                            it.className = it.className.replace(styleClass.subTitleHideClass, styleClass.subTitleShowClass);
                            $(this).next().show();
                        }
                    }).mouseover(function () {
                        this.className = styleClass.subTitleHoverClass;
                    }).mouseout(function () {
                        this.className = styleClass.subTitleClass;
                    });
                }

                var bindRows  = settings.bind ? settings.bind : [],
                groupData = data[dataNum].groupData;
                for (var m = 0; m < groupData.length; m++) {
                    var $tbody = $($("#" + id + "SubTable" + dataNum  + " tbody")[m]);
                    // bind row event
                    for (var l = 0; l < bindRows.length; l++) {
                        $tbody.bind(bindRows[l].type, {
                            "groupData": groupData[m],
                            "bindNum": l
                        }, function (event) {
                            bindRows[event.data.bindNum].action(event, event.data.groupData);
                        });
                    }

                    // bind mouseover and mouseout
                    $tbody.mouseover(function () {
                        if (!$(this).hasClass(styleClass.lineHoverClass)) {
                            $("#" + id + " tbody").each(function () {
                                $(this).removeClass(styleClass.lineHoverClass);
                                if ($(this).find("tr").length === 2) {
                                    $(this).find("tr")[1].style.display = "none";
                                }
                            });
                            $(this).addClass(styleClass.lineHoverClass);
                            if ($(this).find("tr").length === 2) {
                                if ($.browser.msie) {
                                    if ($.browser.version > 7) {
                                        $(this).find("tr")[1].style.display = "block";
                                    }
                                } else {
                                    $(this).find("tr")[1].style.display = "table-row";
                                }
                            }
                        }
                    });

                    // bind cell event
                    for (var j = 0; j < colModel.length; j++) {
                        if (colModel[j].bind) {
                            var bindCell = colModel[j].bind;
                            for (var i = 0; i < bindCell.length; i++) {
                                $($tbody.find("td")[j]).bind(bindCell[i].type, {
                                    "groupData": groupData[m],
                                    "bindNum": i,
                                    "colNum": j
                                }, function (event) {
                                    colModel[event.data.colNum].
                                    bind[event.data.bindNum].
                                    action(event, event.data.groupData);
                                });
                            }
                        }
                    }
                // end bind cell event
                }
            }
        },

        _selectHeaderCheckbox: function (it) {
            // TODO: 此处可绑定用户对 input 操作的自定义事件。
            
            var id = it.id.split("_")[0],
            index = it.id.split("_")[1];
            var settings = $("#" + id).data(PROP_NAME).settings;
            var data = settings.data,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass");
            for (var i = 0; i < data.length; i++) {
                var rows = data[i].groupData;
                for (var j = 0; j < rows.length; j++) {
                    var $checkbox = $("#" + id + "_" + index + "_" + i + "_" + j);
                    if ($checkbox.prop("disabled") === false) {
                        if (it.checked) {
                            settings.selectedRows.push(rows[j]);
                        } else {
                            settings.selectedRows.splice(j, 1);
                        }
                        $checkbox.prop("checked", it.checked);
                    }
                }
            }
            // TODO
            if (it.checked) {
                $("#" + id + "TableMain tbody").addClass(styleClass.lineSelectedClass);
            } else {
                $("#" + id + "TableMain tbody").removeClass(styleClass.lineSelectedClass);
            }
            $.unique(settings.selectedRows);
        },

        // TODO: radio event
        _selectCheckbox: function (it) {
            var id = it.id.split("_")[0],
            index = it.id.split("_")[1],
            groupNum = it.id.split("_")[2],
            rowNum = it.id.split("_")[3];
            var settings = $("#" + id).data(PROP_NAME).settings;
            var data = settings.data,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass"),
            $checkbox = $("#" + id + "_" + index),
            $row = $($("#" + id + "SubTable" + groupNum + " tbody")[rowNum]);

            if (it.checked) {
                $row.addClass(styleClass.lineSelectedClass);
                settings.selectedRows.push(data[groupNum].groupData[rowNum]);
            } else {
                $row.removeClass(styleClass.lineSelectedClass);
                for (var j in settings.selectedRows) {
                    if (settings.selectedRows[j].uuuid === data[groupNum].groupData[rowNum].uuuid) {
                        settings.selectedRows.splice(j, 1);
                    }
                }
            }

            if (settings.selectedRows.length === settings.length) {
                $checkbox.prop("checked", true);
            } else {
                $checkbox.prop("checked", false);
            }
        },

        _getRow: function (id, data, uuuid) {
            var rowObj = {};
            for (var groupNum in data) {
                var rows = data[groupNum].groupData;
                for (var row in rows) {
                    if (uuuid === rows[row].uuuid){
                        rowObj.data = rows[row];
                        rowObj.$row = $($("#" + id + "SubTable" + groupNum + " tbody")[row]);
                    }
                }
            }
            return rowObj;
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
            } else {
                if (settings[key] === null || settings[key] === undefined) {
                    return defaults[key];
                }
            }
            return settings[key];
        },

        _strToInt: function (str) {
            if(!str){
                return false;
            }
            return parseInt(str.substring(0, str.length - 2));
        },

        _updateTable: function (target, data1, data2) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;

            if (!data2) {
                if (data1.height) {
                    var height = data1.height;
                    $("#" + id + "TableMain").height(height);
                    settings.height = height;
                } else {
                    settings.data= data1.data;
                    this._build(target);
                }
            } else {
                var data = settings.data,
                colModel = settings.colModel;
                var rowObj = this._getRow(id, data, data1);

                // update row data
                $.extend(rowObj.data,data2);

                // update row
                for (var i = 0; i < colModel.length; i++) {
                    // TODO: 不支持 input 的更新
                    if (colModel[i].type !== "checkbox") {
                        var index = colModel[i].index;
                        rowObj.$row.find("td")[i].innerHTML = rowObj.data[index] ? rowObj.data[index] : "&nbsp;";
                    }
                }

                // update expend row
                if (settings.expendRow) {
                    $(rowObj.$row.find("tr")[1]).find("td").html(data2[settings.expendRow.index] ? data2[settings.expendRow.index] : "&nbsp;");
                }
            }
        },

        _getRowsTable: function (target, index, value) {
            var inst = this._getInst(target);
            var settings = inst.settings;
            if (!index) {
                return settings.selectedRows;
            }

            var getRows = [];

            for (var i = 0; i < settings.data.length; i++) {
                var rows = settings.data[i].groupData;
                for (var row in rows) {
                    if (rows[row][index] === value) {
                        getRows.push(rows[row]);
                    }
                }
            }
            return getRows;
        },

        _destroyTable: function (target) {
            var inst = this._getInst(target);
            $.removeData(target, PROP_NAME);
            $("#" + inst.id).remove();
        },

        _selectedTable: function (target, uuuid) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;
            var data = inst.settings.data,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass");
            for (var groupNum in data) {
                var rows = data[groupNum].groupData;
                for (var row in rows) {
                    if (uuuid === rows[row].uuuid){
                        settings.selectedRows.push(rows[row]);
                        $.unique(settings.selectedRows);
                        var $row = $($("#" + id + "SubTable" + groupNum + " tbody")[row]);
                        $row.addClass(styleClass.lineSelectedClass);
                        $row.find("input").prop("checked", true);
                    }
                }
            }
        },

        _unSelectedTable: function (target, uuuid){
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;
            var data = inst.settings.data,
            styleClass = this._getDefaults(this._defaults, settings, "styleClass");
            for (var groupNum in data) {
                var rows = data[groupNum].groupData;
                for (var row in rows) {
                    if (uuuid === rows[row].uuuid){
                        var selectedRows = settings.selectedRows;
                        for (var i = 0; i < selectedRows.length; i++) {
                            if (selectedRows[i].uuuid === uuuid) {
                                selectedRows.splice(i, 1);
                            }
                        }
                        var $row = $($("#" + id + "SubTable" + groupNum + " tbody")[row]);
                        $row.removeClass(styleClass.lineSelectedClass);
                        $row.find("input").prop("checked", false);
                    }
                }
            }
        }
    });

    $.fn.table = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments);

        if (typeof options === 'string') {
            otherArgs.shift();
            return $.table['_' + options + 'Table'].apply($.table, [this[0]].concat(otherArgs));
        }
        return this.each(function () {
            $.table._attach(this, options);
        });
    };

    $.table = new Table();
    // Add another global to avoid noConflict issues with inline event handlers
    window["DP_jQuery_" + dpuuid] = $;
})(jQuery);
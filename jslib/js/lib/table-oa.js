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
            version: "0.0.1.1",
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
                "lineSelectedClass": "table-selected",
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
                "evenRowClass": "table-evenRow"
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
            var inst = this._getInst(target);

            $(target).html("<div class='" + this._defaults.styleClass.mainClass
                + "' id='" + inst.id + "Table'></div>");

            this._build(target);
        },

        _build: function (target) {
            var inst = this._getInst(target),
            settings = inst.settings,
            styleClass = this._defaults.styleClass;
            var id = inst.id;

            var tableHTML = "<div id='"
            + id + "TableHeader' class='" + styleClass.headerClass
            + "'></div>" + "<div id='" + id + "TableMain' class='" + styleClass.bodyClass
            + "' style='" + (settings.height ? "height: " + settings.height + "px" : "") + "'></div>";

            $("#" + id + "Table").html(tableHTML);

            this._buildHeader(target);
            this._buildBody(target);
            this._bindEvent(target);
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
                        headerHTML += "<input id='" + headerId + "' type='checkbox'/></th>";
                    }
                } else {
                    // TODO: sort
                    headerHTML += "<span id='" + headerId + "'>"
                    + colModel[i].text ? colModel[i].text : "" + "</span></th>";
                }
            }

            $("#" + id + "TableHeader").html(headerHTML + "<th style='width:0; border-right: 0'></th></tr></table>");
        },

        _buildBody: function (target) {
            var id = this._getInst(target).id,
            settings = this._getInst(target).settings,
            data = settings.data,
            bodyHTML = "";

            bodyHTML += "<table style='width:100%;' cellpadding='0' cellspacing='0'>"
            + this._buildData(target, data) + "</table>";

            $("#" + id + "TableMain").html(bodyHTML);
            
            if ($("#" + id + "TableMain").height() < $("#" + id + "TableMain>table").height()) {
                $("#" + id + "TableHeader th").last().width(16);
            }
        },

        _buildData: function (target, data) {
            var id = this._getInst(target).id,
            settings = this._getInst(target).settings;
            var colModel = settings.colModel,
            styleClass = this._defaults.styleClass;
            
            if (data.length === 0) {
                return "<tbody><tr><td align='center' colspan='" + colModel.length + "'>" + 
                settings.noDataTip + "</td></tr></tbody>";
            }
            
            var bodyHTML = "<colgroup>";
            for (var l = 0; l < colModel.length; l++) {
                if (colModel[l].minWidth) {
                    bodyHTML += "<col style='" 
                    + (colModel[l].minWidth ? "min-width:" + colModel[l].minWidth + "px;" : "") 
                    + "'></col>";
                } else {
                    bodyHTML += "<col style='" 
                    + (colModel[l].width ? "width:" + colModel[l].width + "px;" : "") 
                    + "'></col>";
                }
            }
                
            bodyHTML += "</colgroup><tbody>";
             
            for (var i = 0; i < data.length; i++) {
                var row = data[i],
                tBodyHTML = "",
                rowClass = styleClass.oddRowClass;

                if (i%2 === 1) {
                    rowClass = styleClass.evenRowClass;
                }
                
                var trHTML = "<tr class=" + rowClass + ">";

                for (var j = 0; j < colModel.length; j++) {
                    var index = colModel[j].index;
                    var dataValue = row[index],
                    styleHTML = colModel[j].align ? "text-align:"
                    + colModel[j].align + ";" : "";

                    if (dataValue === undefined || dataValue === null || $.trim(dataValue) === "") {
                        dataValue = "&nbsp;";
                    }
                    
                    trHTML += "<td><div style=" + styleHTML + ">";

                    if (colModel[j].type) {
                        var inputHTML = "",
                        inputId = id + "_" + index + "_" + i;

                        inputHTML = "<input data-id='" + row.id + "' id='" + inputId + "' type='"
                        + colModel[j].type + "'>";
                        dataValue = inputHTML;
                    }

                    trHTML += dataValue + "</div></td>";
                }
                bodyHTML += tBodyHTML + trHTML + "</tr>";
            }
            
            return bodyHTML + "</tbody>";
        },
        
        _bindEvent: function (target) {
            var id = this._getInst(target).id,
            colModel = this._getInst(target).settings.colModel;
            
            var _it = this;
            
            // bind header checkbox
            var index = "";
            for (var l = 0; l < colModel.length; l++) {
                if (colModel[l].type === "checkbox") {
                    index = colModel[l].index;
                }
            }
            $("#" + id + "_" + index).click(function () {
                _it._selectHeaderCheckbox(id, this);
            });
            
            // bind all checkbox
            $("#" + id + "TableMain input").click(function () {
                _it._selectCheckbox(id, index, this);
            });
        },
        
        _selectHeaderCheckbox: function (id, it) {
            $("#" + id + "TableMain input").prop("checked", it.checked);
            var settigns = $("#" + id).data(PROP_NAME).settings;
            var selectedRows = settigns.selectedRows,
            data = settigns.data;
            
            if (it.checked) {
                for (var i = 0; i < data.length; i++) {
                    selectedRows.push(data[i].id);
                }
                $("#" + id + "TableMain tr").addClass("table-selected");
            } else {
                for (var i = 0; i < data.length; i++) {
                    for (var j = 0; j < selectedRows.length; j++) {
                        if (selectedRows[j] === data[i].id){
                            selectedRows.splice(j, 1);
                            break;
                        }
                    }
                }
                $("#" + id + "TableMain tr").removeClass("table-selected");
            }
            $.unique(selectedRows);
        },

        _selectCheckbox: function (id, index, it) {
            var $row = $(it).parents("tr");
            
            var settigns = $("#" + id).data(PROP_NAME).settings;
            var selectedRows = settigns.selectedRows;
            
            if (it.checked) {
                selectedRows.push($(it).data("id").toString());
                $row.addClass("table-selected");
            } else {
                for (var j = 0; j < selectedRows.length; j++) {
                    if (selectedRows[j] === $(it).data("id").toString()){
                        selectedRows.splice(j, 1);
                        break;
                    }
                }
                $row.removeClass("table-selected");
            }
            
            var checkedLength = 0;
            $("#" + id + "TableMain input").each(function () {
                if (this.checked) {
                    checkedLength += 1;
                }
            }); 
            if ($("#" + id + "TableMain tr").length === checkedLength) {
                $("#" + id + "_" + index).prop("checked", true);
            } else {
                $("#" + id + "_" + index).prop("checked", false);
            }
            
            $.unique(selectedRows);
        },
        
        _getSelectedRowsTable: function (target) {
            var settings = this._getInst(target).settings;
            var data = settings.data,
            selectedRows = settings.selectedRows;
           
            var rowsData = [];

            for (var i = 0; i < data.length; i++) {
                for (var j = 0; j < selectedRows.length; j++) {
                    if (selectedRows[j] === data[i].id){
                        rowsData.push(data[i]);
                        break;
                    }
                }
            }
            return rowsData;
        },
        
        _setSelectedRowsTable: function (target, rows) {
            var settings = this._getInst(target).settings,
            id = this._getInst(target).id;
            var data = settings.data,
            $inputs = $("#" + id + "TableMain input");
           
            for (var j = 0; j < rows.length; j++) {
                for (var i = 0; i < data.length; i++) {
                    if (rows[j] === data[i].id) {
                        if (!$inputs.get(i).checked) {
                            $inputs.get(i).click();
                        }
                        break;
                    }
                }
            }
        },
        
        _updateTable: function (target, data1, data2) {
          
        },

        _destroyTable: function (target) {
            var inst = this._getInst(target);
            $.removeData(target, PROP_NAME);
            $("#" + inst.id).remove();
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
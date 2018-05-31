/*
    Document   : table adapter
    Author     : Liyuan Li
    Version    : 0.0.0.2
    Description:
        Adapter for Table.
*/
var Table = function (options) {
    var id = "#" + options.id;
    this.getId = function () {
        return id;
    }
    $(id).table(options);
}
$.extend(Table.prototype, {
    setHeight: function (height) {
        var id = this.getId();
        $(id).table("update", {
            "height": height
        });
    },

    getSelectedRows: function () {
        var id = this.getId();
        return this._newRows($(id).table("getRows"));
    },

    getRows: function (index, value) {
        var id = this.getId();
        return this._newRows($(id).table("getRows", index, value));
    },

    destroy: function () {
        var id = this.getId();
        $(id).table("destroy");
    },

    _newRows: function (rows) {
        var rowList = [],
        id = this.getId();
        for (var i in rows) {
            var row = new Row(id, rows[i]);
            rowList.push(row);
        }
        return rowList;
    }
});

var Row = function (tableId, rowData) {
    var data = {};
    this.getId = function () {
        return tableId;
    }
    this.getData = function () {
        var tempData = {};
        for (var data in rowData) {
            if (data !== "uuuid") {
                tempData[data] = rowData[data];
            }
        }
        return tempData;
    }
    this.getUuuid = function () {
        return rowData.uuuid;
    }
}

$.extend(Row.prototype, {
    getData: function () {
        return this.getData();
    },

    update: function (data) {
        var id = this.getId(),
        uuuid = this.getUuuid();
        $(id).table("update", uuuid ,data);
    },

    selected: function () {
        var id = this.getId(),
        uuuid = this.getUuuid();
        $(id).table("selected", uuuid);
    },

    unSelected: function () {
        var id = this.getId(),
        uuuid = this.getUuuid();
        $(id).table("unSelected", uuuid);
    }
});
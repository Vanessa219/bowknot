/*
    Document   : table adapter
    Author     : Liyuan Li
    Version    : 0.0.0.2
    Description:
        Adapter for Table.
*/
var Table=function(a){var b="#"+a.id;this.getId=function(){return b},$(b).table(a)};$.extend(Table.prototype,{setHeight:function(a){var b=this.getId();$(b).table("update",{height:a})},getSelectedRows:function(){var a=this.getId();return this._newRows($(a).table("getRows"))},getRows:function(a,b){var c=this.getId();return this._newRows($(c).table("getRows",a,b))},destroy:function(){var a=this.getId();$(a).table("destroy")},_newRows:function(a){var b=[],c=this.getId();for(var d in a){var e=new Row(c,a[d]);b.push(e)}return b}});var Row=function(a,b){var c={};this.getId=function(){return a},this.getData=function(){for(var a in b)a!=="uuuid"&&(a[a]=b[a]);return a},this.getUuuid=function(){return b.uuuid}};$.extend(Row.prototype,{getData:function(){return this.getData()},update:function(a){var b=this.getId(),c=this.getUuuid();$(b).table("update",c,a)},selected:function(){var a=this.getId(),b=this.getUuuid();$(a).table("selected",b)},unSelected:function(){var a=this.getId(),b=this.getUuuid();$(a).table("unSelected",b)}})
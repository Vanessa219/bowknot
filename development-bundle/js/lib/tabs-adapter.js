/*
    Document   : tabs adapter
    Author     : Liyuan Li
    Version    : 0.0.0.2
    Description:
        Adapter for Tabs.
*/
var Tabs = function (options) {
    var id = "#" + options.id;
    this.getId = function () {
        return id;
    }
    $(id).tabs(options);
}

$.extend(Tabs.prototype, {
    add: function (data) {
        var id = this.getId();
        $(id).tabs("add", data);
    },

    activate: function (currentId) {
        var id = this.getId();
        $(id).tabs("select", currentId);
    },

    getActivateTab: function () {
        var id = this.getId();
        return this._newTab($(id).tabs("getTab"));
    },

    getTab: function (tabId) {
        var id = this.getId();
        return this._newTab($(id).tabs("getTab", tabId));
    },

    getLength: function () {
        var id = this.getId();
        return $(id).find("li").length;
    },

    setHeight: function (height) {
        var id = this.getId();
        $(id).tabs("update", {
            "height": height
        });
    },

    destroy: function () {
        var id = this.getId();
        $(id).tabs("destroy");
    },

    addListenerEvent: function (type, action, tabId) {
        var id = this.getId();
        $(id).tabs("bind", [{
            "type": type,
            "action": function (event) {
                action(event, event.data.data);
            }
        }], tabId);
    },

    removeListenerEvent: function (type, tabId) {
        var id = this.getId();
        $(id).tabs("unbind", type, tabId);
    },

    _newTab: function (data) {
        var id = this.getId();
        return new Tab(id, data);
    }
});
    
var Tab = function (tabId, tabData) {
    this.getTabsId = function () {
        return tabId;
    }
    this.getTabId = function () {
        return tabData.id;
    }
}

$.extend(Tab.prototype, {
    getNext: function () {
        var tabsId = this.getTabsId(),
        id = this.getTabId();
        return new Tab(tabsId, $(tabsId).tabs("getTab", id, "next"));
    },

    getPre: function () {
        var tabsId = this.getTabsId(),
        id = this.getTabId();
        return new Tab(tabsId, $(tabsId).tabs("getTab", id, "pre"));
    },

    update: function (updateData) {
        var tabsId = this.getTabsId(),
        id = this.getTabId();
        $(tabsId).tabs("update", updateData, id);
    },

    remove: function () {
        var tabsId = this.getTabsId(),
        id = this.getTabId();
        $(tabsId).tabs("remove", id);
    }
});
/*
 * Copyright (c) 2013, Yunnan Yuan Xin technology Co., Ltd.
 *
 * All rights reserved.
 */
/**
 * @fileoverview 弹出层.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.1.0, Jun 3, 2013
 */
/**
 * @description 弹出层方法
 * @param {Obj} obj 对象参数
 */
var Dialog = function(obj) {
    this.id = obj.id;
    if (obj.height) {
        this.height = obj.height;
    } else {
        this.height = 470;
    }

    if (obj.width) {
        this.width = obj.width;
    } else {
        this.width = 840;
    }

    if (obj.saveFnt) {
        this.saveFnt = obj.saveFnt;
    }

    if (obj.init) {
        obj.init();
    }

    this._init();
};

$.extend(Dialog.prototype, {
    /**
     * @description 设置 position
     * @param {int} x dialog left
     * @param {int} y dialog top
     */
    _setPosition: function(x, y) {
        var $window = $(window);
        var $it = $("#" + this.id);
        if (!x) {
            var x = ($window.width() - $it.width()) / 2;
            if (x < 10) {
                x = 10;
            }
        }

        if (!y) {
            var y = ($window.height() - $it.height()) / 2;
            if (y < 10) {
                y = 10;
            }
        }

        $it.css({
            "top": y + "px",
            "left": x + "px"
        });
    },
    /**
     * @description 初始化 dialog
     */
    _init: function() {
        var that = this;
        var $it = $("#" + that.id);
        $it.find(".dialog-content").height(that.height);
        $it.width(that.width);

        $($it.find(".dialog-footer > button").get(0)).click(function() {
            that.save(that.saveFnt);
        });

        $($it.find(".dialog-footer > button").get(1)).click(function() {
            that.close();
        });

        $it.find(".dialog-header > .close-ico").click(function() {
            that.close();
        });

        $it.find(".dialog-header").mousedown(function(event) {
            var _document = document;
            if (!event) {
                event = window.event;
            }
            var dialog = document.getElementById(that.id);
            var x = event.clientX - parseInt(dialog.style.left),
                    y = event.clientY - parseInt(dialog.style.top);
            _document.ondragstart = "return false;";
            _document.onselectstart = "return false;";
            _document.onselect = "document.selection.empty();";

            if (this.setCapture) {
                this.setCapture();
            } else if (window.captureEvents) {
                window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
            }

            _document.onmousemove = function(event) {
                if (!event) {
                    event = window.event;
                }
                var positionX = event.clientX - x,
                        positionY = event.clientY - y;
                if (positionX < 0) {
                    positionX = 0;
                }
                if (positionX > $(window).width() - $(dialog).width()) {
                    positionX = $(window).width() - $(dialog).width();
                }
                if (positionY < 0) {
                    positionY = 0;
                }
                if (positionY > $(window).height() - $(dialog).height()) {
                    positionY = $(window).height() - $(dialog).height();
                }
                dialog.style.left = positionX + "px";
                dialog.style.top = positionY + "px";
            };

            _document.onmouseup = function() {
                if (this.releaseCapture) {
                    this.releaseCapture();
                } else if (window.captureEvents) {
                    window.captureEvents(Event.MOUSEMOVE | Event.MOUSEUP);
                }
                _document.onmousemove = null;
                _document.onmouseup = null;
                _document.ondragstart = null;
                _document.onselectstart = null;
                _document.onselect = null;
            };
        });

        if ($(".dialog-bg").length === 0) {
            var windowH = $(window).height();
            $("body").append("<div class='dialog-bg' style='height:" +
                    (windowH < document.documentElement.scrollHeight
                            ? document.documentElement.scrollHeight : windowH) + "px;'></div>");
        }

        $(window).resize(function() {
            var windowH = $(window).height();
            that._setPosition();
            $(".dialog-bg").height(windowH < document.documentElement.scrollHeight ?
                    document.documentElement.scrollHeight : windowH);
        });
    },
    /**
     * @description 打开窗口
     * @param {functiton} afterFnt 打开窗口后回调函数
     */
    open: function(afterFnt) {
        $("#" + this.id).show();
        this._setPosition();

        if (afterFnt) {
            afterFnt(this.id);
        }

        $(".dialog-bg").show();
    },
    /**
     * @description 关闭窗口
     * @param {functiton} afterFnt 打开窗口后回调函数
     */
    close: function(afterFnt) {
        $("#" + this.id).hide();
        if (afterFnt) {
            afterFnt(this.id);
        }

        var isCloseAll = true;
        $(".dialog").each(function() {
            if (this.style.display === "block") {
                isCloseAll = false;
            }
        });

        if (isCloseAll) {
            $(".dialog-bg").hide();
        }
    },
    /**
     * @description 保存
     * @param {functiton} afterFnt 打开窗口后回调函数
     */
    save: function(afterFnt) {
        var that = this;

        if (afterFnt) {
            var isNotClose = afterFnt(this.id);
            if (!isNotClose) {
                that.close();
            }
        } else {
            that.close();
        }
    }
});
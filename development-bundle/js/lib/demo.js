/**
 * @fileoverview 可编辑列表.
 *
 * @author <a href="mailto:LLY219@gmail.com">Liyuan Li</a>
 * @version 1.0.0.1, Aug 21, 2012
 */
(function ($) {
    $.fn.extend({
        editlist: {}
    });

    var dpuuid = new Date().getTime();
    var PROP_NAME = 'editlist';

    var Editlist = function () {
        this._defaults = {
            "classNames": {
            }
        }
    };

    $.extend(Editlist.prototype, {
        _attach: function (target, settings) {
            if (!target.id) {
                target.id = 'el' + new Date().getTime();
            }
            var inst = this._newInst($(target));

            inst.settings = $.extend({}, settings || {}, this._defaults);
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
                throw 'Missing instance data for this editlist';
            }
        },

        _destroyEditlist: function (target) {
           
        },

        _init: function (target) {
            var inst = this._getInst(target);
            var id = inst.id,
            settings = inst.settings;
            
            $(target).find("input[type='checkbox']").prop("checked", false);
            
            this._bindEvent(target);
        },
        
        /**
         * @descrption 绑定事件
         */
        _bindEvent: function (target) {
        	// 行选择事件
        	var $checkbox = $(target).find("input[type='checkbox']");
        	$checkbox.click(function () {
        		var $it = $(this);
        		if ($it.prop("checked")) {
        			$it.parents("tr").addClass("selected");
        		} else {
        			$it.parents("tr").removeClass("selected");
        		}
        	});
        },
        
        /**
         * @desciption 获取提交数据
         */
        _getDataEditlist: function () {
        	
        },
        
    });

    $.fn.editlist = function (options) {
        var otherArgs = Array.prototype.slice.call(arguments);

        if (typeof options === 'string') {
            otherArgs.shift();
            return $.editlist['_' + options + 'Editlist'].apply($.editlist, [this[0]].concat(otherArgs));
        }
        
        return this.each(function () {
            $.editlist._attach(this, options);
        });
    };

    $.editlist = new Editlist();

    // Add another global to avoid noConflict issues with inline event handlers
    window['DP_jQuery_' + dpuuid] = $;
})(jQuery);
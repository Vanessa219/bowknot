<#include "/front-framework/pc/ie9/common/basePage.ftl">
<@addCSS ["/app/eCooeModel/pc/css/component/base",
"/app/eCooeModel/pc/css/component/model",
"/app/eCooeModel/pc/css/component/config"
]/>
<@common title="流程建模">

<#assign jsPaths = ["/app/eCooeModel/pc/js/component/lib/json2",
"/app/eCooeModel/pc/js/component/lib/uuid",
"/app/eCooeModel/pc/js/component/lib/mxgraph/mxClient",
"/app/eCooeModel/pc/js/component/model/model",
"/app/eCooeModel/pc/js/component/model/dialog",
"/app/eCooeModel/pc/js/component/model/edit-list",
"/app/eCooeModel/pc/js/component/model/graph",
"/app/eCooeModel/pc/js/component/model/toolbar",
"/app/eCooeModel/pc/js/component/model/sidebar",
"/app/eCooeModel/pc/js/component/model/plugins/common/choose-participant",
"/app/eCooeModel/pc/js/component/model/config/config"
]>

<#list ["flow", "task", "gateway"] as type>

<#list plugins[type]?keys as itemKey>
<#if itemKey != "extTabs">
<#assign item = plugins[type][itemKey]>
<#if item.base??>
<#assign jsPaths=jsPaths+["${item.base.path?replace('pc/ie9', '/pc/js')}"]>
</#if>
<#if item.advance??>
<#assign jsPaths=jsPaths+["${item.advance.path?replace('pc/ie9', '/pc/js')}"]>
</#if>
<#if item.plugin??>
<#assign jsPaths=jsPaths+["${item.plugin.path?replace('pc/ie9', '/pc/js')}"]>
</#if>
</#if>
</#list>

<#if plugins[type].extTabs??>
<#list plugins[type].extTabs as extTab>
<#assign jsPaths=jsPaths+["${extTab.path?replace('/pc/ie9', '/pc/js')}"]>
</#list>
</#if>

</#list>

<@addJS jsPaths/>
<div>
    <div class="header">
        <span id="modelTip">加载中...</span>
        <span class="toolbar-ico"></span>
        <button class="save-ico" id="toolbarSave" title="Save"></button>
        <span class="split-ico"></span>
        <button class="undo-disabled-ico" id="toolbarUndo" disabled="disabled" title="undo"></button>
        <button class="redo-disabled-ico" id="toolbarRedo" disabled="disabled" title="redo"></button>
        <span class="split-ico"></span>
        <span id="toolbarAlign">
            <button class="left-align-disabled-ico" id="toolbarLeftAlign" title="left align"></button>
            <button class="center-disabled-ico" id="toolbarCenter" title="center"></button>
            <button class="right-align-disabled-ico" id="toolbarRightAlign" title="right align"></button>
            <button class="top-align-disabled-ico" id="toolbarTopAlign" title="top align"></button>
            <button class="middle-disabled-ico" id="toolbarMiddle" title="middle"></button>
            <button class="bottom-align-disabled-ico" id="toolbarBottomAlign" title="bottom align"></button>
        </span>
    </div>
    <div class="content">
        <div class="side">
            <dl>
                <dt>
                事件
                <span class="arrow-down-ico"></span>
                </dt>
                <dd>
                    <ul>
                        <li id="sideStartEvent">
                            <span class="hover"></span>
                            <span class="start-ico"></span>开始事件
                        </li>
                        <li id="sideEndEvent">
                            <span class="hover"></span>
                            <span class="end-ico"></span>结束事件
                        </li>
                    </ul>
                </dd>
            </dl>
            <dl>
                <dt>任务<span class="arrow-down-ico"></span></dt>
                <dd>
                    <ul>
                        <li id="sideUserTask">
                            <span class="hover"></span>
                            <span class="user-ico"></span>用户任务
                        </li>
                    </ul>
                </dd>
            </dl>
             <dl>
                <dt>网关<span class="arrow-down-ico"></span></dt>
                <dd>
                    <ul>
                        <li id="sideExclusiveGateway">
                            <span class="hover"></span>
                            <span class="exclusive-gateway-ico"></span>单一网关
                        </li>
                        <li id="sideParallelGateway">
                            <span class="hover"></span>
                            <span class="parallel-gateway-ico"></span>并行网关
                        </li>
                        <li id="sideInclusiveGateway">
                            <span class="hover"></span>
                            <span class="inclusive-gateway-ico"></span>多路网关
                        </li>
                    </ul>
                </dd>
            </dl>
            <dl>
                <dt>泳道<span class="arrow-down-ico"></span></dt>
                <dd>
                    <ul>
                        <li id="sideSwimlane">
                            <span class="hover"></span>
                            <span class="swimline-ico"></span>泳道
                        </li>
                    </ul>
                </dd>
            </dl>
        </div>
        <div class="panel-wrap">
            <div class="panel" id ="mxGraph">
            </div>
        </div>
    </div>
    <div class="footer"></div>
</div>

<div class="dialog fn-none" id="flowDialog">
    <div class="dialog-header">
        流程属性设置<span class="close-ico"></span>
    </div>
    <div class="dialog-body">
        <div class="dialog-content">
            <#include "/app/eCooeModel/pc/ie9/component/model/config/flow/index.ftl">
        </div>
        <div class="dialog-footer">
            <button class="btn-save">保存</button> 
            <button class="button">取消</button>
        </div>
    </div>
</div>

<div class="dialog fn-none" id="laneDialog">
    <div class="dialog-header">
        设置泳道属性<span class="close-ico"></span>
    </div>
    <div class="dialog-body">
        <div class="dialog-content">
            <#include "/app/eCooeModel/pc/ie9/component/model/config/lane/index.ftl">
        </div>
        <div class="dialog-footer">
            <button class="btn-save">保存</button> 
            <button class="button">取消</button>
        </div>
    </div>
</div>

<div class="dialog fn-none" id="taskDialog">
    <div class="dialog-header">
        环节属性设置<span class="close-ico"></span>
    </div>
    <div class="dialog-body">
        <div class="dialog-content">
            <#include "/app/eCooeModel/pc/ie9/component/model/config/task/index.ftl">
        </div>
        <div class="dialog-footer">
            <button class="btn-save">保存</button> 
            <button class="button">取消</button>
        </div>
    </div>
</div>

<div class="dialog fn-none" id="sequenceDialog">
    <div class="dialog-header">
        连线属性设置<span class="close-ico"></span>
    </div>
    <div class="dialog-body">
        <div class="dialog-content">
            <#include "/app/eCooeModel/pc/ie9/component/model/config/sequence/index.ftl">
        </div>
        <div class="dialog-footer">
            <button class="btn-save">保存</button> 
            <button class="button">取消</button>
        </div>
    </div>
</div>

<div class="dialog fn-none" id="gatewayDialog">
    <div class="dialog-header">
        网关属性设置<span class="close-ico"></span>
    </div>
    <div class="dialog-body">
        <div class="dialog-content">
            <#include "/app/eCooeModel/pc/ie9/component/model/config/gateway/index.ftl">
        </div>
        <div class="dialog-footer">
            <button class="btn-save">保存</button> 
            <button class="button">取消</button>
        </div>
    </div>
</div>

<div class="dialog fn-none" id="participantDialog">
    <div class="dialog-header">
        选择参与者范围<span class="close-ico"></span>
    </div>
    <div class="dialog-body">
        <div class="dialog-content">
            <#include "/app/eCooeModel/pc/ie9/component/model/plugins/common/choose-participant.ftl">
        </div>
        <div class="dialog-footer">
            <button class="btn-save">确定</button> 
            <button class="button">取消</button>
        </div>
    </div>
</div>

<div class="dialog fn-none" id="configGroupDialog">
    <div class="dialog-header">
        意见栏分组配置<span class="close-ico"></span>
    </div>
    <div class="dialog-body">
        <div class="dialog-content">
            <#include "/app/eCooeModel/pc/ie9/component/model/plugins/common/config-group.ftl">
        </div>
        <div class="dialog-footer">
            <button class="btn-save">确定</button> 
            <button class="button">取消</button>
        </div>
    </div>
</div>

<script>
    var eCooeModel = {
    "staticServePath": "${staticServePath}",
            "servePath": "${servePath}",
            "model": {
    "data": {
    "configData": ${configData},
            "configGraph": '${configGraph}',
            "pluginsStr": ${pluginsStr}
    }
    }
    },
            mxBasePath = '${staticServePath}/app/eCooeModel/pc/js/component/lib/mxgraph/';
            if (!eCooeModel.model.data.configData.property) {
    eCooeModel.model.data.configData = {
    "property": {
    "baseProperty": {
    "name": decodeURIComponent(location.search.split("=")[2]),
            "desc": ""
    },
            "appCfgs": []
    },
            "tasks": []
    }
    }
</script>
</@common>
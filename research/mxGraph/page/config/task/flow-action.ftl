<div class="fn-clear">
    <div class="fn-left dialog-side">
        <div class="dialog-side-header">
            <span class="table-bar-ico"></span>
            <span id="taskFlowActionRemove" class="remove-ico"></span>
            <span id="taskFlowActionTop" class="top-ico"></span>
            <span id="taskFlowActionDown" class="down-ico"></span>
        </div>
        <ul id="taskFlowActionList"></ul>
    </div>
    <div class="fn-right dialog-main">
        <#if plugins.task.flowAction.base??>
        <#include "${plugins.task.flowAction.base.path}.ftl"/>
        </#if>
        <#if plugins.task.flowAction.advance??>
        <#include "${plugins.task.flowAction.advance.path}.ftl"/>
        </#if>
        <#if plugins.task.flowAction.plugin??>
        <#include "${plugins.task.flowAction.plugin.path}.ftl"/>
        </#if>
    </div>
</div>

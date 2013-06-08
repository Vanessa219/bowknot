<div class="fn-clear">
    <div class="fn-left dialog-side">
        <div class="dialog-side-header">
            <span class="table-bar-ico"></span>
            <span id="taskStepConfigAdd" class="new-ico"></span>
            <span id="taskStepConfigRemove" class="remove-ico"></span>
            <span id="taskStepConfigTop" class="top-ico"></span>
            <span id="taskStepConfigDown" class="down-ico"></span>
        </div>
        <ul id="taskStepConfigList"></ul>
    </div>
    <div class="fn-right dialog-main">
        <#if plugins.task.stepConfig.base??>
        <#include "${plugins.task.stepConfig.base.path}.ftl"/>
        </#if>
        <#if plugins.task.stepConfig.advance??>
        <#include "${plugins.task.stepConfig.advance.path}.ftl"/>
        </#if>
        <#if plugins.task.stepConfig.plugin??>
        <#include "${plugins.task.stepConfig.plugin.path}.ftl"/>
        </#if>
    </div>
</div>


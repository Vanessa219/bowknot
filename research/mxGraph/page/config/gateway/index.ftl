<div class="fn-clear">
    <div class="fn-left dialog-side">
        <div class="dialog-side-header">
            <span class="table-bar-ico"></span>
            <span id="gatewayFlowActionRemove" class="remove-ico"></span>
            <span id="gatewayFlowActionTop" class="top-ico"></span>
            <span id="gatewayFlowActionDown" class="down-ico"></span>
        </div>
        <ul id="gatewayFlowActionList"></ul>
    </div>
    <div class="fn-right dialog-main">
        <#if plugins.gateway.flowAction.base??>
        <#include "${plugins.gateway.flowAction.base.path}.ftl"/>
        </#if>
        <#if plugins.gateway.flowAction.advance??>
        <#include "${plugins.gateway.flowAction.advance.path}.ftl"/>
        </#if>
        <#if plugins.gateway.flowAction.plugin??>
        <#include "${plugins.gateway.flowAction.plugin.path}.ftl"/>
        </#if>
    </div>
</div>

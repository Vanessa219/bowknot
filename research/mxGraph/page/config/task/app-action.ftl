<div class="fn-clear">
    <div class="fn-left dialog-side">
        <ul id="taskAppActionList"></ul>
    </div>
    <div class="fn-right dialog-main">
        <#if plugins.task.appAction.base??>
        <#include "${plugins.task.appAction.base.path}.ftl"/>
        </#if>
        <#if plugins.task.appAction.advance??>
        <#include "${plugins.task.appAction.advance.path}.ftl"/>
        </#if>
        <#if plugins.task.appAction.plugin??>
        <#include "${plugins.task.appAction.plugin.path}.ftl"/>
        </#if>
    </div>
</div>

<div class="fn-clear">
    <div class="fn-left dialog-side">
        <div class="dialog-side-header">
            <span class="table-bar-ico"></span>
             <span id="taskCommentActionAdd" class="new-ico"></span>
            <span id="taskCommentActionRemove" class="remove-ico"></span>
            <span id="taskCommentActionTop" class="top-ico"></span>
            <span id="taskCommentActionDown" class="down-ico"></span>
        </div>
        <ul id="taskCommentActionList"></ul>
    </div>
    <div class="fn-right dialog-main">
        <#if plugins.task.commentAction.base??>
        <#include "${plugins.task.commentAction.base.path}.ftl"/>
        </#if>
        <#if plugins.task.commentAction.advance??>
        <#include "${plugins.task.commentAction.advance.path}.ftl"/>
        </#if>
        <#if plugins.task.commentAction.plugin??>
        <#include "${plugins.task.commentAction.plugin.path}.ftl"/>
        </#if>
    </div>
</div>

<div class="tabs">
    <div class="fn-clear tab-header">
        <ul>
            <li data-index="0" class="current first">
                基本信息
            </li>
            <li data-index="1">
                参与者范围
            </li>
            <li data-index="2">
                流转操作
            </li>
            <li data-index="3">
                应用操作
            </li>
            <li data-index="4">
                意见操作
            </li>
            <li data-index="5">
                步骤配置
            </li>
            <#if plugins.task.extTabs??>
            <#list plugins.task.extTabs as extTab>
            <li data-index="${extTab_index + 2}">
                ${extTab.title}
            </li>
            </#list>
            </#if>
        </ul>
    </div>
    <div class="tab-content">
        <div>
            <#include "base-info.ftl">
        </div>
        <div class="fn-none">
            <#include "actor-scope.ftl">
        </div>
        <div class="fn-none">
            <#include "flow-action.ftl">
        </div>
        <div class="fn-none">
            <#include "app-action.ftl">
        </div>
        <div class="fn-none">
            <#include "comment-action.ftl">
        </div>
        <div class="fn-none">
            <#include "step-config.ftl">
        </div>
        <#if plugins.task.extTabs??>
        <#list plugins.task.extTabs as extTab>
        <div class="fn-none">
            <#include "${extTab.path}.ftl">
        </div>
        </#list>
        </#if>
    </div>
</div>

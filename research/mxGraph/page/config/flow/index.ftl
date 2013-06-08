<div class="tabs">
    <div class="fn-clear tab-header">
        <ul>
            <li data-index="0" class="current first">
                基本信息
            </li>
            <li data-index="1">
                意见栏
            </li>
            <li data-index="2">
                应用操作
            </li>
            <li data-index="3">
                流程变量
            </li>
            <li data-index="4">
                流程脚本
            </li>
            <#if plugins.flow.extTabs??>
            <#list plugins.flow.extTabs as extTab>
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
            <#include "comments.ftl">
        </div>
        <div class="fn-none">
            <#include "app-action.ftl">
        </div>
        <div class="fn-none">
            <#include "flow-variable.ftl">
        </div>
        <div class="fn-none">
            <#include "flow-script.ftl">
        </div>
        <#if plugins.flow.extTabs??>
        <#list plugins.flow.extTabs as extTab>
        <div class="fn-none">
            <#include "${extTab.path}.ftl">
        </div>
        </#list>
        </#if>
    </div>
</div>

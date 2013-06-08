<#if plugins.task.baseInfo.base??>
<#include "${plugins.task.baseInfo.base.path}.ftl"/>
</#if>
<#if plugins.task.baseInfo.advance??>
<#include "${plugins.task.baseInfo.advance.path}.ftl"/>
</#if>
<#if plugins.task.baseInfo.plugin??>
<#include "${plugins.task.baseInfo.plugin.path}.ftl"/>
</#if>
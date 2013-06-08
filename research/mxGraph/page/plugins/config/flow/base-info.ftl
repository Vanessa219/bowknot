<#if plugins.flow.baseInfo.base??>
<#include "${plugins.flow.baseInfo.base.path}.ftl"/>
</#if>
<#if plugins.flow.baseInfo.advance??>
<#include "${plugins.flow.baseInfo.advance.path}.ftl"/>
</#if>
<#if plugins.flow.baseInfo.plugin??>
<#include "${plugins.flow.baseInfo.plugin.path}.ftl"/>
</#if>
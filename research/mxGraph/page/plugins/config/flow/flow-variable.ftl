<#if plugins.flow.flowVariable.base??>
<#include "${plugins.flow.flowVariable.base.path}.ftl"/>
</#if>
<#if plugins.flow.flowVariable.advance??>
<#include "${plugins.flow.flowVariable.advance.path}.ftl"/>
</#if>
<#if plugins.flow.flowVariable.plugin??>
<#include "${plugins.flow.flowVariable.plugin.path}.ftl"/>
</#if>
<#if plugins.flow.flowScript.base??>
<#include "${plugins.flow.flowScript.base.path}.ftl"/>
</#if>
<#if plugins.flow.flowScript.advance??>
<#include "${plugins.flow.flowScript.advance.path}.ftl"/>
</#if>
<#if plugins.flow.flowScript.plugin??>
<#include "${plugins.flow.flowScript.plugin.path}.ftl"/>
</#if>
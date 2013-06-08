<#if plugins.flow.comments.base??>
<#include "${plugins.flow.comments.base.path}.ftl"/>
</#if>
<#if plugins.flow.comments.advance??>
<#include "${plugins.flow.comments.advance.path}.ftl"/>
</#if>
<#if plugins.flow.comments.plugin??>
<#include "${plugins.flow.comments.plugin.path}.ftl"/>
</#if>
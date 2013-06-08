<#if plugins.task.actorScope.base??>
<#include "${plugins.task.actorScope.base.path}.ftl"/>
</#if>
<#if plugins.task.actorScope.advance??>
<#include "${plugins.task.actorScope.advance.path}.ftl"/>
</#if>
<#if plugins.task.actorScope.plugin??>
<#include "${plugins.task.actorScope.plugin.path}.ftl"/>
</#if>


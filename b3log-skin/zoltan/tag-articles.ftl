<#include "macro-head.ftl">
<!DOCTYPE html>
<html>
    <head>
        <@head title="${tag.tagTitle} - ${blogTitle}">
        <meta name="keywords" content="${metaKeywords},${tag.tagTitle}"/>
        <meta name="description" content="<#list articles as article>${article.articleTitle}<#if article_has_next>,</#if></#list>"/>
        </@head>
    </head>
    <body>
        ${topBarReplacement}
        <div class="wrapper">
            <div class="wrap header">
                <#include "header.ftl">
            </div>
            <div class="wrap">
                <div class="left main">
                    <h2 class="sub-title">
                        ${tag1Label}${tag.tagTitle}(${tag.tagPublishedRefCount})
                    </h2>
                    <#include "article-list.ftl">
                </div>
                <div class="right side">
                    <#include "side.ftl">
                </div>
                <div class="clear"></div>
            </div>
            <div class="footer">
                <#include "footer.ftl">
            </div>
        </div>
    </body>
</html>

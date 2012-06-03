<#include "macro-head.ftl">
<#include "macro-comments.ftl">
<!DOCTYPE html>
<html>
    <head>
        <@head title="${article.articleTitle} - ${blogTitle}">
        <meta name="keywords" content="${article.articleTags}" />
        <meta name="description" content="${article.articleAbstract?html}" />
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
                    <div class="article-header">
                        <h2>
                            <a href="${article.articlePermalink}">
                                ${article.articleTitle}
                            </a>
                            <#if article.hasUpdated>
                            <sup class="red">
                                ${updatedLabel}
                            </sup>
                            </#if>
                            <#if article.articlePutTop>
                            <sup class="red">
                                ${topArticleLabel}
                            </sup>
                            </#if>
                            <span class="article-info">
                                by
                                <a href="/authors/${article.authorId}">
                                    ${article.authorName}
                                </a>
                            </span>
                        </h2>
                        <div class="article-info">
                            <div class="left">
                                ${tags1Label}<#list article.articleTags?split(",") as articleTag><span><a href="/tags/${articleTag?url('UTF-8')}">${articleTag}</a><#if articleTag_has_next>,</#if></span></#list>
                            </div>
                            <div class="right">
                                <a href="${article.articlePermalink}">
                                    ${article.articleCreateDate?string("yyyy-MM-dd HH:mm:ss")}
                                </a>
                                &nbsp;&nbsp;
                                <a href="${article.articlePermalink}">
                                    ${article.articleViewCount}${viewLabel}
                                </a>
                                &nbsp;&nbsp;
                                <a href="${article.articlePermalink}#comments">
                                    ${article.articleCommentCount}${commentLabel}
                                </a>
                            </div>
                            <div class="clear"></div>
                        </div>
                    </div>
                    <div class="article-body">
                        ${article.articleContent}
                        <#if "" != article.articleSign.signHTML?trim>
                        <div class="marginTop12 right">
                            ${article.articleSign.signHTML}
                        </div>
                        </#if>
                    </div>
                    <div class="marginTop12 marginBottom12">
                        <#if nextArticlePermalink??>
                        <div class="right">
                            <b>${nextArticle1Label}</b><a href="${nextArticlePermalink}">${nextArticleTitle}</a>
                        </div>
                        <div class="clear"></div>
                        </#if>
                        <#if previousArticlePermalink??>
                        <div class="right">
                            <b>${previousArticle1Label}</b><a href="${previousArticlePermalink}">${previousArticleTitle}</a>
                        </div>
                        </#if>
                        <div class="clear"></div>
                    </div>
                    <div class="article-relative" id="relevantArticles"></div>
                    <div id="randomArticles" class="marginTop12 article-relative"></div>
                    <div id="externalRelevantArticles" class="marginTop12 article-relative"></div>
                    <@comments commentList=articleComments permalink=article.articlePermalink></@comments>
                </div>
                <div class="right side">
                    <#include "side.ftl">
                </div>
                <div class="clear"></div>
            </div>
            <div class="footer">
                <#include "footer.ftl">
            </div>
        </div>  <@comment_script oId=article.oId>
        page.tips.externalRelevantArticlesDisplayCount = "${externalRelevantArticlesDisplayCount}";
        page.loadRandomArticles();
         page.loadRelevantArticles('${article.oId}', '${relevantArticles1Label}');
        <#if 0 != externalRelevantArticlesDisplayCount>
        page.loadExternalRelevantArticles("<#list article.articleTags?split(",") as articleTag>${articleTag}<#if articleTag_has_next>,</#if></#list>");
        </#if>
        </@comment_script>
    </body>
</html>

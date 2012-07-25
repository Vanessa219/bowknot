<#list articles as article>
<div class="article-item">
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
                ${tags1Label}<#list article.articleTags?split(",") as articleTag><span><a href="/tags/${articleTag?url('UTF-8')}">${articleTag}</a><#if articleTag_has_next>, </#if></span></#list>
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
        ${article.articleAbstract}
    </div>
</div>
</#list>
<#if 0 != paginationPageCount>
<div class="pagination">
    <#if 1 != paginationPageNums?first>
    <a href="${path}/1">${firstPageLabel}</a>
    <a href="${path}/${paginationPreviousPageNum}">${previousPageLabel}</a>
    </#if>
    <#list paginationPageNums as paginationPageNum>
    <#if paginationPageNum == paginationCurrentPageNum>
    <a href="${path}/${paginationPageNum}" class="f-bold">${paginationPageNum}</a>
    <#else>
    <a href="${path}/${paginationPageNum}">${paginationPageNum}</a>
    </#if><#if paginationPageNum_has_next> | </#if>
    </#list>
    <#if paginationPageNums?last != paginationPageCount>
    <a href="${path}/${paginationNextPageNum}">${nextPagePabel}</a>
    <a href="${path}/${paginationPageCount}">${lastPageLabel}</a>
    </#if>
    &nbsp;&nbsp;${sumLabel} ${paginationPageCount} ${pageLabel}
</div>
</#if>
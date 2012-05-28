<#if "" != noticeBoard>
<ul>
    <li>
        <h4>${noticeBoardLabel}</h4>
    </li>
    <li>${noticeBoard}</li>
</ul>
</#if>
<#if 0 != recentComments?size>
<ul>
    <li>
        <h4>${recentCommentsLabel}</h4>
    </li>
    <li>
        <ul class="side-comment">
            <#list recentComments as comment>
            <li>
                <#if "http://" == comment.commentURL>
                ${comment.commentName}<#else>
                <a target="_blank" href="${comment.commentURL}">
                    ${comment.commentName}</a></#if>:
                <a title="${comment.commentContent}" href="${comment.commentSharpURL}">
                    ${comment.commentContent}
                </a>
            </li>
            </#list>
        </ul>
    </li>
</ul>
</#if>
<#if 0 != mostCommentArticles?size>
<ul>
    <li>
        <h4>${mostCommentArticlesLabel}</h4>
    </li>
    <li>
        <ul>
            <#list mostCommentArticles as article>
            <li>
                <sup>[${article.articleCommentCount}]</sup>
                <a title="${article.articleTitle}" href="${article.articlePermalink}">${article.articleTitle}</a>
            </li>
            </#list>
        </ul>
    </li>
</ul>
</#if>
<#if 0 != mostViewCountArticles?size>
<ul>
    <li>
        <h4>${mostViewCountArticlesLabel}</h4>
    </li>
    <li>
        <ul>
            <#list mostViewCountArticles as article>
            <li>
                <sup>[${article.articleViewCount}]</sup>
                <a title="${article.articleTitle}" href="${article.articlePermalink}">${article.articleTitle}</a>
            </li>
            </#list>
        </ul>
    </li>
</ul>
</#if>
<#if 0 != mostUsedTags?size>
<ul>
    <li>
        <h4>${popTagsLabel}</h4>
    </li>
    <li>
        <ul>
            <#list mostUsedTags as tag>
            <li>
                <a href="/tag-articles-feed.do?oId=${tag.oId}">
                    <img alt="${tag.tagTitle}" src="/images/feed.png"/>
                </a>
                <a title="${tag.tagTitle}(${tag.tagPublishedRefCount})" href="/tags/${tag.tagTitle?url('UTF-8')}">
                    ${tag.tagTitle}</a>
                (${tag.tagPublishedRefCount})
            </li>
            </#list>
        </ul>
    </li>
</ul>
</#if>
<#if 0 != links?size>
<ul>
    <li>
        <h4>${linkLabel}</h4>
    </li>
    <li>
        <ul>
            <#list links as link>
            <li>
                <a href="${link.linkAddress}" title="${link.linkTitle}" target="_blank">
                    <img alt="${link.linkTitle}" 
                         src="http://www.google.com/s2/u/0/favicons?domain=<#list link.linkAddress?split('/') as x><#if x_index=2>${x}<#break></#if></#list>" /></a>
                <a href="${link.linkAddress}" title="${link.linkTitle}" target="_blank">
                    ${link.linkTitle}
                </a>
            </li>
            </#list>
        </ul>
    </li>
</ul>
</#if>
<#if 0 != archiveDates?size>
<ul>
    <li>
        <h4>${archiveLabel}</h4>
    </li>
    <li>
        <ul>
            <#list archiveDates as archiveDate>
            <li>
                <#if "en" == localeString?substring(0, 2)>
                <a href="/archives/${archiveDate.archiveDateYear}/${archiveDate.archiveDateMonth}"
                   title="${archiveDate.monthName} ${archiveDate.archiveDateYear}(${archiveDate.archiveDatePublishedArticleCount})">
                    ${archiveDate.monthName} ${archiveDate.archiveDateYear}</a>(${archiveDate.archiveDatePublishedArticleCount})
                <#else>
                <a href="/archives/${archiveDate.archiveDateYear}/${archiveDate.archiveDateMonth}"
                   title="${archiveDate.archiveDateYear} ${yearLabel} ${archiveDate.archiveDateMonth} ${monthLabel}(${archiveDate.archiveDatePublishedArticleCount})">
                    ${archiveDate.archiveDateYear} ${yearLabel} ${archiveDate.archiveDateMonth} ${monthLabel}</a>(${archiveDate.archiveDatePublishedArticleCount})
                </#if>
            </li>
            </#list>
        </ul>
    </li>
</ul>
</#if>
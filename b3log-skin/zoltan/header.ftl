<div class="left title">
    <div class="s-l"></div>
    <div class="bg">
        <h1>
            <a href="/">${blogTitle}</a>
        </h1>
        <span>${blogSubtitle}</span>
    </div>
    <div class="s-r"></div>
</div>
<div class="right">
    <#list pageNavigations as page>
    <a href="${page.pagePermalink}" class="btn-nav">
        <span class="s-l"></span>
        <span class="bg">${page.pageTitle}</span>
        <span class="s-r"></span>
    </a>
    </#list>
    <a href="/tags.html" class="btn-nav">
        <span class="s-l"></span>
        <span class="bg">${allTagsLabel}</span>
        <span class="s-r"></span>
    </a>
    <a href="/blog-articles-feed.do" class="btn-nav">
        <span class="s-l"></span>
        <span class="bg">${atomLabel}</span>
        <span class="s-r"></span>
    </a>
</div>
<div class="clear"></div>
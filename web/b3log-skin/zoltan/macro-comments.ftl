<#macro comments commentList permalink>
<h2 class="comments-title">${commentLabel}</h2>
<div class="comments" id="comments">
    <#if 0 == commentList?size>
    ${noCommentLabel}
    </#if>
    <#list commentList as comment>
    <div id="${comment.oId}">
        <img alt="${comment.commentName}" src="${comment.commentThumbnailURL}"/>
        <div class="panel">
            <div>
                <#if "http://" == comment.commentURL>
                <a><b>${comment.commentName}</b></a>
                <#else>
                <a href="${comment.commentURL}" target="_blank">${comment.commentName}</a>
                </#if>
                <#if comment.isReply>
                @
                <a href="${permalink}#${comment.commentOriginalCommentId}"
                   onmouseover="page.showComment(this, '${comment.commentOriginalCommentId}', 18);"
                   onmouseout="page.hideComment('${comment.commentOriginalCommentId}')">${comment.commentOriginalCommentName}</a>
                </#if> </br>
                ${comment.commentDate?string("yyyy-MM-dd HH:mm:ss")}
                <a href="javascript:replyTo('${comment.oId}');">${replyLabel}</a>
            </div>
            <div class="marginTop12">
                ${comment.commentContent}   
            </div>          
            <div class="clear"></div>
        </div>
    </div>
    </#list>
</div>
<div class="post-comment">
    <h3>${postCommentsLabel}</h3>
    <table id="commentForm" class="marginLeft12 reply">
        <tbody>
            <tr>
                <th width="65">
                    ${commentName1Label}
                </th>
                <td colspan="2">
                    <div class="input-reply">
                        <div class="top"></div>
                        <div class="bg">
                            <span class="ico-name"></span>
                            <input type="text" id="commentName"/>
                            <div class="clear"></div>
                        </div>
                        <div class="bottom"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <th>
                    ${commentEmail1Label}
                </th>
                <td colspan="2">
                    <div class="input-reply">
                        <div class="top"></div>
                        <div class="bg">
                            <span class="ico-email"></span>
                            <input type="text" id="commentEmail"/>
                            <div class="clear"></div>
                        </div>
                        <div class="bottom"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <th>
                    ${commentURL1Label}
                </th>
                <td colspan="2">
                    <div class="input-reply">
                        <div class="top"></div>
                        <div class="bg">
                            <input type="text" id="commentURL"/>
                            <div class="clear"></div>
                        </div>
                        <div class="bottom"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <th>
                    ${commentEmotions1Label}
                </th>
                <td id="emotions">
                    <span class="em00" title="${em00Label}"></span>
                    <span class="em01" title="${em01Label}"></span>
                    <span class="em02" title="${em02Label}"></span>
                    <span class="em03" title="${em03Label}"></span>
                    <span class="em04" title="${em04Label}"></span>
                    <span class="em05" title="${em05Label}"></span>
                    <span class="em06" title="${em06Label}"></span>
                    <span class="em07" title="${em07Label}"></span>
                    <span class="em08" title="${em08Label}"></span>
                    <span class="em09" title="${em09Label}"></span>
                    <span class="em10" title="${em10Label}"></span>
                    <span class="em11" title="${em11Label}"></span>
                    <span class="em12" title="${em12Label}"></span>
                    <span class="em13" title="${em13Label}"></span>
                    <span class="em14" title="${em14Label}"></span>
                </td>
            </tr>
            <tr>
                <th valign="top">
                    ${commentContent1Label}
                </th>
                <td colspan="2">
                    <div class="input-reply">
                        <div class="top"></div>
                        <div class="bg">
                            <span class="ico-message"></span>
                            <textarea rows="10" id="comment"></textarea>
                            <div class="clear"></div>
                        </div>
                        <div class="bottom"></div>
                    </div>
                </td>
            </tr>
            <tr>
                <th>
                    ${captcha1Label}
                </th>
                <td>
                    <div class="input-reply">
                        <div class="top"></div>
                        <div class="bg">
                           <img id="captcha" alt="validate" src="/captcha.do" />
                            <input type="text" class="normalInput" id="commentValidate"/>
                            <div class="clear"></div>
                        </div>
                        <div class="bottom"></div>
                    </div>
                </td>
                <th>
                    <span class="error-msg" id="commentErrorTip"/>
                </th>
            </tr>
            <tr>
                <td colspan="2" align="right">
                    <button id="submitCommentButton" onclick="page.submitComment();">${submmitCommentLabel}</button>
                </td>
                <td></td>
            </tr>
        </tbody>
    </table>
</div>
</#macro>

<#macro comment_script oId>
<script type="text/javascript" src="/js/page${miniPostfix}.js?${staticResourceVersion}" charset="utf-8"></script>
<script type="text/javascript">
    var page = new Page({
        "nameTooLongLabel": "${nameTooLongLabel}",
        "mailCannotEmptyLabel": "${mailCannotEmptyLabel}",
        "mailInvalidLabel": "${mailInvalidLabel}",
        "commentContentCannotEmptyLabel": "${commentContentCannotEmptyLabel}",
        "captchaCannotEmptyLabel": "${captchaCannotEmptyLabel}",
        "captchaErrorLabel": "${captchaErrorLabel}",
        "loadingLabel": "${loadingLabel}",
        "oId": "${oId}",
        "skinDirName": "${skinDirName}",
        "blogHost": "${blogHost}",
        "randomArticles1Label": "${randomArticles1Label}",
        "externalRelevantArticles1Label": "${externalRelevantArticles1Label}"
    });

    var addComment = function (result, state) {
        var commentHTML = '<div id="' + result.oId + '"><img alt="' + 
            $("#commentName" + state).val() + '" src="' + result.commentThumbnailURL +
            '"/><div class="panel"><div>' + result.replyNameHTML;

        if (state !== "") {
            var commentOriginalCommentName = $("#" + page.currentCommentId).find("a").first().text();
            commentHTML += '&nbsp;@&nbsp;<a href="' + result.commentSharpURL.split("#")[0] + '#' + page.currentCommentId + '"'
                + 'onmouseover="page.showComment(this, \'' + page.currentCommentId + '\', 18);"'
                + 'onmouseout="page.hideComment(\'' + page.currentCommentId + '\')">' + commentOriginalCommentName + '</a>';
        }

        commentHTML += '</br>' + result.commentDate
            + '&nbsp;<a href="javascript:replyTo(\'' + result.oId + '\');">${replyLabel}</a>'
            + '</div><div class="marginTop12">' 
            + Util.replaceEmString($("#comment" + state).val().replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\n/g,"<br/>"))
            + '</div><div class="clear"></div></div></div>';

        return commentHTML;
    }

    var replyTo = function (id) {
        var commentFormHTML = "<table id='replyForm' class='reply marginLeft12 marginBottom12'>";
        page.addReplyForm(id, commentFormHTML);
    };

    (function () {
        // emotions
        page.replaceCommentsEm("#comments .marginTop12");
        page.load();
            <#nested>
        })();
</script>
</#macro>
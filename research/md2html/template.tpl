<!DOCTYPE html>
<html lang="zh">
    <head>
        <meta charset="UTF-8">
        <title>{{title}}</title>
        <meta name="format-detection" content="telephone=no"> 
        <meta name="msapplication-tap-highlight" content="no"> 
        <meta name="viewport" content="user-scalable=no, initial-scale=1, maximum-scale=1, minimum-scale=1, width=device-width"> 
        <meta name="apple-mobile-web-app-capable" content="yes"> 
        <meta name="apple-mobile-web-app-status-bar-style" content="black"> 
        <link rel="stylesheet" href="../markdown.css">
        <meta name="wx-debug" content="false"><!-- true打开，其他情况关闭，默认关闭 --> 
        <meta name="statistics-on" content="false"><!-- false关闭，其他情况打开 --> 
        <meta name="wxqy" content="true"><!-- true打开，其他情况关闭 --> 
        <meta name="only-wechat" content="false"><!-- TODO:true打开，其他情况关闭 --> 
        <meta name="app-key" content="nhk"> 
        <script src="http://sss.fangstar.net/wx-base/fsub.min.js?v=1.2.0"></script>
    </head>
    <body>
        <div class="page-wrap">
            <div class="page-border">
                <div class="wrap-top"></div>
                <div class="wrap-right"></div>
                <div class="wrap-bottom"></div>
                <div class="wrap-left"></div>
                <div class="page-container markdown">
                    {{nested}}
                </div>
            </div>
            <div class="copy">&copy; Copyright 2015-2016 <a href="http://fangstar.com">fangstar.com</a></div>
        </div>
        <script>
            function fsub_ready() {
                if (FSUB.ua.browser.name == 'wechat') {
                    wx.ready(function () {
                        wx.hideOptionMenu();
                    });
                }
            }
        </script>
    </body>
</html>
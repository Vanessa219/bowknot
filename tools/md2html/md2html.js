/**
 * @fileoverview md to html.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @version 0.1.0.0, Sep 12, 2016
 */
var fs = require("fs"),
        path = require('path'),
        marked = require('marked'),
        cheerio = require('cheerio');


var folder = ".";

process.argv.forEach(function (val, index) {
    if (index === 2) {
        folder = val;
    }
});

var getPropertiesFiles = function () {
    var res = [],
            files = fs.readdirSync(folder + '/');

    files.forEach(function (file) {
        if (path.extname(file) === ".md") {
            res.push(folder + '/' + file);
        }
    });
    return res;
};

(function () {
    var files = getPropertiesFiles(),
            tpl = fs.readFileSync('template.tpl', "UTF-8");

    for (var i = 0; i < files.length; i++) {
        var contentHTML = marked(fs.readFileSync(files[i], "UTF-8")),
                $ = cheerio.load(contentHTML);
        $('h1, h2').addClass('txt-c');
        var html = tpl.replace('{{title}}', $('h2').text()).replace('{{nested}}', $.html());
        fs.writeFileSync(files[i].replace('.md', '.html'), html, "UTF-8");
    }
})();

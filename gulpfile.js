/*
 * Copyright (c) 2012-2016, b3log.org & hacpai.com & fangstar.com
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @file frontend tool.
 * 
 * @author <a href="mailto:liliyuan@fangstar.net">Liyuan Li</a>
 * @version 0.1.0.0, Jul 14, 2016 
 */
var gulp = require("gulp"),
        uglify = require('gulp-uglify'),
        rename = require('gulp-rename'),
        clean = require('gulp-clean');

gulp.task ('clean', function () {
	gulp.src('./jslib/js/lib/*.min.js').pipe(clean({force: true}));
});
gulp.task('cc', function () {
    gulp.src('./jslib/js/lib/*.js')
            .pipe(rename({suffix: '.min'}))
            .pipe(uglify())
            .pipe(gulp.dest('./jslib/js/lib/'));

});
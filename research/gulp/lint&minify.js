var gulp = require ('gulp'),
concat = require('gulp-concat'),
minifycss = require('gulp-minify-css'),
rename = require('gulp-rename'),
uglify = require ('gulp-uglify'),
exec = require('child_process').exec,
path = '/opt/build/home/2.0.0/home_web/src/main/webapp/static', // D://Work/Code/home/home_web/src/main/webapp/static
cssFiles = ["/app/home/pc/css/common/common",
"/app/home/pc/css/thing/thing",
"/app/home/pc/css/common/filter",
"/app/home/pc/css/index",
"/app/home/pc/css/message/message",
"/app/home/pc/css/message/activity",
"/app/home/pc/css/attendance/home-clock",
"/app/home/pc/css/crm/crm"],
cssPaths = [],
destPath = path + '/app/home/pc/css/build';

for (var i = 0, max = cssFiles.length; i < max; i++) {
	cssPaths.push(path + cssFiles[i] + '.css');
}


gulp.task ('default', function () {
      exec('svn update /opt/build/home/2.0.0', function (err, stdout, stderr) {
		  console.log(stdout);

	      gulp.src(cssPaths)
		 .pipe(concat(destPath + '/home.css'))
		 .pipe(gulp.dest ('/'))
		 .pipe(rename({ suffix: '.min' }))
		 .pipe(minifycss())
		 .pipe(gulp.dest ('/'));

		  exec("svn ci /opt/build/home/2.0.0 -m 'combin & compress'", function (err, stdout, stderr) {
			console.log(stdout);
		  });
	  });

	 
});

gulp.task ('build-b3log-css', function () {
  return gulp.src('D://Vanessa/Work/B3log/solo/war/src/main/webapp/skins/finding/css/finding.css')
	 .pipe(rename({ suffix: '.min' }))
	 .pipe(minifycss())
	 .pipe(gulp.dest ('D://Vanessa/Work/B3log/solo/war/src/main/webapp/skins/finding/css'));
});

gulp.task ('build-b3log-js', function () {
  return gulp.src('D://Vanessa/Work/B3log/solo/war/src/main/webapp/skins/finding/js/finding.js')
	 .pipe(rename({ suffix: '.min' }))
	 .pipe(uglify ())
	 .pipe(gulp.dest ('D://Vanessa/Work/B3log/solo/war/src/main/webapp/skins/finding/js'));
});



var compass = require('gulp-compass');
var jshint = require ('gulp-jshint');




gulp.task ('test', function () {
  return gulp
    .src ('./src/**')
    .pipe (jshint ())
    .pipe (jshint.reporter ('jshint-stylish'));
});
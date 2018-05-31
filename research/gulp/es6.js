/*
 * Symphony - A modern community (forum/BBS/SNS/blog) platform written in Java.
 * Copyright (C) 2012-2018, b3log.org & hacpai.com
 *
 * 本文件属于 Sym 商业版的一部分，请仔细阅读项目根文件夹的 LICENSE 并严格遵守相关约定
 */
/**
 * @file frontend tool.
 *
 * @author <a href="http://vanessa.b3log.org">Liyuan Li</a>
 * @author <a href="http://88250.b3log.org">Liang Ding</a>
 * @version 1.9.0.1, May 24, 2018
 */

'use strict'

const gulp = require('gulp')
const sass = require('gulp-sass')
const rename = require('gulp-rename')
const composer = require('gulp-uglify/composer')
const uglifyjs = require('uglify-es')
const gulpUtil = require('gulp-util')
const fs = require('fs')
const browserify = require('browserify')
const livereload = require('gulp-livereload')
const source = require('vinyl-source-stream')
const buffer = require('vinyl-buffer')
const sourcemaps = require('gulp-sourcemaps')
const es = require('event-stream')

const theme = gulpUtil.env.theme || 'classic'

gulp.task('sass', () => {
  return es.merge.apply(null, [
    gulp.src(['./src/main/webapp/scss/*.scss']).
      pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)).
      pipe(gulp.dest('./src/main/webapp/css')),
    gulp.src([`./src/main/webapp/skins/*/css/*.scss`]).
      pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)).
      pipe(gulp.dest(`./src/main/webapp/skins`)),
  ])
})

gulp.task('clean', ['sass'], function () {
  // set static version
  const swFile = fs.readFileSync('./src/main/webapp/sw.js', 'UTF-8')
  const oldVersion = /const version = '(\d{13})';/.exec(swFile)[1],
    newVersion = (new Date()).getTime()
  // set sw.js
  fs.writeFileSync('./src/main/webapp/sw.js',
    swFile.replace('const version = \'' + oldVersion,
      'const version = \'' + newVersion), 'UTF-8')
  // set latke.properties
  fs.writeFileSync('./src/main/resources/latke.properties',
    fs.readFileSync('./src/main/resources/latke.properties', 'UTF-8').
      replace('staticResourceVersion=' + oldVersion,
        'staticResourceVersion=' + newVersion), 'UTF-8')
})

gulp.task('build', ['sass', 'clean'], function () {
  const minify = composer(uglifyjs)

  let files = [
    './src/main/webapp/sw.js',
    './src/main/webapp/js/other-page/ipfs.js',
  ]

  // theme js
  fs.readdirSync('./src/main/webapp/skins').forEach(function (file) {
    const jsPath = `./src/main/webapp/skins/${file}/js`
    fs.readdirSync(jsPath).forEach(function (jsFile) {
      if (jsFile.indexOf('.min.js') > -1 || jsFile.indexOf('_') === 0) {
        return
      }

      files.push(`${jsPath}/${jsFile}`)
    })
  })

  const ES6Tasks = files.map(function (entry) {
    return browserify({entries: entry}).
      transform('babelify', {presets: ['es2015']}).
      bundle().
      pipe(source(entry)).
      pipe(rename({suffix: '.min'})).
      pipe(buffer()).
      pipe(minify().on('error', gulpUtil.log)).
      pipe(gulp.dest('.'))
  })

  return es.merge.apply(null, ES6Tasks)
})

gulp.task('default', ['sass', 'clean', 'build'])

gulp.task('build-sass', () => {
  return es.merge.apply(null, [
    gulp.src([
      `./src/main/webapp/skins/${theme}/css/*.scss`]).
      pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)).
      pipe(gulp.dest(`./src/main/webapp/skins/${theme}/css`)),
    gulp.src(['./src/main/webapp/scss/*.scss']).
      pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError)).
      pipe(gulp.dest('./src/main/webapp/css')),
  ])
})

gulp.task('watch', function () {
  livereload.listen()

  gulp.watch('./src/main/webapp/js/common/*.js', () => {
    console.log(`Starting 'build-common-js'...`)

    const jsPath = `./src/main/webapp/skins/${theme}/js`
    let files = []
    fs.readdirSync(jsPath).forEach(function (jsFile) {
      if (jsFile.indexOf('.min.js') > -1 || jsFile.indexOf('_') === 0) {
        return
      }
      files.push(`${jsPath}/${jsFile}`)
    })

    const task = files.map(function (entry) {
      return browserify({entries: entry}).
        transform('babelify', {presets: ['es2015']}).
        bundle().
        pipe(source(entry)).
        pipe(rename({suffix: '.min'})).
        pipe(buffer()).
        pipe(sourcemaps.init()).
        pipe(sourcemaps.write('.')).
        pipe(gulp.dest('.')).
        pipe(livereload())
    })

    return es.merge.apply(null, task)
  })

  const jsPath = `./src/main/webapp/skins/${theme}/js`
  let files = []
  fs.readdirSync(jsPath).forEach(function (jsFile) {
    if (jsFile.indexOf('.min.js') > -1) {
      return
    }
    files.push(`${jsPath}/${jsFile}`)
  })
  gulp.watch(files, (event) => {
    console.log(`Starting 'build-${theme}-js'...`)

    const entry = event.path
    return browserify({entries: entry}).
      transform('babelify', {presets: ['es2015']}).
      bundle().
      pipe(source(entry)).
      pipe(rename({suffix: '.min'})).
      pipe(buffer()).
      pipe(sourcemaps.init()).
      pipe(sourcemaps.write('.')).
      pipe(gulp.dest('.')).
      pipe(livereload())
  })

  gulp.watch([
    './src/main/webapp/scss/*.scss',
    `./src/main/webapp/skins/${theme}/css/*.scss`], ['build-sass'])
})
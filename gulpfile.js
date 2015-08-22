'use strict';

var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var rename = require('gulp-rename');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var streamify = require('gulp-streamify');
var source = require('vinyl-source-stream');

var metalsmith = require("./metalsmith.js");

var site = require("./site.json");
var assetPaths = site.assets.paths;
var destinationDir = site.destination;
var sourceDir = site.source;
var minified = site.minified;


gulp.task('default', ['browser-sync', 'metalsmith']);

/**
 * Set the browserSync defaults and start the watch process.
 *
 */
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: destinationDir
        }
    });
    gulp.watch(sourceDir, ['metalsmith']);
});

/**
 * Process Sass
 *
 */
gulp.task('css', function() {
    return gulp.src(normalizedAssetPath(assetPaths.sass))
        .pipe(sass().on('error', sass.logError))
        .pipe(minifycss())
        .pipe(concat(minified.css))
        .pipe(gulp.dest(sourcePath('css')));
});

/**
 * Flatten all javascript dependencies
 *
 */
gulp.task('build-dep', function() {
    return gulp.src(normalizedAssetPath(assetPaths.vendor))
        .pipe(concat(minified.jsdependencies))
        .pipe(gulp.dest(sourcePath(assetPaths.jsbin)));
});

/**
 * Bundle all the files you need in browserify
 *
 */
gulp.task('browserify', function() {

    console.log("browserify is using: ", normalizedAssetPath(assetPaths.scripts) );
    return browserify(normalizedAssetPath(assetPaths.scripts))
        .bundle()
        .pipe(source(sourcePath(assetPaths.scripts)))
        .pipe(streamify(uglify()))
        .pipe(rename(minified.browserify))
        .pipe(gulp.dest(sourcePath(assetPaths.jsbin)));
});

// TODO: minify the js, concat the js should be two different processes
// Grab files from the bin once finished and concat as site.min.js

/**
 * Minify javascript.
 *
 */
gulp.task('js', ['browserify'], function() {
    var normalizedPaths = normalizedAssetPath(assetPaths.minifyconcat);
    var scripts = getIgnoreGeneratedJSGlob(normalizedPaths);

    console.log("js is using: ", scripts );

    return gulp.src(scripts)
        .pipe(concat(minified.js))
        .pipe(streamify(uglify()))
        .pipe(gulp.dest(sourcePath(assetPaths.jsbin)));
});

/**
 * Start the Metalsmith build.
 *
 */
gulp.task('metalsmith', ['css', 'js'], function(){
   metalsmith.build(function(err){
       if(err) throw err;
       browserSync.reload();
   });
});

/**
 * Add the assetPaths.jsbin/minified.js file to the ignore list
 *
 * @note: This allows us to dynamically ignore the values set as minified.js
 * in the site.json, so that this file is skipped in the minifying/concat process.
 * Otherwise, the old generated minified.js file will recursively get added to the
 * new minified builds of minified.js, leaving you with an incrementally larger file
 * each time you run the `js` task. This function also helps remove the need to think
 * about the step of ignoring the correct file when updating the site.json file.
 *
 * @param {Array} glob
 * @returns {Array}
 */
function getIgnoreGeneratedJSGlob(glob){
    var ignoreFile = "!"+sourceDir+"/"+assetPaths.jsbin+"/"+minified.js;
    return glob.push(ignoreFile);
}

/**
 * Normalize the glob array for gulp plugins
 *
 * @note: Converts things like ["js/*.js"] to ["./src/js/*.js"]
 * @returns {Array}
 */
function normalizedAssetPath(_array){
    var a = [];
    _array.forEach(function(item){
        a.push(sourcePath(item));
    });
    return a;
}

/**
 * Prepend the src directory to file/glob paths
 *
 * Example: sourcePath("js/*.js") => "./src/js/*.js"
 * @returns {String}
 */
function sourcePath(file){
    return sourceDir+"/"+file;
}



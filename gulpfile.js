'use strict';

var gulp = require('gulp');
var minifycss = require('gulp-minify-css');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var globby = require('globby');
var through = require('through2');
var gutil = require('gulp-util');
var sourcemaps = require('gulp-sourcemaps');

// Import our configured Metalsmith instance
var metalsmith = require("./metalsmith.js");

// Assets and paths from ./site.json
var site = require("./site.json");
var assetPaths = site.assets.paths;
var globs = site.assets.globs;
var destinationDir = site.destination;
var sourceDir = site.source;
var minified = site.minified;

/**
 * The default gulp task.
 *
 * */
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
    gulp.watch('./templates/**/**/*.hbs',  ['metalsmith']);
    gulp.watch(sourceDir+'/**/**/*.hbs',   ['metalsmith']);
    gulp.watch(sourceDir+'/js/*.js',    ['metalsmith']);
    gulp.watch(sourceDir+'/css/*.scss', ['metalsmith']);
});


/**
 * Process Sass
 *
 */
gulp.task('css', function() {
    return gulp.src(globs.sass)
        .pipe(sass().on('error', sass.logError))
        .pipe(minifycss())
        .pipe(concat(minified.css))
        .pipe(gulp.dest(assetPaths.css));
});


/**
 * Flatten all javascript dependencies.
 *
 */
gulp.task('build-deps', function() {
    return gulp.src(globs.vendor)
        .pipe(concat(minified.jsdependencies))
        .pipe(gulp.dest(assetPaths.jsbin));
});


/**
 * Bundle all the files you need in browserify.
 *
 * @note: This will browserify all the files you have listed in assetPaths.scripts
 * and minify them into the file you have listed in minified.browserify.
 * See: https://github.com/gulpjs/gulp/blob/master/docs/recipes/browserify-with-globs.md
 */
gulp.task('browserify', function () {

    var bundledStream = through();

    bundledStream
        .pipe(source(minified.browserify))
        .pipe(buffer())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(uglify())
        .on('error', gutil.log)
        .pipe(sourcemaps.write('./'))
        .pipe(gulp.dest(assetPaths.jsbin));

    globby(globs.scripts, function(err, entries) {
        if (err) {
            bundledStream.emit('error', err);
            return;
        }

        var b = browserify({
            entries: entries,
            debug: true
        });

        b.bundle().pipe(bundledStream);
    });

    return bundledStream;
});


/**
 * Start the Metalsmith build.
 *
 */
gulp.task('metalsmith', ['css', 'browserify'], function(){
   metalsmith.build(function(err){
       if(err) throw err;
       browserSync.reload();
   });
});


'use strict';

var gulp = require('gulp');
var minifycss = require('gulp-clean-css');
var concat = require('gulp-concat');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var browserify = require('browserify');
var uglify = require('gulp-uglify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var log = require('fancy-log');
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
 * Set the watch process and the browserSync defaults
 *
 */
gulp.task('watch', function() {
    browserSync.init({
        server: {
            baseDir: destinationDir
        }
    });
    gulp.watch('./layouts/**/**/*.hbs', gulp.series('metalsmith', 'browser-sync'));
    gulp.watch(sourceDir+'/js/vendor/*.js', gulp.series('build-deps', 'metalsmith', 'browser-sync'));
    gulp.watch(sourceDir+'/js/*.js', gulp.series('browserify', 'metalsmith', 'browser-sync'));
    gulp.watch(sourceDir+'/css/*.scss', gulp.series('css', 'metalsmith', 'browser-sync'));
});

gulp.task('browser-sync', function(done) {
    browserSync.reload();
    done();
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
 * @note: This will browserify all you have listed in app.js
 * See: https://blog.revathskumar.com/2016/02/browserify-with-gulp.html
 */
gulp.task('browserify', function (done) {

    browserify({
        entries: sourceDir+'/js/app.js',
        debug: true
    })
        .bundle()
        .on('error', err => {
            log.error("Browserify Error" + err.message)
        })
        .pipe(source('app.bundle.js'))
        .pipe(buffer())
        .pipe(uglify())
        .pipe(sourcemaps.init({loadMaps: true}))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest(assetPaths.jsbin));
        done();
});

/**
 * Start the Metalsmith build.
 *
 */
gulp.task('metalsmith', function(done){
    metalsmith.build(function(err){
        if (err) throw err;
        done();
    });
});

/**
 * The build task.
 *
 * */
gulp.task('build', gulp.series('css', 'build-deps', 'browserify', 'metalsmith'));

/**
 * The dev task.
 *
 * */
gulp.task('dev', gulp.series('build', 'watch'));

/**
 * The default gulp task.
 *
 * */
gulp.task('default', gulp.series('dev'));



'use strict';

require('harmonize')(); // allow node to use ES6 syntax

var browserSync = require('metalsmith-browser-sync');
var fingerprint = require('metalsmith-fingerprint');
var layouts = require('metalsmith-layouts');
var ignore = require('metalsmith-ignore');
var rename = require('metalsmith-rename');
var branch = require('metalsmith-branch');
var Metalsmith = require('metalsmith');
var sass = require('metalsmith-sass');
var rootPath = require('metalsmith-rootpath');


/**
 * Import metadata
 */
var metadata = require('./metadata');


/**
 *  A good starting point.
 *
 *  Metalsmith will look for a folder named src in the given directory.
 *  You could change the source folder by calling the source() method
 *  and passing it a different directory name.
 *  Here we are using a variable set by node that will point to the directory our build file is in (__dirname).
 *  Then we set the destination folder using the destination() method,
 *  and then tell Metalsmith to run by calling build().
 */
Metalsmith(__dirname)

    .destination('./build')

    // Process metadata
    .metadata(metadata)

    // Process css
    .use(sass({
        outputDir: 'css/',
        sourceMap: true,
        sourceMapContents: true
    }))
    .use(fingerprint({pattern: ['css/main.css']}))
    .use(ignore(['css/index.css']))

    // Process js
    .use(fingerprint({pattern: ['js/main.js']}))
    .use(ignore(['js/index.js']))

    .use(rootPath())

    // Process templates
    .use(branch('**/*.hbs')
        .use(layouts({
            engine: 'handlebars',
            directory: 'templates',
            partials: 'templates/partials'
        }))
    )

    // rename handlebars templates to .html
    .use(rename([[/\.hbs$/, '.html']]))

    // Serve and watch for changes
    .use(browserSync({
        server : './build',
        files : ['src/**/*', 'templates/**/*', 'partials/**/*']
    }))

    // Build Site
    .build(function(err) {
        if (err) throw err;
    });
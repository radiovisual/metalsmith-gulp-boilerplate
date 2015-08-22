'use strict';

require('harmonize')(); // allow node to use ES6 syntax

var layouts = require('metalsmith-layouts');
var rename = require('metalsmith-rename');
var branch = require('metalsmith-branch');
var Metalsmith = require('metalsmith');
var rootPath = require('metalsmith-rootpath');
var fingerprint = require('metalsmith-fingerprint');

/**
 * Import metadata
 */
var metadata = require('./site.json');


/**
 *  Export your Metalsmith build to use in gulp.
 *
 *  Metalsmith will look for a folder named `src` in `__dirname`.
 *  Use the source() method if you want to point Metalsmith to a different `src` folder/location.
 *  Then we set the destination folder using the destination() method.
 *
 *  Note that we are not calling the `Metalsmith.build()` here. We will start the build in the gulp file.
 */

module.exports = Metalsmith(__dirname)

    // Where shall we build?
    .destination(metadata.destination)

    // Process metadata
    .metadata(metadata.metadata)

    // Expose `rootPath` to each file
    .use(rootPath())

    // Process handlebars templates
    .use(branch('**/*.hbs')
        .use(layouts({
            engine: 'handlebars',
            directory: 'templates',
            partials: 'templates/partials'
        }))
    )

    .use(fingerprint({pattern: ['js/bin/bundle.min.js', 'js/bin/dependencies.min.js']}))
    .use(fingerprint({pattern: ['css/styles.min.css', 'js/bin/dependencies.min.js']}))

    // rename handlebars templates to .html
    .use(rename([[/\.hbs$/, '.html']]));
'use strict';
var layouts = require('metalsmith-layouts');
var Metalsmith = require('metalsmith');
var rootPath = require('metalsmith-rootpath');
var handlebars = require('handlebars');
var glob = require('glob');

/**
 * Import metadata
 */
var metadata = require('./site.json');

/**
 * Add custom helpers to handlebars using the global handlebars instance
 * https://github.com/superwolff/metalsmith-layouts/issues/63
 *
 */
glob.sync('layouts/helpers/*.js').forEach((fileName) => {
  const helper = fileName.split('/').pop().replace('.js', '')

  handlebars.registerHelper(
    helper,
    require(`./${fileName}`)
  )
})

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
    .use(layouts({
        engine: 'handlebars',
        directory: 'layouts',
        partials: 'layouts/partials'
    }))

require('harmonize')(); // allow node to use ES6 syntax

var Metalsmith = require('metalsmith');
var sass = require('metalsmith-sass');
var layouts = require('metalsmith-layouts');
var branch = require('metalsmith-branch');

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

    // Process templates
    .use(branch('*.hbs')
        .use(layouts({
            engine: 'handlebars',
            partials: 'partials'
        }))
    )

    .use(sass())

    // Build Site
    .build(function(err) {
        if (err) throw err;
    });
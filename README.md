# metalsmith-gulp-boilerplate
> A starter template for [Metalsmith](https://github.com/segmentio/metalsmith) + [Gulp](https://github.com/gulpjs/gulp) projects


## Installation

1. Make your project folder and clone metalsmith-boilerplate into it

   ```sh
   $ mkdir new-metalsmith-project
   $ git clone https://github.com/radiovisual/metalsmith-gulp-boilerplate.git new-metalsmith-project
   ```

2. Run the following command within your new project directory: 
   
   ```sh
   $ npm install
   ```

3. Assuming you have [installed Gulp globally](https://github.com/gulpjs/gulp/blob/master/docs/getting-started.md#1-install-gulp-globally),
start the build/watch process with this command:

   ```sh
   $ gulp
   ```
   
4. *Now you are ready to start Metalsmithing!* :thumbsup:

## Usage Notes

#### General

This boilerplate represents an opinionated setup for building static websites with Metalsmith and Gulp. It assumes
you want to use [Browserify](http://browserify.org/) with your custom scripts and helps you wrap all your javascript
dependencies into one file. It uses the [Sass](http://sass-lang.com/) precomplier and [Handlebars](http://handlebarsjs.com/)
templates. Gulp is responsible for the live-reloading (via [BrowserSync](http://www.browsersync.io/)) and the CSS / Browserify
steps. Metalsmith is responsible for compiling/generating the site files.
 
#### Configuration

Use the `site.json` file to change or update the default configuration settings. The current defaults
contain your source path, destination path, filenames to assign generated files, globs for gulp, and general site
metadata. If you want to change the gulp or metalsmith builds, use the `gulpfile.js` or `metalsmith.js` files.
 
#### Packaging Javascript Dependencies
When you have added new dependencies to your `js/vendor` directory, package the dependencies with this command:
```js
$ gulp build-deps
```
By default, this will concatenate and minify all your dependencies to this file: `js/bin/dependencies.min.js`, but you
can override the file name and location in the `sites.json` file. If you do not use this command, then you will need to 
import your dependencies into your templates manually. This build step is not automatic, because it is unnecessary to 
bundle your dependencies on every gulp/metalsmith build if your dependencies only change rarely.
 
#### Importing Files into Your Templates

By default, your generated files are available in Handlebars like so:

```html
<!-- your generated css -->
<link rel="stylesheet" href="{{rootPath}}css/styles.min.css">

<!-- your generated js dependencies -->
<script src="{{rootPath}}js/bin/dependencies.min.js"></script>

<!-- your browserified scripts -->
<script src="{{rootPath}}js/bin/bundle.min.js"></script>
```

## Defaults

These are the current defaults, but you can swap these out for anything you want.

- **Templating:** [Handlebars](http://handlebarsjs.com/) *via [metalsmith-layouts](https://github.com/superwolff/metalsmith-layouts)*
- **CSS Precompiler:** [SASS](https://github.com/stevenschobert/metalsmith-sass)
- **Live Reloading:** [BrowserSync](https://github.com/mdvorscak/metalsmith-browser-sync)
- **Relative Navigation:** Solved with [metalsmith-rootpath](https://github.com/radiovisual/metalsmith-rootpath)
- **Browserify:** [Browserify](http://browserify.org/) your javascript source automatically
- **Dependency Wrapping:** minify+concat all your dependencies into one file

## What Next?

- Add some [Metalsmith plugins](http://www.metalsmith.io/#the-plugins) to customize your Metalsmith build.
- Add some [Gulp plugins](http://gulpjs.com/plugins/) to customize your gulp build.

## License
 
[![CC0](http://i.creativecommons.org/p/zero/1.0/88x31.png)](http://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, [Michael Wuergler](http://www.numetriclabs.com) has waived all copyright and related or neighboring rights to this work.



# metalsmith-boilerplate
> A starter template for [Metalsmith](https://github.com/segmentio/metalsmith) projects


## Usage

1. Make your project folder and clone metalsmith-boilerplate into it
```sh
$ mkdir new-metalsmith-project
$ git clone https://github.com/radiovisual/metalsmith-boilerplate.git new-metalsmith-project
```
2. Now run the command `$ make setup` which will do two things:
     1. runs `$ npm install` to install dependencies
     2. creates a default project structure for you:
     <pre>
     src /
        content/
        images/
        scripts/
        styles/
     
     templates/
        partials/ 
     </pre>



## Defaults

These are my current defaults, but you can swap these out for anything you want.

- **Templating:** [Handlebars](http://handlebarsjs.com/) *via [metalsmith-layouts](https://github.com/superwolff/metalsmith-layouts)*
- **CSS Precompiler:** [SASS](https://github.com/stevenschobert/metalsmith-sass)
- **Live Reloading:** [BrowserSync](https://github.com/mdvorscak/metalsmith-browser-sync)
  
## What next?

- Start adding [Metalsmith plugins](http://www.metalsmith.io/#the-plugins) to suit your project's needs

## License
 
[![CC0](http://i.creativecommons.org/p/zero/1.0/88x31.png)](http://creativecommons.org/publicdomain/zero/1.0/)

To the extent possible under law, [Michael Wuergler](http://www.numetriclabs.com) has waived all copyright and related or neighboring rights to this work.



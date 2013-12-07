# grunt-phantomcss

> Automate CSS regression testing with PhantomCSS

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-phantomcss --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-phantomcss');
```

## The "phantomcss" task

### Overview
In your project's Gruntfile, add a section named `phantomcss` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  phantomcss: {
    options: {},
    your_target: {
      options: {
        screenshots: 'test/visual/screenshots/',
        results: 'results/visual/'
      },
      src: [
        'test/visual/**/*.js'
      ]
    }
  }
});
```

### Options

#### src
Type: `String|Array`

The test files to run.

#### options.screenshots
Type: `String`  
Default: `'./screenshots'`

The screenshots directory where test fixtures (comparison screenshots) are stored. Baseline screenshots will be stored here on the first run if they're not present.

#### options.results
Type: `String`  
Default: `'./results'`

The directory to store source, diff, and failure screenshots after tests.

#### options.viewportSize
Type: `Array`  
Default: `[1280, 800]`

The viewport size to test the site in `[width, height]` format. Useful when testing responsive layouts. 


### Usage Examples

#### Basic visual tests
Run tests in `test/visual/` against comparison screenshots stored in `test/visual/screenshots/`, and put the resulting screenshots in `results/visual/`

```js
grunt.initConfig({
  phantomcss: {
    options: {
      screenshots: 'test/visual/screenshots/',
      results: 'results/visual/'
    },
    src: [
      'test/visual/**/*.js'
    ]
  }
});
```

#### Responsive layout testing
Run tests in `test/visual/` against comparison screenshots for destop and mobile.

```js
grunt.initConfig({
  phantomcss: {
    desktop: {
      options: {
        screenshots: 'test/visual/desktop/',
        results: 'results/visual/desktop',
        viewportSize: [1024, 768]
      },
      src: [
        'test/visual/**.js'
      ]
    },
    mobile: {
      options: {
        screenshots: 'test/visual/mobile/',
        results: 'results/visual/mobile',
        viewportSize: [320, 480]
      },
      src: [
        'test/visual/**.js'
      ]
    }
  },
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2013-10-24   v0.1.1   Added the ability to use an external server
* 2013-10-24   v0.1.0   Initial Release

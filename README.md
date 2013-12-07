# grunt-phantomcss

> Plugin to do CSS regression testing via PhantomCSS. Currently the only configuration is allowed via a config file that will be passed to PhantomCSS.

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

#### options.screenshots
Type: `String`
Default value: `'./screenshots'`

The screenshots directory where test fixtures (comparison screenshots) are stored. Baseline screenshots will be stored here on the first run if they're not present.

#### options.results
Type: `String`
Default value: `'./results'`

The directory to store test results. A `screenshots` subdirectory will be created to hold results.

### Usage Examples

#### Default Options
In this example the test suite is run and and the 

```js
grunt.initConfig({
  phantomcss: {
    options: {
      source: 'test/visual/screenshots/',
      dest: 'results/visual/'
    },
    src: [
      'test/visual/**/*.js'
    ]
  }
});
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
* 2013-10-24   v0.1.1   Added the ability to use an external server
* 2013-10-24   v0.1.0   Initial Release

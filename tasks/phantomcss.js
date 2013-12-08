/**
 * grunt-phantomcss
 * https://github.com/chrisgladd/grunt-phantomcss
 *
 * Copyright (c) 2013 Chris Gladd
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path');

module.exports = function(grunt){
    grunt.registerMultiTask('phantomcss', 'CSS Regression Testing', function(){
        function deleteDiffScreenshots(){
            var diffScreenshots = grunt.file.expand([
                path.join(options.screenshots, '*diff.png'),
                path.join(options.screenshots, '*fail.png')
            ]);

            // Delete diff files
            diffScreenshots.forEach(function(filepath){
                grunt.file.delete(filepath);
            });
        }

        var done = this.async();
        var options = this.options({
            screenshots: 'screenshots',
            results: 'results'
        });

        var resultsDirectory = path.resolve(options.results);
        var phantomBinary = path.join(__dirname, '..', 'node_modules', 'phantomjs', 'bin', 'phantomjs');
        var runnerLocation = path.join(__dirname, '..', 'config/runner.js');

        // Resolve paths for tests
        options.test = [];
        this.filesSrc.forEach(function(filepath) {
            options.test.push(path.resolve(filepath));
        });

        options.screenshots = path.resolve(options.screenshots);

        // Put failure screenshots in the same place as source screenshots
        // We'll move/delete them after the test run
        // Note: This duplicate assignment is provided for clarity; PhantomCSS will put failures in the screenshots folder by default
        options.failures = options.screenshots;

        grunt.verbose.writeflags(options, 'Options');

        // Remove old diff screenshots
        deleteDiffScreenshots();

        // Effectively the project root (location of Gruntfile)
        // This allows relative paths in tests, i.e. casper.start('someLocalFile.html')
        var cwd = process.cwd();

        grunt.util.spawn({
            cmd: phantomBinary,
            args: [
                runnerLocation,
                JSON.stringify(options)
            ],
            opts: {
                cwd: cwd,
                stdio: 'inherit'
            }
        }, function(error, result, code){
            var allScreenshots = grunt.file.expand(path.join(options.screenshots, '**.png'));

            // Create the output directory
            grunt.file.mkdir(resultsDirectory);

            // Copy fixtures, diffs, and failure images to the results directory
            allScreenshots.forEach(function(filepath){
                grunt.file.copy(filepath, path.join(resultsDirectory, path.basename(filepath)));
            });

            deleteDiffScreenshots();

            if(error) {
                done(false);
            }
            else {
                done();
            }
        });
    });
};

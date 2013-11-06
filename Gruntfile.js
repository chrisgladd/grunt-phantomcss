/*
 * grunt-phantomcss
 * https://github.com/chrisgladd/grunt-phantomcss
 *
 * Copyright (c) 2013 Chris Gladd
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/phantomcss.js',
                'config/testsuite.js',
                '<%= nodeunit.tests %>',
            ],
            options: {
                jshintrc: '.jshintrc',
            },
        },

        // Before generating any new files, remove any 
        // previously-created files.
        clean: {
            tests: ['tmp'],
            screenshots: ['screenshots','failures'],
        },

        // Configuration to be run (and then tested).
        phantomcss: {
            default_options: {
                options: {
                    configFile: "config/testsuite.js",
                    screenshots: "test/screenshots",
                    failures: "failures",
                    index: "test/coffeemachine.html"
                },
            },
            compare_only: {
                options: {
                    screenshots: "screenshots",
                    failures: "failures"
                },
            },
        },

        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js'],
        },
    });

    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // These plugins provide necessary tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-nodeunit');

    // Whenever the "test" task is run, first clean the "tmp" dir,
    // then run this plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'phantomcss', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'test']);
};

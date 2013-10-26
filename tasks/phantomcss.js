/**
 * grunt-phantomcss
 * https://github.com/chrisgladd/grunt-phantomcss
 *
 * Copyright (c) 2013 Chris Gladd
 * Licensed under the MIT license.
 */
'use strict';

var path = require('path');

module.exports = function(grunt) {
    var _ = grunt.util._;
    var verbose = grunt.verbose.writeln;

    var desc = 'CSS Regression Testing';
    grunt.registerMultiTask('phantomcss', desc, function(){
        var done = this.async();
        var options = this.options({});

        if(!options.configFile){
            options.configFile = 'config/testsuite.js';
        }

        if(!options.screenshots){
            options.screenshots = 'screenshots';
        }

        if(!options.failures){
            options.failures = 'failures';
        }

        options.screenshots = path.resolve(options.screenshots);
        options.failures = path.resolve(options.failures);

        grunt.verbose.writeflags(options, 'Options');

        var files = grunt.task.normalizeMultiTaskFiles(this.data);
        files.forEach(function(filePair){
            filePair.src.forEach(function(conf){
                var resolved = path.resolve(conf);
                var cwd = path.join(__dirname, '..', 'bower_components/phantomcss/');
                //console.log("CWD: " + cwd);
                grunt.util.spawn({
                    "cmd": 'phantomjs',
                    "args": [
                        resolved,
                        //'../../'+options.configFile,
                        JSON.stringify(options)
                    ],
                    "opts": {
                        cwd: cwd,//'../bower_components/phantomcss/',
                        stdio: 'inherit'
                    }
                }, function DoneFunction(error, result, code){
                    if(error){ done(false); }
                    else{ done(); }
                });
            });
        });
    });
};

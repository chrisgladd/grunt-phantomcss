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
    var desc = 'CSS Regression Testing';
    grunt.registerMultiTask('phantomcss', desc, function(){
        var done = this.async();
        var options = this.options({});

        console.log("Before check: " + options.configFile);
        if(!options.configFile){
            options.configFile = 'config/testsuite.js';
        }

        if(!options.screenshots){
            options.screenshots = 'screenshots';
        }

        if(!options.failures){
            options.failures = 'failures';
        }

        options.configFile = path.resolve(options.configFile);
        options.screenshots = path.resolve(options.screenshots);
        options.failures = path.resolve(options.failures);

        grunt.verbose.writeflags(options, 'Options');

        var cwd = path.join(__dirname, '..', 
                            'bower_components/phantomcss/');

        grunt.util.spawn({
            "cmd": 'phantomjs',
            "args": [
                options.configFile,
                JSON.stringify(options)
            ],
            "opts": {
                "cwd": cwd,
                "stdio": 'inherit'
            }
        }, function DoneFunction(error, result, code){
            if(error){ done(false); }
            else{ done(); }
        });
    });
};

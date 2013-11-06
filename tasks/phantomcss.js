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

        // Compare only configuration, no screenshots/tests
        if(!options.configFile && !options.index){
            options.configFile = path.join(__dirname, '..', 'config','compare.js');
        }
        //Configure via configFile
        else if(!options.configFile){
            options.configFile = 'config/testsuite.js';
            options.configFile = path.resolve(options.configFile);
        }

        if(!options.screenshots){
            options.screenshots = 'screenshots';
        }
        if(!options.failures){
            options.failures = 'failures';
        }

        options.screenshots = path.resolve(options.screenshots);
        options.failures = path.resolve(options.failures);
        if(options.index){
            options.index = path.resolve(options.index);
        }

        grunt.verbose.writeflags(options, 'Options');

        var cwd = path.join(__dirname, '..', 'bower_components', 'phantomcss');

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

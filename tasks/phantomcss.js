/*
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

    grunt.registerMultiTask('phantomcss', 'CSS Regression Testing', function(){
        var done = this.async();
        var options = this.options({
            //background: false,
        });
        var data = this.data;
        data = _.merge(options, data);

        grunt.verbose.log("Config File: ", options.configFile);
        var cssopt = {
          "phantomcss": {
            "screenshots": options.screenshots,
            "failures": options.failures,
          }
        };
        grunt.util.spawn({
            "cmd": 'phantomjs', 
            "args": [
                //joined
                //options.configFile
                '../../'+options.configFile,
                //path.join(__dirname, '..', options.configFile),
                //JSON.stringify(data)
            ],
            "opts": {
                cwd: 'bower_components/phantomcss/',
                //env: _.merge(process.env, cssopt),
                stdio: 'inherit'
            }
        }, function DoneFunction(error, result, code){
            //console.log("SPAWN ON FINISH");
            //console.log(arguments);
            if(error){ done(false); }
            else{ done(); }
        });
    });
};

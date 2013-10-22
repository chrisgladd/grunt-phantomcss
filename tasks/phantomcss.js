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

    // Please see the Grunt documentation for more information regarding task
    // creation: http://gruntjs.com/creating-tasks

    grunt.registerMultiTask('phantomcss', 'CSS Regression Testing', function(){
        var done = this.async();
        var options = this.options({
            //background: false,
            //punctuation: '.',
            //separator: ', '
        });
        var data = this.data;
        data = _.merge(options, data);

        /*// Iterate over all specified file groups.*/
        //this.files.forEach(function(f) {
            //// Concat specified files.
            //var src = f.src.filter(function(filepath) {
                //// Warn on and remove invalid source files (if nonull was set).
                //if (!grunt.file.exists(filepath)) {
                    //grunt.log.warn('Source file "' + filepath + '" not found.');
                    //return false;
                //} else {
                    //return true;
                //}
            //}).map(function(filepath) {
                //// Read file source.
                //return grunt.file.read(filepath);
            //}).join(grunt.util.normalizelf(options.separator));

            //// Handle options.
            //src += options.punctuation;

            //// Write the destination file.
            //grunt.file.write(f.dest, src);

            //// Print a success message.
            //grunt.log.writeln('File "' + f.dest + '" created.');
        /*});*/
        console.log("Config File: ", options.configFile);
        console.log("Parsed Filepath: ", path.join(__dirname, '..', options.configFile));
        grunt.util.spawn({
            "cmd": 'bower_components/phantomcss/phantomjs', 
            "args": [
                path.join(__dirname, '..', options.configFile),
                //path.join(__dirname, '..', 'lib', 'background.js'),
                //JSON.stringify(data)
            ],
            "opts": {stdio: 'inherit'}
        }, function DoneFunction(error, result, code){
            console.log("SPAWN ON FINISH");
            console.log(arguments);
        });
    });
};

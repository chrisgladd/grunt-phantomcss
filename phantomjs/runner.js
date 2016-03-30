var fs = require('fs');
var system = require('system');

// Parse arguments passed in from the grunt task
var args = JSON.parse(system.args[1]);

var viewportSize = {
    "width": args.viewportSize[0],
    "height": args.viewportSize[1]
};

// Messages are sent to the parent by appending them to the tempfile
var sendMessage = function() {
    fs.write(args.tempFile, JSON.stringify(Array.prototype.slice.call(arguments)) + '\n', 'a');
};

// Initialise CasperJs
phantom.casperPath = args.casperPath;
phantom.injectJs([args.casperPath, 'bin', 'bootstrap.js'].join(fs.separator));

var casper = require('casper').create({
    "viewportSize": viewportSize,
    "logLevel": args.logLevel,
    "verbose": true
});

// Require and initialise PhantomCSS module
var phantomcss = require('phantomcss');

phantomcss.init({
    "libraryRoot": args.phantomCSSPath, // Give absolute path, otherwise PhantomCSS fails

    "screenshotRoot": args.screenshots,
    "failedComparisonsRoot": args.failures,

    /**
     * Mismatch tolerance defaults to  0.05%. Increasing this value 
     * will decrease test coverage
     */
    "mismatchTolerance": 0.05,

    "onFail": function(test) {
        sendMessage('onFail', test);
    },
    "onPass": function(test) {
        sendMessage('onPass', test);
    },
    "onTimeout": function(test) {
        sendMessage('onTimeout', test);
    },
    "onComplete": function(allTests, noOfFails, noOfErrors) {
        sendMessage('onComplete', allTests, noOfFails, noOfErrors);
    }
});

// Run the test scenarios
args.test.forEach(function(testSuite) {
    require(testSuite);
});

// End tests and compare screenshots
casper.then(function() {
    phantomcss.compareAll();
}).run(function() {
    phantom.exit(0);
});

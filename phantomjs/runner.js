var fs = require('fs');
var s = fs.separator;

// Parse arguments passed in from the grunt task
var args = JSON.parse(phantom.args[0]);

var viewportSize = {
    width: args.viewportSize[0],
    height: args.viewportSize[1]
};

// Messages are sent to the parent by appending them to the tempfile
var sendMessage = function() {
    fs.write(args.tempFile, JSON.stringify(Array.prototype.slice.call(arguments)) + '\n', 'a');
};

// Initialise CasperJs
phantom.casperPath = args.casperJSPath;
phantom.casperTest = true;
phantom.injectJs(phantom.casperPath+s+'bin'+s+'bootstrap.js');

var casper = require('casper').create({
    viewportSize: viewportSize,
    logLevel: args.logLevel,
    verbose: true
});

// Require and initialise PhantomCSS module
var phantomCSSPath = args.phantomCSSPath;
var phantomcss = require(phantomCSSPath+s+'phantomcss.js');

phantomcss.init({
    addLabelToFailedImage: args.addLabelToFailedImage,
    screenshotRoot: args.screenshots,
    comparisonResultRoot: args.failures,
    failedComparisonsRoot: false,
    libraryRoot: phantomCSSPath, // Give absolute path, otherwise PhantomCSS fails

    onFail: function(test) {
        sendMessage('onFail', test);
    },
    onPass: function(test) {
        sendMessage('onPass', test);
    },
    onTimeout: function(test) {
        sendMessage('onTimeout', test);
    },
    onComplete: function(allTests, noOfFails, noOfErrors) {
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
})
.then(function() {
    casper.test.done();
})
.run(function() {
    phantom.exit();
});

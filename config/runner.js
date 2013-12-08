var fs = require('fs');
var s = fs.separator;

// Parse arguments passed in from the grunt task
var args = JSON.parse(phantom.args);

var viewportSize = {
    width: 1280,
    height: 800
};

if (args.viewportSize) {
    viewportSize = {
        width: args.viewportSize[0],
        height: args.viewportSize[1]
    };
}

// Initialise CasperJs
var phantomCSSPath = fs.workingDirectory+s+'node_modules'+s+'grunt-phantomcss'+s+'bower_components'+s+'phantomcss';
phantom.casperPath = phantomCSSPath+s+'CasperJs';
phantom.injectJs(phantom.casperPath+s+'bin'+s+'bootstrap.js');

var casper = require('casper').create({
    viewportSize: viewportSize,
    logLevel: args.logLevel || 'error',
    verbose: true
});

// Require and initialise PhantomCSS module
var phantomcss = require(phantomCSSPath+s+'phantomcss.js');

var exitStatus = 0;
phantomcss.init({
    screenshotRoot: args.screenshots,
    failedComparisonsRoot: args.failures,
    libraryRoot: phantomCSSPath+s+'ResembleJs', // Give absolute path, otherwise PhantomCSS fails

    onFail: function(test){
        console.error('Visual change found for screenshot ' + test.filename + ' (' + test.mismatch + '% mismatch)');
    },
    onPass: function(test){
        console.log('No changes found for screenshot ' + test.filename);
    },
    onTimeout: function(test){
        console.error('Could not complete image comparison for ' + test.filename);
    },
    onComplete: function(allTests, noOfFails, noOfErrors){
        if (!allTests.length) {
            console.log('Baseline screenshots generated in '+args.screenshots+'. Delete them if they are wrong.')
        }

        var totalFailures = noOfFails + noOfErrors;
        var noOfPasses = allTests.length - totalFailures;
        console.log('Passed: '+ noOfPasses);
        if (totalFailures > 0) {
            console.log('Failed: '+ noOfFails);
            console.log('Errors: '+ noOfErrors);
            exitStatus = totalFailures;
        }
    }
});

// Run the test scenarios
args.test.forEach(function(testSuite) {
    require(testSuite);
});

// End tests and compare screenshots
casper.then(function(){
    phantomcss.compareAll();
})
.then(function(){
    casper.test.done();
})
.run(function(){
    phantom.exit(exitStatus);
});

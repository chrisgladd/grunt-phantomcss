var fs = require('fs');

/**
 * Arguments passed in from the grunt task
 */
var args = JSON.parse(phantom.args);

/**
 * Initialise CasperJs
 */
phantom.casperPath = fs.workingDirectory+'/CasperJs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');

var casper = require('casper').create({
  viewportSize: args.viewportSize || {
    width: 1024,
    height: 768
  }
});

/**
 *  Require and initialise PhantomCSS module
 */
var phantomcss = require('./phantomcss.js');

phantomcss.init({
  screenshotRoot: args.screenshots,
  failedComparisonsRoot: args.failures,

  onFail: function(test){
    console.log('Failed: '+test.filename+' by a factor of '+test.mismatch);
  },
  onPass: function(test){
    console.log('Passed: '+test.filename);
  },
  onTimeout: function(test){
    console.log('Timeout: '+test.filename);
  },
  onComplete: function(allTests, noOfFails, noOfErrors){
    var totalFailures = noOfFails + noOfErrors;
    var noOfPasses = allTests.length - totalFailures;
    console.log('Passed: '+ noOfPasses);
    if (totalFailures > 0) {
      console.log('Failed: '+ noOfFails);
      console.log('Errors: '+ noOfErrors);
      phantom.exit(1);
    }
  }
});

/**
 * Run the test scenarios
 */
args.test.forEach(function(testSuite) {
	require(testSuite);
});

/**
 * End tests and compare screenshots
 */
casper.then(function() {
    phantomcss.compareAll();
}).
run(function() {
    phantom.exit(phantomcss.getExitStatus());
});

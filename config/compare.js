var fs = require('fs');

/**
 * Arguments passed in from the grunt task
 */
console.log("Phantom Args" + phantom.args);
var args = JSON.parse(phantom.args);

/**
 * Initialise CasperJs
 */
phantom.casperPath = fs.workingDirectory+'/CasperJs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');
phantom.injectJs('jquery.js');

var casper = require('casper').create({
	"viewportSize": { "width": 1027, "height": 800 }
});

/**
 *	Require and initialise PhantomCSS module
 */
var phantomcss = require('./phantomcss.js');
phantomcss.init({
    screenshotRoot: args.screenshots || './screenshots',
    failedComparisonsRoot: args.failures || './screenshots',

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
 * Compare previously generated screenshots
 */
casper.start().then(function now_check_the_screenshots(){
    phantomcss.compareAll();
}).run(function end_it(){
    console.log('\nTHE END.');
    phantom.exit(phantomcss.getExitStatus());
});

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
	failedComparisonsRoot: args.failures || './failures',

    onFail: function(test){ console.log(test.filename, test.mismatch); },
    onPass: function(test){ console.log(test.filename); },
    onTimeout: function(test){ console.log(test.filename); },
    onComplete: function(allTests, noOfFails, noOfErrors){
        if(noOfFails + noOfErrors > 0){
            console.log("There were " + noOfFails + " failures, and " + noOfErrors + " errors");
        }
        allTests.forEach(function(test){
            if(test.fail){ console.log(test.filename, test.mismatch); }
        });
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

/**
 * Start the webserver
 */
function startServer(path){
	// Use PhantomJs server to server web page, demo purposes only
	var fs = require('fs');
	var server = require('webserver').create();
	var html = fs.read(path);
	
	var service = server.listen(1337, function(request, response) {
		response.statusCode = 200;
		response.write(html);
		response.close();
	});

	return 'http://localhost:1337';
}

/**
 * Arguments passed in from the grunt task
 */
console.log("Phantom Args" + phantom.args);
var args = JSON.parse(phantom.args);

/**
 * Initialise CasperJs
 */
phantom.casperPath = 'CasperJs';
phantom.injectJs(phantom.casperPath + '/bin/bootstrap.js');
phantom.injectJs('jquery.js');

var casper = require('casper').create({
	"viewportSize": { "width": 1027, "height": 800 }
});

/**
 *	Require and initialise PhantomCSS module
 */
var phantomcss = require('./phantomcss.js');
var url = startServer(args.index || 'demo/coffeemachine.html');

phantomcss.init({
	screenshotRoot: args.screenshots || './screenshots',
	failedComparisonsRoot: args.failures || './screenshots',

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
 * The test scenario
 */
casper.start(url).then(function(){
    phantomcss.screenshot('#coffee-machine-wrapper', 'open coffee machine button');
}).then(function(){
    casper.click('#coffee-machine-button');
    
    // wait for modal to fade-in 

    casper.waitForSelector('#myModal:not([style*="display: none"])',
        function success(){
            phantomcss.screenshot('#myModal', 'coffee machine dialog');
        },
        function timeout(){
            casper.test.fail('Should see coffee machine');
        }
    );
}).then(function(){
    casper.click('#cappuccino-button');
    phantomcss.screenshot('#myModal', 'cappuccino success');
}).then(function(){
    casper.click('#close');

    // wait for modal to fade-out
    casper.waitForSelector('#myModal[style*="display: none"]',
        function success(){
            phantomcss.screenshot('#coffee-machine-wrapper', 'coffee machine close success');
        },
        function timeout(){
            casper.test.fail('Should be able to walk away from the coffee machine');
        }
    );
});

/**
 * End tests and compare screenshots
 */
casper.then(function now_check_the_screenshots(){
    phantomcss.compareAll();
}).
run( function end_it(){
    console.log('\nTHE END.');
    phantom.exit(phantomcss.getExitStatus());
});

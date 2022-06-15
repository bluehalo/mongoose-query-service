const Mocha = require('mocha'),
	argv = require('yargs').argv;

console.info('Starting initialization of tests');

// Create the mocha instance
const options = argv.ci
    ? {
            reporter: 'xunit',
            reporterOptions: {
                output: 'mocha-tests.xml'
            }
        }
    : {
            reporter: 'spec'
        };

if (argv.bail) {
    console.log("Mocha: Setting option 'bail' to true.");
    options.bail = true;
}
const mocha = new Mocha(options);

try {
    // Run the tests.
    mocha.run((failures) => {
        process.exit(failures ? 1 : 0);
    });
} catch (ex) {
    console.error('Tests Crashed');
    console.error(ex);
    process.exit(1);
}

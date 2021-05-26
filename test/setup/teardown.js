const allure = require('allure-commandline');

// returns ChildProcess instance
module.exports = async function() {
    const generation = allure(['generate', './test/resources/allure-results', '--clean']);

    generation.on('exit', function(exitCode) {
        console.log('Generation is finished with code:', exitCode);
    });
}
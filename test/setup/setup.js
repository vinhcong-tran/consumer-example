require('dotenv').config()
const fs = require('fs');

// Delete existing Contract
module.exports = async function() {
    fs.unlink(`./pacts/${process.env.CONSUMER_NAME}-${process.env.PROVIDER_NAME}.json`, (err) => {
        if (err) {
            throw err;
        }
        console.log("The existing Contract is deleted.");
    });
}
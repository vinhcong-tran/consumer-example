import pact from '@pact-foundation/pact-node';
import path from 'path';
import exec from 'child_process';


let pactBrokerUrl = process.env.PACT_BROKER_URL;
let pactBrokerToken = process.env.PACT_BROKER_TOKEN

const gitHash = exec.execSync('git rev-parse --short HEAD').toString().trim();
const gitBranch = exec.execSync('git branch --show-current').toString().trim();

const opts = {
    pactFilesOrDirs: [path.resolve(process.cwd(), 'pacts')],
    pactBroker: pactBrokerUrl,
    pactBrokerToken: pactBrokerToken,
    tags: [gitBranch],
    consumerVersion: gitHash
};

pact
    .publishPacts(opts)
    .then(() => {
        console.log('Pact contract publishing complete!');
        console.log(`Head over to ${pactBrokerUrl} and login with`);
        console.log('to see your published contracts.')
    })
    .catch(e => {
        console.log('Pact contract publishing failed: ', e)
    });

# Pact Contract Testing Consumer Example

An example test framework using Pact-js to generate contract from consumer

#### Install dependencies

   `npm i`

## Running React

1. Start `NodeJS` server

2. Start React 

   `npm start`

3. Access: http://localhost:3000/


## Running Pact test

Pact will create a mock service at a local host `http://localhost` on port `:4321`. Please make sure it is available.

I am using [Pactflow](https://pactflow.io/) as my broker. To use Pactflow , register for their free developer plan:

After creating the account, please access the link to get your token (`Read/write token (CI)`) at: 

`https://<YOUR_PACTFLOW_NAME>.pactflow.io/settings/api-tokens`

Then update your Pactflow Broker URL and API token in `/.env` file at root directory:
```
PACT_BROKER_URL=https://<YOUR_PACTFLOW_NAME>.pactflow.io/
PACT_BROKER_TOKEN=<API_TOKEN here>
```

### Running test



1. Run test

    `npm run test`

2. A contract is generated in ./pacts and named: `consumer-provider.json`

3. Publish the contract to your pact broker:
`npm run publish:pact`
   
4. Open your Pactflow to view the contract



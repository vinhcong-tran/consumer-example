# Pact Contract Testing Consumer Example

An example test framework using Pact-js to generate contract from consumer

## Running React

1. Start React

   `npm start`
2. Access: http://localhost:3000/


## Running Pact test

Pact will create mock service at a local host `http://localhost` on port `:4321`. Please make sure this port is available.

I am using [Pactflow](https://pactflow.io/) as my broker. To use Pactflow , register for their free developer plan and export your Pactflow Broker URL and API token:

```
export PACT_BROKER_URL=<PACT_BROKER_URL here>
export PACT_BROKER_TOKEN=<API_TOKEN here>
```

### Running test

1. Install dependencies

    `npm i`

2. Run test

    `npm run test`

3. A contract is generated in ./pacts folder named: `consumer-provider.json`

4. Publish the contract to your pact broker:
`npm run publish:pact`



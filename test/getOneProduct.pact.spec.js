import {API} from '../src/api'
import {Pact} from '@pact-foundation/pact'
import {like, eachLike, regex} from "@pact-foundation/pact/src/dsl/matchers";
import path from 'path'
require('dotenv').config()

const url = 'http://localhost:';
const port = 4321;

describe('Demo test', () => {

    // (1) Create the Pact object to represent your provider
    const pact = new Pact({
        consumer: process.env.CONSUMER_NAME,
        provider: process.env.PROVIDER_NAME,
        port: port,
        log: path.resolve(process.cwd(), 'logs', 'pact.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        logLevel: 'INFO',
        pactfileWriteMode: "update"
    });

    describe('Getting one product', () => {

        // (2) Start the mock server
        beforeAll(() => pact.setup());

        // (4) write your test(s)
        test('Product with ID 10 exists', async () => {

            // this is the response you expect from your Provider
            const expectedProduct = {id: '10', name: '28 Degrees', type: 'CREDIT_CARD', version: 'v1'}

            await pact.addInteraction({
                // The 'state' field specifies a "Provider State"
                state: 'product with ID 10 exists',
                uponReceiving: 'a request to get product with ID 10',
                withRequest: {
                    method: 'GET',
                    path: '/product/10',
                    headers: {
                        Authorization: like('Bearer 2019-01-14T11:34:18.045Z'),
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': regex({generate: 'application/json; charset=utf-8', matcher: 'application/json;?.*'}),
                    },
                    body: (expectedProduct),
                },
            });
            const api = new API(`${url + port}`);

            // make request to Pact mock server
            const product = await api.getProduct("10");

            // assert that we got the expected response
            expect(product).toEqual(expectedProduct);
        });

        test('Product with ID 12 does not exist', async () => {
            await pact.addInteraction({
                state: 'product with ID 12 does not exist',
                uponReceiving: 'a request to get product with ID 12',
                withRequest: {
                    method: 'GET',
                    path: '/product/12',
                    headers: {
                        Authorization: like('Bearer 2019-01-14T11:34:18.045Z'),
                    },
                },
                willRespondWith: {
                    status: 404
                },
            });
            const api = new API(`${url + port}`);
            await expect(api.getProduct("12")).rejects.toThrow("Request failed with status code 404");
        });

        test("No auth token", async () => {
            await pact.addInteraction({
                state: 'no auth token when getting one product',
                uponReceiving: 'a request to get one product with no auth token',
                withRequest: {
                    method: 'GET',
                    path: '/product/10'
                },
                willRespondWith: {
                    status: 401
                },
            });

            const api = new API(pact.mockService.baseUrl);
            await expect(api.getProduct("10")).rejects.toThrow("Request failed with status code 401");
        });

        // (5) validate the interactions you've registered and expected occurred
        // this will throw an error if it fails telling you what went wrong
        // This should be performed once per interaction test
        afterEach(() => pact.verify());

        // (6) write the pact file for this consumer-provider pair,
        // and shutdown the associated mock server.
        // You should do this only _once_ per Provider you are testing,
        // and after _all_ tests have run for that suite
        afterAll(() => pact.finalize());
    });
});
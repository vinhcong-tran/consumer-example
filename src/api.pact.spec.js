import {API} from './api'
import {Pact} from '@pact-foundation/pact'
import {like, eachLike, regex} from "@pact-foundation/pact/src/dsl/matchers";
import path from 'path'

const url = 'http://localhost:';
const port = 4321;

describe('Demo test', () => {

    // (1) Create the Pact object to represent your provider
    const pact = new Pact({
        consumer: 'Consumer',
        provider: 'Provider',
        port: port,
        log: path.resolve(process.cwd(), 'logs', 'pact.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        logLevel: 'INFO',
    });

    describe('retrieving products', () => {
        beforeAll(() => {
            // (2) Start the mock server
            pact.setup().then(async () => {
                // this is the response you expect from your Provider
                const expectedProduct = {id: '10', type: 'CREDIT_CARD', name: '28 Degrees'}

                // (3) add interactions to the Mock Server, as many as required
                await pact.addInteraction({
                    // The 'state' field specifies a "Provider State"
                    state: 'products exist',
                    uponReceiving: 'a request to get all products',
                    withRequest: {
                        method: 'GET',
                        path: '/products',
                        headers: {
                            Authorization: like('Bearer 2019-01-14T11:34:18.045Z'),
                        },
                    },
                    willRespondWith: {
                        status: 200,
                        headers: {
                            'Content-Type': regex({generate: 'application/json; charset=utf-8', matcher: 'application/json;?.*'}),
                        },
                        body: eachLike(expectedProduct),
                    },
                });
            })
        });

        // (4) write your test(s)
        test('products exists', async () => {
            const api = new API(`${url + port}`);

            // make request to Pact mock server
            const products = await api.getAllProducts()

            // assert that we got the expected response
            expect(products.length).toBeGreaterThan(0);
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
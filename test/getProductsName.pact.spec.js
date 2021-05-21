import {API} from '../src/api'
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
        pactfileWriteMode: "update"
    });

    describe('Getting all products name', () => {

        // (2) Start the mock server
        beforeAll(() => pact.setup());

        // (4) write your test(s)
        test('Products name exist', async () => {

            // this is the response you expect from your Provider
            const expectedProductsName = [{name: 'Gem Visa'}, {name: '28 Degrees'}, {name: 'MyFlexiPay'}]

            await pact.addInteraction({
                // The 'state' field specifies a "Provider State"
                state: 'products name exist',
                uponReceiving: 'a request to get all products name',
                withRequest: {
                    method: 'GET',
                    path: '/products/name',
                    headers: {
                        Authorization: like('Bearer 2019-01-14T11:34:18.045Z'),
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': regex({generate: 'application/json; charset=utf-8', matcher: 'application/json;?.*'}),
                    },
                    body: (expectedProductsName),
                },
            });
            const api = new API(`${url + port}`);

            // make request to Pact mock server
            const productsName = await api.getProductsName();

            // assert that we got the expected response
            expect(productsName).toEqual(expectedProductsName);
        });

        test('No product name exists', async () => {
            await pact.addInteraction({
                state: 'no product name exists',
                uponReceiving: 'a request to get products name',
                withRequest: {
                    method: 'GET',
                    path: '/products/name',
                    headers: {
                        Authorization: like('Bearer 2019-01-14T11:34:18.045Z'),
                    },
                },
                willRespondWith: {
                    status: 200,
                    headers: {
                        'Content-Type': regex({generate: 'application/json; charset=utf-8', matcher: 'application/json;?.*'}),
                    },
                    body: [],
                },
            });
            const api = new API(`${url + port}`);
            const productsName = await api.getProductsName();
            expect(productsName).toEqual([]);
        });

        test("No auth token", async () => {
            await pact.addInteraction({
                state: 'no auth token when getting product name',
                uponReceiving: 'a request to get product name with no auth token',
                withRequest: {
                    method: 'GET',
                    path: '/products/name'
                },
                willRespondWith: {
                    status: 401
                },
            });

            const api = new API(pact.mockService.baseUrl);
            await expect(api.getProductsName()).rejects.toThrow("Request failed with status code 401");
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
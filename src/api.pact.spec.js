import {API} from './api'
import {Pact} from '@pact-foundation/pact'
import {like, eachLike, regex} from "@pact-foundation/pact/src/dsl/matchers";
import path from 'path'

const url = 'http://localhost:';
const port = 4321;

describe('Demo test', () => {
    const pact = new Pact({
        consumer: 'Consumer',
        provider: 'Provider',
        port: port,
        log: path.resolve(process.cwd(), 'logs', 'pact.log'),
        dir: path.resolve(process.cwd(), 'pacts'),
        logLevel: 'INFO',
    });

    describe('retrieving products', () => {
        beforeAll(() => pact.setup().then(async () => {
            // set up Pact interactions
            const expectedProduct = {id: '10', type: 'CREDIT_CARD', name: '28 Degrees'}

            await pact.addInteraction({
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
        }));
        afterEach(() => pact.verify());
        afterAll(() => pact.finalize());

        test('products exists', async () => {
            const api = new API(`${url+port}`);

            // make request to Pact mock server
            const products = await api.getAllProducts()

            // assert that we got the expected response
            expect(products.length).toBeGreaterThan(0);
        });
    });
});
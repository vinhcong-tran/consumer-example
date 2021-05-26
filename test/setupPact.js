import {Pact} from "@pact-foundation/pact";
import path from "path";

export const url = 'http://localhost:';
export const port = 4321;

export const pact = new Pact({
    consumer: process.env.CONSUMER_NAME,
    provider: process.env.PROVIDER_NAME,
    port: port,
    log: path.resolve(process.cwd(), 'logs', 'pact.log'),
    dir: path.resolve(process.cwd(), 'pacts'),
    logLevel: 'INFO',
    pactfileWriteMode: "update"
});
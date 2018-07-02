import { Config } from './config';

export class Account {
    id: string;
    msp: string;
    channel: string;
    name: string;
    organization: string;
    unit: string;

    config?: Config;
}
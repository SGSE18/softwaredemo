import { Network } from './network';
import { Identity } from './identity';

export interface Config {
    Network: Network;
    Identity: Identity;
    Matches: RegExp;
}
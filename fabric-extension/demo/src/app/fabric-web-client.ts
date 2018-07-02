import { EventEmitter } from 'events';
import { Message, ChaincodeMessage } from 'shared';

export class FabricWebClient {
    private _events: EventEmitter;

    constructor() {
        this._events = new EventEmitter();

        window.addEventListener('message', (event) => {
            if (event.source !== window) {
                return;
            }

            const message = event.data as Message;

            if (message.target !== 'finpage') {
                return;
            }

            this._handleMessage(message);
        });
    }

    get Events(): EventEmitter { return this._events; }


    getExtensionState() {
        this._sendMessage('util.ping');
    }
    getLoginState() {
        this._sendMessage('util.loggedin');
    }
    getAccount() {
        this._sendMessage('account.get');
    }
    getLedgerData(chaincodeId: string, fcn: string, params: string[]= []) {
        const msg: ChaincodeMessage = {
            chaincodeId: chaincodeId,
            fcn: fcn,
            args: params
        };
        this._sendMessage('ledger.data', msg);
    }

    private _handleMessage(message: Message) {
        this.Events.emit('message', message);
    }

    private _sendMessage(fcn: string, param?: any) {
        const message: Message = {
            fcn: fcn,
            target: 'fcontent',
            params: param
        };
        window.postMessage(message, '*');
    }
}

import { PluginState } from './plugin.state';
import { Message, Account, ChaincodeMessage } from 'shared';
import { Client } from '../../fabric-grpc-client';

export class TabHandler {
    private state: PluginState;

    constructor(state: PluginState) {
        this.state = state;

        this.state.Events.addListener('user', () => this.sendUpdate('event.user'));
    }

    handleMessage(tab:  chrome.tabs.Tab, message: Message, sendResponse: (response: any) => void): boolean | null {
        let account = this.findAccount(message.url);

        switch (message.fcn) {
            case 'util.ping':
                sendResponse({is: 'here'});
                break;
            case 'util.loggedin':
                sendResponse(this.state.User != null);
            case 'account.get':
                sendResponse(account);
                break;
            case 'ledger.data':
                if (!account)
                    return null;

                this.invokeChaincode(account, message.params).then((response: any) => sendResponse(response));
                return true;
        }

        return false;
    }

    private sendUpdate(type: string) {
        chrome.tabs.query( { active: true, windowType: 'normal'}, (tab) => {
            if (tab.length <= 0)
                return;

            let active = tab[0];
            if (!active || !active.id)
                return;

            let msg: Message = {
                fcn: type,
            };

            chrome.tabs.sendMessage(active.id, msg);
        });
    }

    private findAccount(url: string | undefined): Account | undefined {
        if (!url)
            return;

        if (this.state.User == null)
            return;

        let account = this.state.User.Accounts.find((a) => {
            if (a.config == null)
                return false;

            let regex = new RegExp(a.config.Matches);
            let match = regex.exec(url);

            return match != null && match.length > 0;
        });

        return account;
    }

    private invokeChaincode(account: Account, params: ChaincodeMessage): Promise<any> {
        return new Promise(async (resolve) => {
            if (!account.config)
                return resolve();

            let client = new Client(account.config);
            let result = await client.QueryByChaincode(params.chaincodeId, params.fcn, params.args);

            resolve(result);
        });
    }
}
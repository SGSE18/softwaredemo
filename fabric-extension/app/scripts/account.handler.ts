import { Message, User, Config, Account } from 'shared';
import { UserStorage } from './user.storage';
import { PluginState } from './plugin.state';

let jsrsa = require('jsrsasign');

export class AccountHandler {

    userStorage: UserStorage;
    state: PluginState;

    constructor(state: PluginState) {
        this.userStorage = new UserStorage();
        this.state = state;
    }

    handleMessage(message: Message, sendResponse: (response: any) => void): boolean | null {
        switch (message.fcn) {
            case 'user.login':
                this.state.Password = message.params;
                if (!this.state.Password)
                    return null;

                this.userStorage.login(this.state.Password).then((user) => {
                    this.state.User = user;
                    if (!this.state.User && this.state.Password)
                        this.state.User = this.userStorage.init(this.state.Password);

                    sendResponse(this.getMinimalUser());
                }).catch(error => sendResponse(null));

                return true;

            case 'user.get':
                sendResponse(this.getMinimalUser());
                break;

            case 'user.logout':
                this.state.User = null;
                this.state.Password = null;
                break;

            case 'user.reset':
                this.state.User = null;
                this.state.Password = null;
                this.userStorage.reset();
                break;

            case 'account.add':
                this.addAccount(message.params);
                sendResponse(this.getMinimalUser());
                break;

            case 'account.delete':
                this.deleteAccount(message.params);
                sendResponse(this.getMinimalUser());
                break;
        }

        return false;
    }

    getMinimalUser(): User | null {
        if (!this.state.User)
            return null;

        let user: User = {
            Accounts: new Array<Account>()
        };

        for (let account of this.state.User.Accounts) {
            user.Accounts.push({
                id: account.id,
                channel: account.channel,
                msp: account.msp,
                name: account.name,
                organization: account.organization,
                unit: account.unit
            });
        }

        return user;
    }

    addAccount(config: Config) {
        if (!this.state.Password || !this.state.User)
            return;

        if (!config.Identity || !config.Identity.Certificate || !config.Identity.Key || !config.Identity.Msp)
            return;

        if (!config.Network || !config.Network.Channel || !config.Network.Orderer || !config.Network.Hubs)
            return;

        let user = this.state.User;

        let x509 = new jsrsa.X509();
        x509.readCertPEM(config.Identity.Certificate);

        let subject = this.parse(x509.getSubjectString());

        let account: Account = {
            id: x509.getSerialNumberHex(),

            channel: config.Network.Channel,
            msp: config.Identity.Msp,
            name: subject.CN,
            organization: subject.O,
            unit: subject.OU,

            config: config
        };

        user.Accounts.push(account);

        this.userStorage.save(this.state.Password, user);

        this.state.User = user;
    }

    deleteAccount(id: string) {
        if (!this.state.Password || !this.state.User)
            return;

        let index = this.state.User.Accounts.findIndex(acc => acc.id === id);
        if (index < 0)
            return;

        let user = this.state.User;

        user.Accounts.splice(index, 1);

        this.userStorage.save(this.state.Password, user);

        this.state.User = user;
    }

    parse(entry: string): any {
        let regex = /\/(\w*)=([\w\s\s\.\-]*)/g;

        let match = null;
        let result: {[index: string]: string} = {};

        while (match = regex.exec(entry)) {
            result[match[1]] = match[2];
        }

        return result;
    }


}
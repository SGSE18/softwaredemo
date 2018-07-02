import { User } from 'shared';
let CryptoJS = require('crypto-js');

export class UserStorage {
    init(password: string): User {
        let user: User = {
            Accounts: []
        };

        this.save(password, user);
        return user;
    }

    login(password: string): Promise<User> {
        return new Promise<User>((resolve, error) => {
            chrome.storage.local.get((items) => {
                let encrypted = items['user'];
                if (!encrypted)
                    return resolve();

                try {
                    let decrypted = CryptoJS.AES.decrypt(encrypted, password).toString(CryptoJS.enc.Utf8);
                    let user: User = JSON.parse(decrypted);
                    resolve(user);
                } catch (e) {
                    error(e);
                }
            });
        });
    }

    save(password: string, user: User): void {
        // encrypt user
        let decrypted = JSON.stringify(user);
        let encrypted = CryptoJS.AES.encrypt(decrypted, password).toString();

        chrome.storage.local.set({'user': encrypted});
    }

    reset() {
        chrome.storage.local.set({'user': undefined});
    }
}
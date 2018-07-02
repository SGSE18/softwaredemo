import { User, Account } from 'shared';
import { EventEmitter } from 'events';



export class PluginState {
    private _user: User | null;
    private _password: string | null;
    private _events: EventEmitter;

    constructor() {
        this._events = new EventEmitter();
    }

    get User(): User | null { return this._user; }
    set User(user: User | null) {
        this._user = user;
        this._events.emit('user', this._user);
    }

    get Password(): string | null { return this._password; }
    set Password(password: string | null) { this._password = password; }

    get Events(): EventEmitter { return this._events; }
}
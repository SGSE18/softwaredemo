import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import {User} from 'shared';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private messageService: MessageService) {

  }

  get(): Promise<User> {
    return this.messageService.sendMessage('user.get');
  }

  login(password: string): Promise<User> {
    return this.messageService.sendMessage('user.login', password);
  }

  logout(): Promise<{}> {
    return this.messageService.sendMessage('user.logout');
  }

  reset(): Promise<{}> {
    return this.messageService.sendMessage('user.reset');
  }
}

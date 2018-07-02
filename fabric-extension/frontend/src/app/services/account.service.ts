import { Injectable } from '@angular/core';
import { MessageService } from './message.service';
import { User } from 'shared';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  constructor(private messageService: MessageService) { }

  add(account): Promise<User> {
    return this.messageService.sendMessage('account.add', account);
  }

  remove(id: string): Promise<User> {
    return this.messageService.sendMessage('account.delete', id);
  }
}

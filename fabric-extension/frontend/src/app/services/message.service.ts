import { Injectable } from '@angular/core';
import { Message } from 'shared';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor() { }

  sendMessage<TRequest, TResponse>(fcn: string, request?: TRequest): Promise<TResponse> {
    return new Promise<TResponse>((resolve) => {
      const message: Message = {
        fcn: fcn,
        params: request
      };
      chrome.runtime.sendMessage(message, (response) => {
        resolve(response);
      });
    });
  }
}

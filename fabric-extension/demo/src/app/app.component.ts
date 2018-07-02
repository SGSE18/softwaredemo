import { Component, OnInit } from '@angular/core';
import { FabricWebClient } from './fabric-web-client';
import { Message, Account } from 'shared';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  extensionState = false;
  loggedin = false;

  client: FabricWebClient;
  account: Account;

  requestData: MatTableDataSource<Object>;
  recordData: MatTableDataSource<Object>;

  constructor() {
    this.client = new FabricWebClient();
    this.client.Events.addListener('message', (message: Message) => this.handleMessage(message));
  }

  ngOnInit() {
    setTimeout(() => this.client.getExtensionState(), 500);
  }

  getData(fcn: string) {
    this.requestData = null;
    this.recordData = null;
    this.client.getLedgerData('healthledger', fcn);
  }

  handleMessage(message: Message) {
    switch (message.fcn) {
      case 'util.ping':
        this.extensionState = true;
        this.client.getLoginState();
        break;
      case 'util.loggedin':
        this.loggedin = message.params;
        this.account = null;
        this.requestData = null;
        this.recordData = null;
        this.client.getAccount();
        break;
      case 'event.user':
        this.account = null;
        this.client.getLoginState();
        break;
      case 'account.get':
        this.account = message.params;
        if (this.account) {
          this.getData('request.get');
        }
        break;
      case 'ledger.data':
        if (!message.params || message.params.length === 0) {
          return;
        }

        message.params = message.params.sort((a , b) => {
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        });
        if (message.params[0].Result) {
          this.requestData = new MatTableDataSource(message.params);
        } else {
          this.recordData = new MatTableDataSource(message.params);
        }
        break;
    }
  }
}

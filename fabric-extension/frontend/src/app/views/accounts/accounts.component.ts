import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from 'shared';
import { Router } from '@angular/router';
import { AccountService } from '../../services/account.service';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.css']
})
export class AccountsComponent implements OnInit {
  user: User;
  constructor(private userService: UserService,
              private accountService: AccountService,
              private router: Router) { }

  async ngOnInit() {
    this.user = await this.userService.get();
    if (!this.user) {
      this.router.navigate(['login']);
    }
  }

  addAccount(file) {
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const account = JSON.parse(reader.result);

        this.user = await this.accountService.add(account);
      } catch (error) { }
    };
    reader.readAsText(file[0], 'UTF-8');
  }

  async delAccount(id) {
    this.user = await this.accountService.remove(id);
  }

  logout() {
    this.userService.logout();
    this.router.navigate(['login']);
  }
}

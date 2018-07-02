import { Component, OnInit, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  password: string;
  isError = false;

  constructor(private userService: UserService,
              private router: Router) { }

  async ngOnInit() {
    const user = await this.userService.get();

    if (user) {
     this.router.navigate(['accounts']);
    }
  }

  login() {
    this.isError = false;
    if (!this.password) {
      this.isError = true;
      return;
    }

    this.userService.login(this.password).then((result) => {
      if (result) {
        this.router.navigate(['accounts']);
      } else {
        this.isError = true;
      }
    });
  }

  async reset() {
    this.userService.reset();
  }
}

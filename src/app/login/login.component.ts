import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bookr-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {

  credentials = {
    email: '',
    password: ''
  };

  registerInfo = '';

  constructor(
    private router: Router,
    private authService: AuthService
    ) {}

  login() {
    this.authService.login(this.credentials)
      .then(() => this.router.navigate(['/dashboard']))
      .catch(err => console.log(err.message));
  }

  register() {
    this.authService.register(this.credentials)
      .then(() => this.registerInfo = 'ACCOUNT CREATED, PLZ LOGIN IN!')
      .catch(err => console.log(err.message));
  }

  ngOnInit() {
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

enum LoginType { Email, Facebook, Google }

@Component({
  selector: 'bookr-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {

  credentials = {
    email: '',
    password: ''
  };

  loginType = LoginType;
  errorMessage;

  constructor(private router: Router, private authService: AuthService) { }

  signUp() {

    this.authService.register(this.credentials)
      .then(() => {

      })
      .catch((err) => {
        this.errorMessage = err.message;
      });
  }

  ngOnInit() { }

}

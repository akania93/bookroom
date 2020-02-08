import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

enum SocialLoginType { Email, Facebook, Google }

@Component({
  selector: 'bookr-sign-up',
  templateUrl: './sign-up.component.html'
})
export class SignUpComponent implements OnInit {

  credentials = {
    email: '',
    password: ''
  };
  registerInfo = '';
  socialLoginType = SocialLoginType;

  constructor(private router: Router, private authService: AuthService) { }

  signUp(type: SocialLoginType) {
    if (type === SocialLoginType.Email) {

      this.authService.register(this.credentials)
      .then(() => this.registerInfo = 'ACCOUNT CREATED, PLZ LOGIN IN!')
      .catch(err => console.log(err.message));

    } else if (type === SocialLoginType.Facebook) {
      console.log("facebook login");
    } else if (type === SocialLoginType.Google) {
      console.log("google login");
    } else {
      console.warn("Nieznana metoda logowania");
    }
  }

  ngOnInit() { }

}

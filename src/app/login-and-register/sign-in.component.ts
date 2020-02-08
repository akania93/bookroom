import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

enum SocialLoginType { Email, Facebook, Google }

@Component({
  selector: 'bookr-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {

  credentials = {
    email: '',
    password: ''
  };
  registerInfo = '';
  socialLoginType = SocialLoginType;

  constructor(private router: Router, private authService: AuthService) { }

  signIn(type: SocialLoginType) {
    if (type === SocialLoginType.Email) {

      this.authService.login(this.credentials)
      .then(() => this.router.navigate(['/']))
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
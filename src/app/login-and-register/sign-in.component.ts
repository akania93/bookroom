import { Component, OnInit } from '@angular/core';
import { AuthService, Credentials } from '../shared/services/auth.service';
import { Router } from '@angular/router';

enum LoginType { Email, Facebook, Google }

@Component({
  selector: 'bookr-sign-in',
  templateUrl: './sign-in.component.html'
})
export class SignInComponent implements OnInit {

  credentials: Credentials = {
    email: '',
    password: ''
  };
  errorMessage = '';
  loginType = LoginType;

  constructor(private router: Router, private authService: AuthService) { }

  signIn(type: LoginType) {
    if (type === LoginType.Email) {

      this.authService.login(this.credentials)
        // .then(() => (console.log("then 2")))
        .catch((err) => {

          switch (err.code) {
            case "auth/user-not-found": {
              this.errorMessage = "Nie znaleziono użytkownika. Konto mogło zostać usunięte";
              break;
            }
            case "auth/wrong-password": {
              this.errorMessage = "Niepoprawne hasło lub login";
              break;
            }
            case "auth/too-many-requests": {
              this.errorMessage = "Zbyt wiele błędnych logowań. Spróbuj ponownie później";
              break;
            }
            default: {
              this.errorMessage = err.message;
              break;
            }
          }

        });


    } else if (type === LoginType.Facebook) {
      this.authService.doFacebookLogin()
        .catch((err) => {
          this.errorMessage = err.message;
        });

    } else if (type === LoginType.Google) {

      this.authService.doGoogleLogin()
        .catch((err) => {
          this.errorMessage = err.message;
        });

    } else {
      console.warn("Nieznana metoda logowania");
    }
  }

  ngOnInit() { }

}
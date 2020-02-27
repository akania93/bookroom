import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { AppUser } from '../shared/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'bookr-account-details',
  templateUrl: './account-details.component.html',
  styles: []
})
export class AccountDetailsComponent implements OnInit {

  localStorageUser: AppUser = this.authService.localStorageUser;
  city; // TODO: trzeba obsłużyć

  errorMessage;
  passwordChangeDisabled = false;
  profileCredentials: ProfileCredentials;
  password_credentials: PasswordCredentials = {
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient) { }

  updateProfile() {

  }

  updatePassword() {
    let prvoviderId = this.authService.providerId;
    if (prvoviderId === "password") {
      if (this.password_credentials.password === this.password_credentials.confirmPassword) {
        this.authService.ChangePassword(this.password_credentials.password);
      } else {
        this.errorMessage = "Hasła nie są identyczne."
      }
    } else {
      this.errorMessage = `Ten email jest już używany dla metody logowania: ${prvoviderId}. Nie możesz zresetować hasła.`;
    }

    // var localUserEmail = this.authService.localStorageUser.email;
    // const result$: Observable<AppUser[]> = this.http.get<AppUser[]>(`${this.authService.serverUrl}/users/`);
    // result$.subscribe(
    //   value => {
    //     const appUser = value.filter(item => item.email === localUserEmail)[0];
    //     if (appUser !== undefined) {

    //     }
    //   },
    //   error => this.errorMessage = error);
  }

  ngOnInit() {
    if (this.authService.providerId !== "password") {
      this.passwordChangeDisabled = true;
    }

    this.profileCredentials = {
      name: this.localStorageUser.displayName.split(' ')[0],
      surname: this.localStorageUser.displayName.split(' ')[1],
      email: this.localStorageUser.email,
      phoneNumber: this.localStorageUser.phoneNumber,
      city: null
    };
  }

}

interface PasswordCredentials {
  password: string;
  confirmPassword: string;
}
interface ProfileCredentials {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  city: string;
}


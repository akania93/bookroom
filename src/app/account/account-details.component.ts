import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService, ProfileCredentials } from '../shared/services/auth.service';
import { AppUser } from '../shared/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'bookr-account-details',
  templateUrl: './account-details.component.html',
  styles: []
})
export class AccountDetailsComponent implements OnInit {

  localStorageAppUser: AppUser = this.authService.getLocalStorageAppUser;
  city; // TODO: trzeba obsłużyć

  errorMessage;
  passwordChangeEnabled = false;
  profileCredentials: ProfileCredentials;
  passwordCredentials = {
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient) { }

  updatePassword() {
    if (this.passwordCredentials.password === this.passwordCredentials.confirmPassword) {
      this.authService.ChangePassword(this.passwordCredentials.password);
    } else {
      this.errorMessage = "Hasła nie są identyczne."
    }
  }

  ngOnInit() {
    if (this.authService.getProviderId === "password") {
      this.passwordChangeEnabled = true;
    }

    let displayNameArray = null;
    let surnameBuilder = null;
    if (this.localStorageAppUser.displayName !== null) {
      displayNameArray = this.localStorageAppUser.displayName.split(' ');
      displayNameArray.slice(1).forEach(function (el) {
        surnameBuilder = ' ' + el;
      });
      if (surnameBuilder !== null) {
        surnameBuilder = surnameBuilder.substring(1);
      }
    }

    this.profileCredentials = {
      name: displayNameArray !== null ? displayNameArray[0] : null,
      surname: surnameBuilder,
      email: this.localStorageAppUser.email,
      phoneNumber: this.localStorageAppUser.phoneNumber,
      city: this.localStorageAppUser.city
    };
  }

}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { AppUser } from '../shared/interfaces/user';

@Component({
  selector: 'bookr-account-details',
  templateUrl: './account-details.component.html',
  styles: []
})
export class AccountDetailsComponent implements OnInit {

  localStorageUser: AppUser = this.authService.localStorageUser;

  errorMessage;
  credentials: PasswordCredentials = {
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService) { }

  resetPassword() {

    if (this.credentials.password === this.credentials.confirmPassword) {
      this.authService.ChangePassword(this.credentials.password);
    } else {
      this.errorMessage = "Hasła nie są identyczne."
    }
  }

  ngOnInit() {
  }

}

interface PasswordCredentials {
  password: string;
  confirmPassword: string;
}

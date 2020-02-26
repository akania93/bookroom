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

  errorMessage;
  buttonTooltip;
  password_credentials: PasswordCredentials = {
    password: '',
    confirmPassword: ''
  };

  constructor(
    private router: Router,
    private authService: AuthService,
    private http: HttpClient) { }

  resetPassword() {
    // Trzeba pobrac providerId z api. Teraz muszę przeszukać całą listę.
    // TODO: Ale w api będzie już metoda na to prostsza.
    var localUserEmail = this.authService.localStorageUser.email;
    const result$: Observable<AppUser[]> = this.http.get<AppUser[]>(`${this.authService.serverUrl}/users/`);
    result$.subscribe(
      value => {
        const appUser = value.filter(item => item.email === localUserEmail)[0];
        if (appUser !== undefined) {
          if (appUser.providerId === "password") {

            if (this.password_credentials.password === this.password_credentials.confirmPassword) {
              this.authService.ChangePassword(this.password_credentials.password);
            } else {
              this.errorMessage = "Hasła nie są identyczne."
            }

          } else {
            this.errorMessage = `Ten email jest już używany dla metody logowania: ${appUser.providerId}. Nie możesz zresetować hasła.`;
          }
        } else {
          this.errorMessage = "Konto nie istnieje.";
        }
      },
      error => this.errorMessage = error);
  }

  ngOnInit() {
  }

}

interface PasswordCredentials {
  password: string;
  confirmPassword: string;
}

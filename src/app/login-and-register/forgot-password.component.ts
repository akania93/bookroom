import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { HttpClient } from '@angular/common/http';
import { AppUser } from '../shared/interfaces/user';
import { Observable } from 'rxjs';

@Component({
  selector: 'bookr-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: [],
})
export class ForgotPasswordComponent implements OnInit {
  errorMessage;

  constructor(
    public authService: AuthService,
    private router: Router,
    private http: HttpClient
  ) {}

  ngOnInit() {}

  // Użycie dla użytkownika w Api DB
  // TODO: jak zdecyduję się na firestore to usunąć to
  forgotPassword(passwordResetEmail) {
    // Trzeba pobrac providerId z api. Teraz muszę przeszukać całą listę.
    // TODO: Ale w api będzie już metoda na to prostsza.
    const result$: Observable<AppUser[]> = this.http.get<AppUser[]>(
      `${this.authService.serverUrl}/users/`
    );
    result$.subscribe(
      (value) => {
        const appUser = value.filter(
          (item) => item.email === passwordResetEmail
        )[0];
        if (appUser !== undefined) {
          if (appUser.providerId === "password") {
            this.authService.ResetPassword(passwordResetEmail);
          } else {
            this.errorMessage = `Ten email jest już używany dla metody logowania: ${appUser.providerId}. Nie możesz zresetować hasła.`;
          }
        } else {
          this.errorMessage = "Konto nie istnieje.";
        }
      },
      (error) => (this.errorMessage = error)
    );
  }
}

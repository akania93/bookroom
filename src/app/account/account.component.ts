import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'bookr-account',
  templateUrl: './account.component.html',
  styles: []
})
export class AccountComponent implements OnInit {

  user = this.authService.user;

  constructor(private router: Router, private authService: AuthService) { }

  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/']));
  }

  ngOnInit() {
  }

}

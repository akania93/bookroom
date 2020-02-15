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

  constructor(
    private router: Router,
    private authService: AuthService) { }

  ngOnInit() {
  }

}

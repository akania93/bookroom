import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { AppUser } from '../shared/interfaces/user';

@Component({
  selector: 'bookr-account',
  templateUrl: './account.component.html',
  styles: []
})
export class AccountComponent implements OnInit {

  // user = this.authService.user;
  localStorageUser = this.authService.localStorageUser;
  emptyPhotoURL = "assets/image/facebook-profile-photo.jpg";
  
  name = this.localStorageUser["name"];
  createdAt = this.localStorageUser["createdAt"];
  lastLoginAt = this.localStorageUser["lastLoginAt"];

  constructor(private router: Router, private authService: AuthService) { }

  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/']));
  }

  ngOnInit() {

  }

}

import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { User } from 'firebase';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppUser } from '../shared/interfaces/user';

@Component({
  selector: 'bookr-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() brandName: string;

  currentUser: User;
  appUser: AppUser;
  emptyPhotoURL = "https://cdn2.iconfinder.com/data/icons/user-icon-2-1/100/user_5-15-512.png";
  photoUrl;

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {

    this.authService.authState$.subscribe(
      (value) => {

        this.currentUser = value;
        this.appUser = this.authService.appUser;
        this.photoUrl = (this.currentUser !== null && this.currentUser.photoURL !== null)
          ? this.currentUser.photoURL : this.emptyPhotoURL;

      },
      (error) => {
        console.error("navbar authState ERROR: ", JSON.stringify(error));
      });
  }
}

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
  // localStorageUser: AppUser;
  emptyPhotoURL = "assets/image/facebook-profile-photo.jpg";
  photoUrl;

  constructor(private authService: AuthService, private router: Router) { }

  logout() {
    this.authService.logout();
  }

  ngOnInit() {

    this.authService.authState$.subscribe(
      (value) => {

        this.currentUser = value;
        // this.localStorageUser = this.authService.localStorageUser;
        this.photoUrl = (this.currentUser !== null && this.currentUser.photoURL !== null)
          ? this.currentUser.photoURL : this.emptyPhotoURL;

      },
      (error) => {
        console.error("navbar authState ERROR: ", JSON.stringify(error));
      });
  }
}

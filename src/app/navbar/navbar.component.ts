import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../shared/services/auth.service';
import { User } from 'firebase';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AppUser } from '../shared/interfaces/user';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'bookr-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() brandName: string;

  currentUser: User;
  localStorageAppUser = this.authService.getLocalStorageAppUser;
  
  emptyPhotoURL = "assets/image/facebook-profile-photo.jpg";
  imageToShow: any;
  isImageLoading = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private http: HttpClient) { }

  logout() {
    this.authService.logout();
  }

  // #region image
  getImageFromService(imageUrl: string) {
    this.isImageLoading = true;
    this.getImage(imageUrl).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.warn("[navbar.component.ts] getImageFromService(): ", "Nie udało się odczytać obrazka");
      console.error(JSON.stringify(error));
    });
  }
  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }
  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      this.imageToShow = reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
  // #endregion image

  ngOnInit() {

    this.authService.authState$.subscribe(
      (value) => {
        this.currentUser = value;
        if (this.authService.isLoggedIn) {
          this.getImageFromService(this.localStorageAppUser.image);
        }
      },
      (error) => {
        console.error("navbar ngOnInit ERROR: ", JSON.stringify(error));
      });
  }
}

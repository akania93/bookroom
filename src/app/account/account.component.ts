import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { AppUser } from '../shared/interfaces/user';
import { User } from 'firebase';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ImageService } from '../shared/services/image.service';

@Component({
  selector: 'bookr-account',
  templateUrl: './account.component.html',
  styles: []
})
export class AccountComponent implements OnInit {

  currentUser: User;
  localStorageUser = this.authService.localStorageUser;

  emptyPhotoURL = "assets/image/facebook-profile-photo.jpg";
  imageToShow: any;
  isImageLoading = false;

  constructor(
    private router: Router,
    private http: HttpClient,
    private authService: AuthService,
    private imageService: ImageService) { }

  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/']));
  }

// #region image
  getImageFromService(imageUrl: string) {
    this.isImageLoading = true;
    this.getImage(imageUrl).subscribe(data => {
      this.createImageFromBlob(data);
      this.isImageLoading = false;
    }, error => {
      this.isImageLoading = false;
      console.error("[account.component.ts] getImageFromService(): ", error);
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
        this.getImageFromService(this.currentUser.photoURL);
      },
      (error) => {
        console.error("account ngOnInit ERROR: ", JSON.stringify(error));
      });
  }

}

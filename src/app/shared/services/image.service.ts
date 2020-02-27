import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ImageService {
// nie wiem kurwa jak to ładnie zrobić
  constructor(
    private http: HttpClient) { }

  getImage(imageUrl: string): Observable<Blob> {
    return this.http.get(imageUrl, { responseType: 'blob' });
  }

  createImageFromBlob(image: Blob) {
    const reader = new FileReader();
    reader.addEventListener("load", () => {
      return reader.result;
    }, false);

    if (image) {
      reader.readAsDataURL(image);
    }
  }
}

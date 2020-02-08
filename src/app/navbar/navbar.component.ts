import { Component, OnInit, Input } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from 'firebase';
import { map } from 'rxjs/operators';

@Component({
  selector: 'bookr-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {

  @Input() brandName: string;

  currentUser: User;

  constructor(private authService: AuthService) { }

  ngOnInit() {
     this.authService.authState$.subscribe(
      (value) => {
        this.currentUser = value;
      },
      (error) => {
        console.error("navbar authState ERROR: ", error);
      });
  }

}

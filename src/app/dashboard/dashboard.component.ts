import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bookr-dashboard',
  template: `
  <div class="container" style="padding-top:60px;">
    <div class="fs-12">
      <pre>{{ user | json }}</pre>
      <button (click)="logout()">LOGOUT</button>
    </div>
  </div>
    
  `
})
export class DashboardComponent implements OnInit {

  user = this.authService.user;

  constructor(
    private router: Router,
    private authService: AuthService
  ) { }

  logout() {
    this.authService.logout()
      .then(() => this.router.navigate(['/login']));
  }

  ngOnInit() {
  }

}

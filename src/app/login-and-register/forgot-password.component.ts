import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'bookr-forgot-password',
  templateUrl: './forgot-password.component.html',
  styles: []
})
export class ForgotPasswordComponent implements OnInit {


  errorMessage = '';
  
  constructor(private router: Router, private authService: AuthService) { }

  ngOnInit() {
  }

}

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AppComponent } from './app.component';
import { SignComponent } from './login-and-register/sign.component';
import { SignInComponent } from './login-and-register/sign-in.component';
import { SignUpComponent } from './login-and-register/sign-up.component';
import { ForgotPasswordComponent } from './login-and-register/forgot-password.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AppRoutingModule } from './app-routing.module';
import { environment } from 'src/environments/environment';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NavbarComponent } from './navbar/navbar.component';
import { AccountComponent } from './account/account.component';
import { AuthService } from './shared/services/auth.service';
import { HttpClientModule } from '@angular/common/http';
import { AccountDetailsComponent } from './account/account-details.component';
import { AccountAdvertisementsComponent } from './account/account-advertisements.component';


@NgModule({
  declarations: [
    AppComponent,
    SignComponent,
    SignInComponent,
    SignUpComponent,
    ForgotPasswordComponent,
    DashboardComponent,
    NavbarComponent,
    AccountComponent,
    AccountDetailsComponent,
    AccountAdvertisementsComponent

  ],
  imports: [
    AngularFireModule.initializeApp(environment.firebaseConfig),
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    AngularFireAuthModule,
    AngularFirestoreModule,
    MDBBootstrapModule.forRoot(),
    HttpClientModule
  ],
  providers: [
    AuthService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

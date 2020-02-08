import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignInComponent } from './login-and-register/sign-in.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';
import { AccountComponent } from './account/account.component';
import { SignUpComponent } from './login-and-register/sign-up.component';
import { SignComponent } from './login-and-register/sign.component';
import { ForgotPasswordComponent } from './login-and-register/forgot-password.component';


const routes: Routes = [
  { path: '', redirectTo: '/', pathMatch: 'full' },
  // { path: '**', redirectTo: '/', pathMatch: 'full'}, // tutaj dodac stronę erroru
  { path: '', component: DashboardComponent },
  // { path: 'login', component: LoginComponent },
  // { path: 'login/signup', component: RegisterComponent },

  {
    path: 'sign', component: SignComponent,
    children: [
      { path: '', component: SignInComponent },
      { path: 'signup', component: SignUpComponent },
      { path: 'forgot', component: ForgotPasswordComponent }
    ]
  },

  { path: 'account', component: AccountComponent } //, canActivate: [AuthGuard]

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

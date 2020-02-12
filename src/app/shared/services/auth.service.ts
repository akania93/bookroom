import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from 'firebase';
import { Observable } from 'rxjs/index';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AppUser } from "../interfaces/user";

export interface Credentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly authState$: Observable<User | null> = this.fireAuth.authState;
  userData: any; // Save logged in user data

  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private afs: AngularFirestore, // Inject Firestore service
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
        logged in and setting up null when logged out */
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));
      } else {
        localStorage.setItem('user', null);
      }
    });
  }

  get user(): User | null {
    return this.fireAuth.auth.currentUser;
  }
  get appUser(): AppUser | null {
    return JSON.parse(localStorage.getItem('user'));
  }
  // Returns true when user is looged in and email is verified
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return user !== null;
    // return (user !== null && user.emailVerified !== false) ? true : false;
  }


  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    const userRef: AngularFirestoreDocument<any> = this.afs.doc(`users/${user.uid}`);
    const userData: AppUser = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified
    };

    return userRef.set(userData, {
      merge: true
    });
  }

  register({ email, password }: Credentials) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          this.ngZone.run(() => {
            this.router.navigate(['sign']);
          });
          this.SetUserData(res.user);
          resolve(res);
        }).catch((error) => {
          console.error("log: ", JSON.stringify(error));
          reject(error);
        });
    });
  }

  login({ email, password }: Credentials) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.signInWithEmailAndPassword(email, password)
        .then(res => {
          this.ngZone.run(() => {
            this.router.navigate(['']);
          });
          this.SetUserData(res.user);
          resolve(res);
        }).catch((error) => {
          console.error("log: ", JSON.stringify(error));
          reject(error);
        });
    });
  }

  doFacebookLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.FacebookAuthProvider();
      this.fireAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          this.ngZone.run(() => {
            this.router.navigate(['/']);
          });
          this.SetUserData(res.user);
          resolve(res);
        }, err => {
          console.error("log: ", JSON.stringify(err));
          reject(err);
        });
    });
  }

  doGoogleLogin() {
    return new Promise<any>((resolve, reject) => {
      let provider = new firebase.auth.GoogleAuthProvider();
      provider.addScope('profile');
      provider.addScope('email');
      this.fireAuth.auth
        .signInWithPopup(provider)
        .then(res => {
          this.ngZone.run(() => {
            this.router.navigate(['/']);
          });
          this.SetUserData(res.user);
          resolve(res);
        }, err => {
          console.error("log: ", JSON.stringify(err));
          reject(err);
        });
    });
  }

  // Auth logic to run auth providers
  // AuthLogin(provider) {
  //   return this.fireAuth.auth.signInWithPopup(provider)
  //     .then((result) => {
  //       this.ngZone.run(() => {
  //         this.router.navigate(['/']);
  //       });
  //       this.SetUserData(result.user);
  //     }).catch((error) => {
  //       window.alert(error);
  //     });
  // }
  // doFacebookLogin2() {
  //   return this.AuthLogin(new firebase.auth.FacebookAuthProvider());
  // }


  logout() {
    return this.fireAuth.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate(['/']);
      }).catch((error) => {
        console.error("log: ", JSON.stringify(error));
      });
  }

  // Send email verfificaiton when new user sign up
  SendVerificationMail() {
    return this.fireAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      }).catch((error) => {
        console.error("log: ", JSON.stringify(error));
      });
  }

  // Reset Forggot password
  ForgotPassword(passwordResetEmail) {
    // TODO : rozróżnić "providerId": "facebook.com" - albo użytkowników do bazy swojej albo do firebase
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.sendPasswordResetEmail(passwordResetEmail)
        .then(res => {
          this.ngZone.run(() => {
            this.router.navigate(['sign']);
          });
          window.alert('Wysłano maila do resetowania hasła. Sprawdź swoją pocztę.');
          resolve(res);
        }).catch((error) => {
          console.error("log: ", JSON.stringify(error));
          reject(error);
        });
    });
  }
}
import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFirestore, AngularFirestoreDocument, DocumentReference } from '@angular/fire/firestore';
import { User } from 'firebase';
import { Observable, throwError, from } from 'rxjs/index';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { AppUser } from "../interfaces/user";
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { map, catchError, filter, first } from 'rxjs/operators';

export interface Credentials {
  email: string;
  password: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly authState$: Observable<User | null> = this.fireAuth.authState;
  userData: any; // Save logged in user data
  userDoc: any; // Save logged in user data
  serverUrl: string = "http://localhost:3000";


  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient,
    private db: AngularFirestore, // Inject Firestore service
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
        logged in and setting up null when logged out */
    this.fireAuth.authState.subscribe(user => {
      if (user) {
        this.userData = user;
        localStorage.setItem('user', JSON.stringify(this.userData));

        this.db.collection('users').doc(user.uid).valueChanges()
          .subscribe(value => {
            this.userDoc = value;
            // localStorage.setItem('userDoc', JSON.stringify(value));
          });
      } else {
        localStorage.setItem('user', null);
        // localStorage.setItem('userDoc', null);
      }
    });
  }

  get user(): User | null {
    return this.fireAuth.auth.currentUser;
  }
  get localStorageUser(): AppUser | null {
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
    // const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    const userRef: AngularFirestoreDocument<any> = this.db.collection('users').doc(user.uid);

    const userData: AppUser = {
      uid: user.uid,
      providerId: user.providerData[0].providerId,
      displayName: user.displayName,
      image: user.photoURL,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber
    };

    return userRef.set(userData, {
      merge: true
    });
  }

  setUserDataToDB(fireUser) {
    // sprawdzanie czy już jest taki użytkownik:
    const result$: Observable<AppUser[]> = this.http.get<AppUser[]>(`${this.serverUrl}/users/`);
    result$.subscribe(
      value => {
        const appUser = value.filter(item => item.email === fireUser["email"])[0];
        if (appUser !== undefined) {
          // konto istnieje
        } else {

          let userToadd: AppUser = {
            uid: fireUser.uid,
            providerId: fireUser.providerData[0].providerId,
            displayName: fireUser.displayName,
            image: fireUser.photoURL,
            email: fireUser.email,
            emailVerified: fireUser.emailVerified,
            phoneNumber: fireUser.phoneNumber
          };
          return this.http.post<AppUser>(`${this.serverUrl}/users/`, userToadd).subscribe();

        }
      },
      error => { });
  }

  register({ email, password }: Credentials) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          this.ngZone.run(() => {
            this.router.navigate(['/']);
          });
          // this.SetUserData(res.user);
          this.setUserDataToDB(res.user);

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
          //this.SetUserData(res.user);
          resolve(res);
        }).catch((error) => {
          console.error("error log: ", JSON.stringify(error));
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
          //this.SetUserData(res.user);
          this.setUserDataToDB(res.user);
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
          //this.SetUserData(res.user);
          this.setUserDataToDB(res.user);
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


  logout(routing = '/') {
    return this.fireAuth.auth.signOut()
      .then(() => {
        localStorage.removeItem('user');
        this.router.navigate([routing]);
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
  ForgotPassword_with_firebase_db(passwordResetEmail) {
    this.db.collection('users', ref => ref.where('email', '==', passwordResetEmail)).valueChanges()
      .subscribe((value) => {

        let providerId = value[0]["providerId"];
        if (providerId === "password") {
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
        } else {
          window.alert(`Ten email jest już używany dla metody logowania: ${providerId}. Nie możesz zresetować hasła.`);
        }
      });
  }
  // Reset Forggot password
  ResetPassword(passwordResetEmail) {
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

  ChangePassword(newPassword) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.currentUser.updatePassword(newPassword)
        .then(res => {
          window.alert('Zmieniono hasło !');
          this.logout('sign');
          resolve(res);
        }).catch((error) => {
          console.error("log: ", JSON.stringify(error));
          reject(error);
        });
    });
  }

  DeleteUser() {
    let decision = window.confirm("Napewno?");
    const localStorageUserEmail = this.localStorageUser.email;

    if (decision) {
      return this.fireAuth.auth.currentUser.delete()
        .then(() => {
          this.deleteUserFromDB(localStorageUserEmail);
          this.logout();
        }).catch((error) => {
          if (error.code === "auth/requires-recent-login") {
            window.alert("Ta akcja wymaga ponownego zalogowania.");
            this.logout("/sign");
          }
          console.error("DeleteUser log: ", JSON.stringify(error));
        });
    }
  }
  private deleteUserFromDB(localStorageUserEmail) {
    // GET: po email lub uuid
    const result$: Observable<AppUser[]> = this.http.get<AppUser[]>(`${this.serverUrl}/users/`);
    result$.subscribe(
      value => {
        const appUser = value.filter(item => item.email === localStorageUserEmail)[0];
        if (appUser !== undefined) {
          return this.http.delete(`${this.serverUrl}/users/${appUser.id}`).subscribe();
        } else {
          console.warn(`log DeleteUser(): w DB nie znaleziono uzytkownika z emailem ${localStorageUserEmail}. Nic nie usunięto.`);
        }
      },
      error => console.error("log DeleteUser(): ", error));
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }





}




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
import { ImageService } from './image.service';

export interface Credentials {
  email: string;
  password: string;
}
export interface ProfileCredentials {
  name: string;
  surname: string;
  email: string;
  phoneNumber: string;
  city: string;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  readonly authState$: Observable<User | null> = this.fireAuth.authState;
  fuser: any; // Save logged in user data
  docUser: AppUser;
  // appUser: any;
  serverUrl: string = "http://localhost:3000";


  constructor(
    private fireAuth: AngularFireAuth,
    private router: Router,
    private http: HttpClient,
    private db: AngularFirestore,
    public ngZone: NgZone // NgZone service to remove outside scope warning
  ) {
    /* Saving user data in localstorage when 
        logged in and setting up null when logged out */
    this.fireAuth.authState.subscribe(authUser => {
      if (authUser) {
        const authUserstringify = JSON.stringify(authUser);
        this.fuser = authUserstringify;
        localStorage.setItem('f_user', authUserstringify);
        // this.appUser = this.mapFirebaseAuthUserToAppUser(authUser);
        // localStorage.setItem('app_user', JSON.stringify(this.appUser));

        this.db.collection('users').doc(authUser.uid).valueChanges()
          .subscribe(value => {
            this.docUser = value as AppUser;
            localStorage.setItem('doc_user', JSON.stringify(this.docUser));
          });
      } else {
        localStorage.setItem('f_user', null);
        // localStorage.setItem('app_user', null);
        localStorage.setItem('doc_user', null);
      }
    });
  }

  get getFuser(): User | null {
    return this.fireAuth.auth.currentUser;
  }
  get getLocalStorageAppUser(): AppUser | null {
    return JSON.parse(localStorage.getItem('doc_user'));
  }
  get getProviderId() {
    var appUser: AppUser = JSON.parse(localStorage.getItem('doc_user'));
    return appUser.providerId;
  }
  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('doc_user'));
    return (user !== null && user.email !== null) ? true : false;
  }

  mapFirebaseUserToAppUser(fuser) {
    const userData: AppUser = {
      uid: fuser.uid,
      providerId: fuser.providerData[0].providerId,
      displayName: fuser.displayName,
      image: fuser.photoURL,
      email: fuser.email,
      emailVerified: fuser.emailVerified,
      phoneNumber: fuser.phoneNumber,
      lastLoginAt: fuser.lastLoginAt,
      createdAt: fuser.createdAt
    };
    return userData;
  }
  mapFirebaseAuthUserToAppUser(fuser: User) {
    const userData: AppUser = {
      uid: fuser.uid,
      providerId: fuser.providerData[0].providerId,
      displayName: fuser.displayName,
      image: fuser.photoURL,
      email: fuser.email,
      emailVerified: fuser.emailVerified,
      phoneNumber: fuser.phoneNumber,
      city: null,
      lastLoginAt: fuser.metadata["b"],
      createdAt: fuser.metadata["a"]
    };
    return userData;
  }


  /* Setting up user data when sign in with username/password, 
  sign up with username/password and sign in with social auth  
  provider in Firestore database using AngularFirestore + AngularFirestoreDocument service */
  SetUserData(user) {
    // const userRef: AngularFirestoreDocument<any> = this.db.doc(`users/${user.uid}`);
    const userRef: AngularFirestoreDocument<AppUser> = this.db.collection('users').doc(user.uid);
    const userData: AppUser = this.mapFirebaseAuthUserToAppUser(user);

    return userRef.set(userData, {
      merge: true
    }).then(
      () => {
        localStorage.setItem('doc_user', JSON.stringify(userData));
      }
    );
  }

  // TODO: po decyzji zostania na firebase do usunięcia !
  setUserDataToDB(fireUser) {
    // sprawdzanie czy już jest taki użytkownik:
    const result$: Observable<AppUser[]> = this.http.get<AppUser[]>(`${this.serverUrl}/users/`);
    result$.subscribe(
      value => {
        const appUser = value.filter(item => item.email === fireUser["email"])[0];
        if (appUser !== undefined) {
          // konto istnieje
        } else {

          let userToadd: AppUser = this.mapFirebaseUserToAppUser(fireUser);
          return this.http.post<AppUser>(`${this.serverUrl}/users/`, userToadd).subscribe();
        }
      },
      error => { });
  }

  register({ email, password }: Credentials) {
    return new Promise<any>((resolve, reject) => {
      this.fireAuth.auth.createUserWithEmailAndPassword(email, password)
        .then(res => {
          this.SetUserData(res.user).then(
            () => {
              this.ngZone.run(() => {
                this.router.navigate(['/account']);
              });
              resolve(res);
            }
          );
          //this.setUserDataToDB(res.user);
          //resolve(res);
        }).catch((error) => {
          console.error("log: ", JSON.stringify(error));
          console.error("log: ", JSON.stringify(error.message));
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

  // #region social Login

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
          //this.setUserDataToDB(res.user);
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
          //this.setUserDataToDB(res.user);
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

  // #endregion social Login

  logout(routing = '/') {
    return this.fireAuth.auth.signOut()
      .then(() => {
        this.router.navigate([routing]);
      }).catch((error) => {
        console.error("log: ", JSON.stringify(error));
      });
  }

  // Send email verfificaiton when new user sign up
  // Na razie nie potrzebuję tego używać !
  SendVerificationMail() {
    return this.fireAuth.auth.currentUser.sendEmailVerification()
      .then(() => {
        this.router.navigate(['verify-email-address']);
      }).catch((error) => {
        console.error("log: ", JSON.stringify(error));
      });
  }

  // Forggot password na stronie logowania
  ForgotPassword(passwordResetEmail) {
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
  // Forggot password na stronie logowania używając usera w DB API
  // TODO: jak zdecyduję się na firestore to usunąć to
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
    const uid = this.getLocalStorageAppUser.uid;

    const userRef: AngularFirestoreDocument<AppUser> = this.db.collection('users').doc(uid);

    if (decision) {
      return this.fireAuth.auth.currentUser.delete()
        .then(() => {
          //this.deleteUserFromDB(email);

          userRef.delete()
          .then(() => this.logout());

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
    // DELETE: po email lub uuid
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

  UpdateProfile(profileCredentials: ProfileCredentials) {
    let dispName = profileCredentials.name;
    if (profileCredentials.surname) {
      dispName += ` ${profileCredentials.surname}`;
    }
    const userRef: AngularFirestoreDocument<AppUser> = this.db.collection('users').doc(this.getFuser.uid);

    this.getFuser.updateProfile({
      displayName: dispName,
      // photoURL: "https://example.com/jane-q-user/profile.jpg",
    }).then(
      () => {

        userRef.update({
          displayName: dispName,
          // image: ""
          phoneNumber: profileCredentials.phoneNumber,
          city: profileCredentials.city

        }).then(
          () => {

            let appUserTemp = JSON.parse(localStorage.getItem('doc_user')) as AppUser;
            appUserTemp.displayName = dispName;
            appUserTemp.phoneNumber = profileCredentials.phoneNumber;
            appUserTemp.city = profileCredentials.city;
            localStorage.setItem('doc_user', JSON.stringify(appUserTemp));

            window.alert("Aktualizacja profilu zakończona sukcesem :)");

          }
        );
      }
    ).catch((err) => console.error("[auth.service] UpdateProfile(): ", JSON.stringify(err)));


    // userRef.update({
    //   displayName: dispName,
    //   // image: ""
    //   phoneNumber: profileCredentials.phoneNumber,
    //   city: profileCredentials.city
    // });

    // let appUserTemp = JSON.parse(localStorage.getItem('doc_user')) as AppUser;
    // appUserTemp.displayName = dispName;
    // appUserTemp.phoneNumber = profileCredentials.phoneNumber;
    // appUserTemp.city = profileCredentials.city;
    // localStorage.setItem('doc_user', JSON.stringify(appUserTemp));
  }
}

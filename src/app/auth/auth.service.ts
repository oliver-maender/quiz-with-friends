import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject } from 'rxjs';
import { map, take } from 'rxjs/operators';

import { User } from '../shared/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  error = new Subject<string>();

  constructor(private auth: AngularFireAuth, private router: Router, private firestore: AngularFirestore) { }

  /**
   * Sending a login request to the firebase authentication.
   *
   * @param email - The submitted email address
   * @param password - The submitted password
   * @returns If it was successful or not
   */
  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then((resData) => {
      this.handleAuthentication(resData.user.displayName, resData.user.email, resData.user.uid);
      return resData;
    }).catch((error) => {
      let errorMessage = 'An unknown error occured.';
      if (error.code === 'auth/user-not-found') {
        errorMessage = 'This user does not exist.';
      } else if (error.code === 'auth/wrong-password') {
        errorMessage = 'This password is wrong.';
      }
      throw errorMessage;
    });
  }

  /**
   * Sending a signup request to the firebase authentication.
   *
   * @param username - The submitted username
   * @param email - The submitted email address
   * @param password - The submitted password
   * @returns If it was successful or not
   */
  signup(username: string, email: string, password: string) {
    return this.firestore.collection('users').doc('userlist').get().pipe(take(1), map((userlist: any) => {
      const users = userlist.data();
      for (const user in users) {
        if (Object.prototype.hasOwnProperty.call(users, user)) {
          const element = users[user];
          if (element === username) {
            this.error.next('Username already taken.');
            return false;
          }
        }
      }
      return this.auth.createUserWithEmailAndPassword(email, password).then(async (resData) => {
        const user = await this.auth.currentUser;
        this.handleAuthentication(username, resData.user.email, resData.user.uid);
        user.updateProfile({ displayName: username });
        this.firestore.collection('users').doc('userlist').update({ [resData.user.uid]: username });
        this.firestore.collection('users').doc(user.uid).set({ duels: [] });
        return resData;
      }).catch((error) => {
        let errorMessage = 'An unknown error occured.';
        if (error.code === 'auth/email-already-in-use') {
          errorMessage = 'This email already exists.';
        }
        this.error.next(errorMessage);
      });
    }));
  }

  /**
   * Logs the user out by removing his data from the local storage.
   */
  logout() {
    this.user.next(null);
    this.router.navigate(['/get-started']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  /**
   * Automatically logs the user in when the page gets reloaded using the data in the local storage.
   */
  autoLogin() {
    this.auth.authState.pipe(take(1)).subscribe(async (user) => {
      const userData = JSON.parse(localStorage.getItem('userData'));
      if (!userData) {
        return;
      }
      const userToken = (await (await this.auth.currentUser)?.getIdToken(false)).toString();
      console.log(userToken);
      if (userData._token === userToken) {
        this.user.next(userData);
        const expirationDuration = new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
        this.autoLogout(expirationDuration);
      }
    });
  }

  /**
   * Automatically logs out the user after a specified amount of time.
   *
   * @param expirationDuration - The milliseconds from now on when the user should get logged out automatically
   */
  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  /**
   * Handles the rest of the authentication when firebase has responded.
   *
   * @param username - The submitted username
   * @param email - The submitted email adress
   * @param uid - The user's ID
   */
  async handleAuthentication(username: string, email: string, uid: string) {
    const userToken = (await (await this.auth.currentUser)?.getIdToken(true)).toString();
    console.log(userToken);
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
    const userData = new User(username, email, uid, userToken, expirationDate);
    console.log(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.autoLogout(3600 * 1000);
    this.user.next(userData);
    this.router.navigate(['/']);
  }

}

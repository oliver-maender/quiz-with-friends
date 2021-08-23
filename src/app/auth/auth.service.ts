import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { take } from 'rxjs/operators';

import { User } from '../shared/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private auth: AngularFireAuth, private router: Router) { }

  login(email: string, password: string) {
    return this.auth.signInWithEmailAndPassword(email, password).then((resData) => {
      this.handleAuthentication(resData.user.email, resData.user.uid);
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

  signup(email: string, password: string) {
    return this.auth.createUserWithEmailAndPassword(email, password).then((resData) => {
      this.handleAuthentication(resData.user.email, resData.user.uid);
      return resData;
    }).catch((error) => {
      let errorMessage = 'An unknown error occured.';
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email already exists.';
      }
      throw errorMessage;
    });
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['/get-started']);
    localStorage.removeItem('userData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

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

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  async handleAuthentication(email: string, uid: string) {
    const userToken = (await (await this.auth.currentUser)?.getIdToken(true)).toString();
    console.log(userToken);
    const expirationDate = new Date(new Date().getTime() + 3600 * 1000);
    const userData = new User(email, uid, userToken, expirationDate);
    console.log(userData);
    localStorage.setItem('userData', JSON.stringify(userData));
    this.autoLogout(3600 * 1000);
    this.user.next(userData);
    this.router.navigate(['/']);
  }

}

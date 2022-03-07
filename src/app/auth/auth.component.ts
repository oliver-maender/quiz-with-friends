import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { catchError, take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.css']
})
export class AuthComponent implements OnInit {

  loginMode = true;
  loading = false;
  error = '';

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  /**
   * Checking the submitted user data and trying to login or signup the user.
   *
   * @param {NgForm} myForm - The form containing the login data submitted by the user
   */
  onSubmit(myForm: NgForm) {
    if (myForm.valid) {
      this.loading = true;
      this.error = '';
      if (this.loginMode) {
        this.authService.login(myForm.value.email, myForm.value.password).then((resData) => {
          console.log(resData);
          this.loading = false;
        }).catch((errorMessage) => {
          this.error = errorMessage;
          this.loading = false;
        });
      } else {
        this.authService.error.pipe(take(1)).subscribe((errorMessage) => {
          this.error = errorMessage;
        });
        this.authService.signup(myForm.value.username, myForm.value.email, myForm.value.password).pipe(take(1)).subscribe((resData) => {
          console.log(resData);
          this.loading = false;
        });
      }
    }
    myForm.reset();
  }

  /**
   * Switches between login and signup mode.
   */
  onSwitchMode() {
    this.loginMode = !this.loginMode;
    this.error = '';
  }

}

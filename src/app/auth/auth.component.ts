import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
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
        this.authService.signup(myForm.value.email, myForm.value.password).then((resData) => {
          console.log(resData);
          this.loading = false;
        }).catch((errorMessage) => {
          this.error = errorMessage;
          this.loading = false;
        });
      }
    }
    myForm.reset();
  }

  onSwitchMode() {
    this.loginMode = !this.loginMode;
    this.error = '';
  }

}

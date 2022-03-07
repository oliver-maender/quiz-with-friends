import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

  authenticated = false;
  username = '';

  authSubscription: Subscription;

  constructor(private authService: AuthService, private router: Router) { }

  /**
   * Checks for a logged in user and saves his username.
   */
  ngOnInit(): void {
    this.authSubscription = this.authService.user.subscribe((user) => {
      if (user) {
        this.authenticated = true;
        this.username = user.username;
      } else {
        this.authenticated = false;
        this.username = '';
      }
    });
  }

  /**
   * Controls the login/signup/logout button.
   */
  onAuthButton() {
    if (this.authenticated) {
      this.authService.logout();
    } else {
      this.router.navigate(['/auth']);
    }
  }

  /**
   * Unsubscribes to the authentication subscription.
   */
  ngOnDestroy(): void {
    this.authSubscription.unsubscribe();
  }

}

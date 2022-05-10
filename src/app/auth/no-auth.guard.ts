import { Injectable } from "@angular/core";
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from "@angular/router";
import { Observable } from "rxjs";
import { map, take } from "rxjs/operators";
import { AuthService } from "./auth.service";

@Injectable({ providedIn: 'root' })
export class NoAuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) { }

   /**
   * Checks if a user is allowed to access the route, if yes allows it and if no gets relocated to the start page.
   *
   * @param route
   * @param state
   * @returns {UrlTree | boolean} - The URL to go to or true
   */
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
    return this.authService.user.pipe(take(1), map((user) => {
      const isAuth = !!user;

      if (!isAuth) {
        return true;
      }
      return this.router.createUrlTree(['/']);
    }));
  }

}

import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services/http/authentication.service';
import { NotificationService } from '../services/util/notification.service';
import { User } from '../models/User';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  canActivate(next: ActivatedRouteSnapshot,
              state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    if (this.authenticationService.isLoggedIn()) {
      return true;
    } else {
      // If user is not logged in
      this.notificationService.show('You are not authorized to view this page.');
      this.router.navigate(['/login']);
      return false;
    }
  }
}

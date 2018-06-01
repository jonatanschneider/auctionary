import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { AuthenticationService } from '../services/http/authentication.service';
import { NotificationService } from '../services/util/notification.service';
import { Router } from '@angular/router';
import 'rxjs-compat/add/operator/do';

const AUTH_HEADER_KEY = 'Auctionary-User-Id';

export class AuthenticationInterceptor implements HttpInterceptor {

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.authenticationService.isLoggedIn()) {
      const token = this.authenticationService.getUserId();
      const cloned = req.clone({
        headers: req.headers.set(AUTH_HEADER_KEY, token)
      });

      return next.handle(cloned).do((event: HttpEvent<any>) => {
        if (event instanceof HttpResponse) {
          // Intercept response here (if needed)
        }
      }, (error: any) => {
        if (error instanceof HttpErrorResponse) {
          // Catch http rejection errors
          if (error.status === 401) {
            this.notificationService.show('You are not logged in');
            this.router.navigate(['login']);
          }
        }
      });
    } else {
      return next.handle(req);
    }
  }
}

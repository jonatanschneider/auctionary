import { Injectable } from '@angular/core';
import { NotificationService } from '../util/notification.service';
import { User } from '../../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import 'rxjs-compat/add/operator/map';
import 'rxjs-compat/add/operator/catch';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user: User;

  private apiUrl = {
    base: 'https://localhost:8443/api',
    user: '/user/'
  };
  private httpOptions = {
    headers: new HttpHeaders({})
  };

  constructor(private notificationService: NotificationService,
              private http: HttpClient) {
  }

  login(): Observable<boolean> {
    const connectionUrl: string = this.apiUrl.base + this.apiUrl.user;

    return this.http.get<User>(connectionUrl, this.httpOptions)
      .map(user => {
        this.user = user;
        return true;
      })
      .catch(() => {
        return of(false);
      });
  }

  logout(): Observable<boolean> {
    return of(true)
  }
}

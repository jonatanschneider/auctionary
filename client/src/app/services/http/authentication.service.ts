import { Injectable } from '@angular/core';
import { NotificationService } from '../util/notification.service';
import { User } from '../../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import 'rxjs-compat/add/operator/map';
import 'rxjs-compat/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  user: BehaviorSubject<User>;

  private apiUrl = {
    base: 'https://localhost:8443/api',
    user: '/user'
  };
  private httpOptions = {
    headers: new HttpHeaders({})
  };

  constructor(private notificationService: NotificationService,
              private http: HttpClient) {
    if (window.localStorage.getItem('user')) {
      this.user = new BehaviorSubject<User>(new User());
    } else {
      this.user = new BehaviorSubject<User>(undefined);
    }
  }

  login(userId: string): Observable<boolean> {
    const connectionUrl: string = this.apiUrl.base + this.apiUrl.user + '/' + userId;

    return this.http.get<User>(connectionUrl, this.httpOptions)
      .map(user => {
        this.user.next(user);
        return true;
      })
      .catch(() => {
        return of(false);
      });
  }

  logout(): Observable<boolean> {
    this.user.next(undefined);
    return of(true);
  }

  getUserId(): string {
    const user = this.user.getValue();
    if (user) {
      return user.id;
    }
    return undefined;
  }

  get watchUser(): Observable<User> {
    return this.user.asObservable();
  }
}

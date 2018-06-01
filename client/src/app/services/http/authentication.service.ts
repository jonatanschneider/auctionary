import { Injectable } from '@angular/core';
import { NotificationService } from '../util/notification.service';
import { User } from '../../models/User';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { of } from 'rxjs/internal/observable/of';
import 'rxjs-compat/add/operator/map';
import 'rxjs-compat/add/operator/catch';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { DataStoreService } from '../util/data-store.service';

const AUTH_HEADER_KEY = 'Auctionary-User-Id';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private user: BehaviorSubject<User>;

  private apiUrl = {
    base: 'https://localhost:8443/api',
    user: '/user'
  };
  private httpOptions = {
    headers: new HttpHeaders({})
  };

  constructor(private dataStoreService: DataStoreService,
              private http: HttpClient) {
    this.user = new BehaviorSubject<User>(undefined);
    if (this.dataStoreService.has(AUTH_HEADER_KEY)) {
      this.login(this.dataStoreService.get(AUTH_HEADER_KEY));
    }
  }

  login(userId: string): Observable<boolean> {
    const connectionUrl: string = this.apiUrl.base + this.apiUrl.user + '/' + userId;

    return this.http.get<User>(connectionUrl, this.httpOptions)
      .map(user => {
        this.user.next(user);
        this.dataStoreService.set(AUTH_HEADER_KEY, JSON.stringify(user));
        return true;
      })
      .catch((err) => {
        console.log(err);
        if (this.dataStoreService.has(AUTH_HEADER_KEY)) {
          this.dataStoreService.remove(AUTH_HEADER_KEY);
        }
        return of(false);
      });
  }

  logout(): Observable<boolean> {
    this.user.next(undefined);
    if (this.dataStoreService.has(AUTH_HEADER_KEY)) {
      this.dataStoreService.remove(AUTH_HEADER_KEY);
    }
    return of(true);
  }

  getUser(): User {
    return this.user.getValue();
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

  isLoggedIn(): boolean {
    if(this.dataStoreService.has(AUTH_HEADER_KEY)) {
      if(!this.user.getValue()) {
        this.user.next(JSON.parse(this.dataStoreService.get(AUTH_HEADER_KEY)));
      }
    }
    return this.dataStoreService.has(AUTH_HEADER_KEY);
  }
}

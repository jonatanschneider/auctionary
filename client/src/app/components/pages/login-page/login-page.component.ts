import { Component, OnInit } from '@angular/core';
import { LoginProvider } from '../../../models/LoginProvider';
import { NotificationService } from '../../../services/util/notification.service';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  LoginProvider = LoginProvider;

  loginSuccessful: boolean;

  constructor(private notificationService: NotificationService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute) { }

  ngOnInit() {
    // Pre-load data from route (whether it is called from '/login' or '/profile'
    this.route.data
      .subscribe((data: {loginSuccessful: boolean}) => {
        this.loginSuccessful = data.loginSuccessful;
      });

    if (this.loginSuccessful) {
      this.authenticationService.login().map(loggedIn => {
        if(loggedIn) {
          this.notificationService.show('Welcome ' /* ToDo: Add + this.authenticationService.getUsername*/);
          // ToDo: Add redirect
        } else {
          this.notificationService.show('Login failed, please try again');
        }
      });
    } else {
      this.notificationService.show('Please log in first');
    }
  }

  login(method: LoginProvider) {
    switch (method) {
      // ToDo: Add support for more login methods
      case LoginProvider.GOOGLE:
        document.location.href = '/auth/google';
        break;
      default:
        this.notificationService.show('Login method not supported');
    }
  }
}
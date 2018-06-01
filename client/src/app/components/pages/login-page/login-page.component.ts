import { Component, OnInit } from '@angular/core';
import { LoginProvider } from '../../../models/LoginProvider';
import { NotificationService } from '../../../services/util/notification.service';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  LoginProvider = LoginProvider;

  constructor(private notificationService: NotificationService,
              private authenticationService: AuthenticationService,
              private route: ActivatedRoute,
              private router: Router) {
  }

  ngOnInit() {
    let userId: string = this.route.snapshot.paramMap.get('userId');

    if (userId) {
      this.authenticationService.login(userId)
        .subscribe(loggedIn => {
          if (loggedIn) {
            this.notificationService.show('Welcome ' + this.authenticationService.getUser().name);
            this.router.navigate(['dashboard']);
          } else {
            this.notificationService.show('Login failed, please try again');
          }
        });
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

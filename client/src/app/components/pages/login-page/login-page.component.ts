import { Component, OnInit } from '@angular/core';
import { LoginProvider } from '../../../models/LoginProvider';
import { NotificationService } from '../../../services/util/notification.service';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss']
})
export class LoginPageComponent implements OnInit {
  LoginProvider = LoginProvider;

  constructor(private notificationService: NotificationService) { }

  ngOnInit() {
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

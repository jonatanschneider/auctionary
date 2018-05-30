import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/http/authentication.service";
import {NotificationService} from "../../../services/util/notification.service";
import {Router} from "@angular/router";
import {LoginProvider} from "../../../models/LoginProvider";
import {User} from "../../../models/User";

@Component({
  selector: 'app-logout-page',
  templateUrl: './log-button.component.html',
  styleUrls: ['./log-button.component.scss']
})
export class LogButtonComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) { }

  ngOnInit() {
  }

  isLoggedIn(): boolean {
    return this.authenticationService.user != undefined
  }

  logout() {
    let user: User = this.authenticationService.user;
    if(user) {
      //TODO check if logout can be generified, if yes: remove switch
      let method: LoginProvider = user.login.type;

      switch(method) {
        case LoginProvider.GOOGLE:
          this.authenticationService.logout().subscribe(() => {
            this.notificationService.show("Successfully logged out");
            //document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=https://localhost:8443/"
            this.authenticationService.user = undefined;
            this.router.navigateByUrl('/')
          });
          break;

        default:
          this.notificationService.show('Login method not supported');
      }
    } else {
      this.notificationService.show('You are logged out already');
    }
  }

  login() {
    this.router.navigateByUrl('/login');
  }
}

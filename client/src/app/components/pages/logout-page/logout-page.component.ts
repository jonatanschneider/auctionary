import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/http/authentication.service";
import {NotificationService} from "../../../services/util/notification.service";
import {Router} from "@angular/router";
import {LoginProvider} from "../../../models/LoginProvider";

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout-page.component.html',
  styleUrls: ['./logout-page.component.scss']
})
export class LogoutPageComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService) { }

  ngOnInit() {
  }

  logout() {
    //let method: LoginProvider = this.authenticationService.user.login.type; //TODO: Fix and use this (user undefined)
    let method: LoginProvider = LoginProvider.GOOGLE;

    switch(method) {
      case LoginProvider.GOOGLE:
          this.authenticationService.logout().subscribe(() => {
              this.notificationService.show("Successfully logged out");
              document.location.href = "https://www.google.com/accounts/Logout?continue=https://appengine.google.com/_ah/logout?continue=https://localhost:8443/"
          });
          break;

      default:
        this.notificationService.show('Login method not supported');
    }
  }
}

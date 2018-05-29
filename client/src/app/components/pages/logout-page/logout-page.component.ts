import { Component, OnInit } from '@angular/core';
import {AuthenticationService} from "../../../services/http/authentication.service";
import {NotificationService} from "../../../services/util/notification.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-logout-page',
  templateUrl: './logout-page.component.html',
  styleUrls: ['./logout-page.component.scss']
})
export class LogoutPageComponent implements OnInit {

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) { }

  ngOnInit() {
  }

  logout() {
    this.authenticationService.logout().subscribe(() => {
      this.notificationService.show("Successfully logged out");
      this.router.navigate(['/']);
    });
  }
}

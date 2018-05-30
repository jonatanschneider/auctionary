import {Component, OnInit} from '@angular/core';
import {AuthenticationService} from '../../../services/http/authentication.service';
import {NotificationService} from '../../../services/util/notification.service';
import {Router} from '@angular/router';
import {User} from '../../../models/User';

@Component({
  selector: 'app-log-button',
  templateUrl: './log-button.component.html',
  styleUrls: ['./log-button.component.scss']
})
export class LogButtonComponent implements OnInit {
  user: User;

  constructor(private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  ngOnInit() {
    this.authenticationService.watchUser.subscribe(user => {
      this.user = user;
    });
  }

  logout() {
    if (this.user) {
      this.authenticationService.logout().subscribe(() => {
        this.notificationService.show('Successfully logged out');
        this.router.navigateByUrl('/');
      });
    } else {
      this.notificationService.show('You are logged out already');
    }
  }
}

import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Auction } from '../../../models/Auction';
import { NotificationService } from '../../../services/util/notification.service';
import { AuctionService } from '../../../services/http/auction.service';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auction-create-page',
  templateUrl: './auction-create-page.component.html',
  styleUrls: ['./auction-create-page.component.scss']
})
export class AuctionCreatePageComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    startingPrice: new FormControl('', [Validators.required]),
    description: new FormControl(''),
    color: new FormControl(''),
    uptime: new FormControl('', [Validators.required]),
  });

  config = {
    uptimeOptions: [
      { label: '1 day', value: 1 },
      { label: '3 days', value: 3 },
      { label: '1 week', value: 7 },
      { label: '2 weeks', value: 14 },
    ]
  };

  constructor(private auctionService: AuctionService,
              private authenticationService: AuthenticationService,
              private notificationService: NotificationService,
              private router: Router) {
  }

  create() {
    let sellerId: string = this.authenticationService.getUserId();
    this.notificationService.show(sellerId);
    if (this.form.invalid) {
      this.notificationService.show('Please check your input.');
      return;
    }

    const endTime: Date = new Date();
    endTime.setDate(endTime.getDate() + this.form.get('uptime').value);

    this.auctionService.addAuction({
      name: this.form.get('name').value,
      startingPrice: this.form.get('startingPrice').value,
      description: this.form.get('description').value,
      color: this.form.get('color').value,
      endTime: endTime,
      sellerId: sellerId
    } as Auction).subscribe((auction) => {
      if (auction) {
        this.notificationService.show('The auction has been created! ' + auction.id);
        this.router.navigateByUrl('/auctions/' + auction.id);
      }
    });
  }
}

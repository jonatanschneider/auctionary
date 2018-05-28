import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { Auction } from "../../../models/Auction";
import { NotificationService } from "../../../services/util/notification.service";
import { AuctionService } from "../../../services/http/auction.service";

@Component({
  selector: 'app-auction-create-page',
  templateUrl: './auction-create-page.component.html',
  styleUrls: ['./auction-create-page.component.scss']
})
export class AuctionCreatePageComponent {
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    startingPrice: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    color: new FormControl('', [Validators.required]),
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
              private notificationService: NotificationService) {
  }

  create() {
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
    } as Auction).subscribe(() => {
      this.notificationService.show('The auction has been created!');
      // TODO: navigate
    });
  }
}

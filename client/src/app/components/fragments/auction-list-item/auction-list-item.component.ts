import { Component, Input, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { User } from '../../../models/User';

@Component({
  selector: 'app-auction-list-item',
  templateUrl: './auction-list-item.component.html',
  styleUrls: ['./auction-list-item.component.scss']
})
export class AuctionListItemComponent implements OnInit {

  user: User;
  @Input()
  auction: any;
  hasHighestBid = false;

  constructor(private authenticationService: AuthenticationService) { }

  ngOnInit() {
    this.authenticationService.watchUser.subscribe((user: User) => {
      this.user = user;
      if (this.auction.bids) {
        if (this.auction.bids[this.auction.bids.length - 1].userId === this.user.id) {
          this.hasHighestBid = true;
        }
      } else {
        if (this.auction.currentBid.userId === this.user.id) {
          this.hasHighestBid = true;
        }
      }
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { AuctionService } from '../../../services/http/auction.service';
import { User } from '../../../models/User';
import { Auction } from '../../../models/Auction';

@Component({
  selector: 'app-dashboard-page',
  templateUrl: './dashboard-page.component.html',
  styleUrls: ['./dashboard-page.component.scss']
})
export class DashboardPageComponent implements OnInit {
  user: User;
  myAuctions: Auction[] = [];
  bidAuctions: Auction[] = [];

  constructor(private authenticationService: AuthenticationService,
              private auctionService: AuctionService) {
  }

  ngOnInit() {
    // Fetch user
    this.authenticationService.watchUser.subscribe((user:User) => {
      this.user = user;
    });

    // Fetch user's auctions
    this.auctionService.getMyAuctions()
      .subscribe((myAuctions: Auction[]) => {
        this.myAuctions = myAuctions;
      });

    // Fetch user's auctions he bid on
    this.auctionService.getMyBidAuctions()
      .subscribe((bidAuctions: Auction[]) => {
        this.bidAuctions = bidAuctions;
      });
  }
}

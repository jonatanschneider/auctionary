import { Component, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})
export class AuctionDetailsComponent implements OnInit {
  public auction: Auction;
  private auctionID: string;
  constructor() {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.auctionID = params['id'];
      if (id !== null) {
        this.auction = auctionService.getAuction(auctionID);
      }
    });


  }

}

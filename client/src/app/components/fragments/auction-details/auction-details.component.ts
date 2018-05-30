import { Component, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';
import { AuctionService } from '../../../services/auction/auction.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})
export class AuctionDetailsComponent implements OnInit {
  public auction: Auction;
  private auctionID: string;

  constructor(private route: ActivatedRoute, public auctionService: AuctionService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      this.auctionID = params['id'];
      if (this.auctionID !== undefined) {
        this.auctionService.getAuction(this.auctionID)
          .subscribe(auction => {
            if (auction) {
              this.auction = auction;
            }
          });
      }
    });


  }

}

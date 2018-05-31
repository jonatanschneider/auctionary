import { Component, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '../../../services/http/auction.service';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})
export class AuctionDetailsComponent implements OnInit {
  auction: Auction;

  constructor(private route: ActivatedRoute, public auctionService: AuctionService) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if(params['id']) {
        this.getAuction(params['id']);
      }
    });
  }

  getAuction(auctionId: string): void {
    this.auctionService.getAuction(auctionId)
      .subscribe((auction: Auction) => {
        this.auction = auction;
      });
  }

}

import { Component, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';
import { AuctionService } from '../../../services/http/auction.service';

@Component({
  selector: 'app-auction-list-page',
  templateUrl: './auction-list-page.component.html',
  styleUrls: ['./auction-list-page.component.scss']
})
export class AuctionListPageComponent implements OnInit {
  auctions: Auction[];

  constructor(private auctionService: AuctionService) { }

  ngOnInit() {
    this.auctionService.getAuctions().subscribe((auctions: Auction[]) => {
      this.auctions = auctions;
    });
  }

}

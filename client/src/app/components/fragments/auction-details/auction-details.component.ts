import { Component, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';
import { ActivatedRoute } from '@angular/router';
import { AuctionService } from '../../../services/http/auction.service';
import {MatDialog} from '@angular/material';
import {BidDialogComponent} from '../bid-dialog/bid-dialog.component';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})
export class AuctionDetailsComponent implements OnInit {
  auction: Auction;
  newBid: string;
  constructor(private route: ActivatedRoute, public auctionService: AuctionService,
              public dialog: MatDialog) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.getAuction(params['id']);
      }
    });
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(BidDialogComponent, {
      width: '250px',
      data: { auction: this.auction }
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.newBid.price = result;
      this.newBid.userId = this.authenticationService.getUserId();
      this.newBid.time = new Date();
      console.log(this.newBid);
      // TODO: bid handling
    });
  }

  getAuction(auctionId: string): void {
    this.auctionService.getAuction(auctionId)
      .subscribe((auction: Auction) => {
        this.auction = auction;
      });
  }

}

import { Component, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import { AuctionService } from '../../../services/http/auction.service';
import { MatDialog } from '@angular/material';
import { BidDialogComponent } from '../../dialogs/bid-dialog/bid-dialog.component';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { Location } from '@angular/common';
import {User} from "../../../models/User";

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})
export class AuctionDetailsComponent implements OnInit {
  auction: Auction;
  user: User;

  constructor(private route: ActivatedRoute,
              private auctionService: AuctionService,
              private authenticationService: AuthenticationService,
              private dialog: MatDialog,
              private location: Location) {
  }

  ngOnInit() {
    this.route.params.subscribe((params: any) => {
      if (params['id']) {
        this.getAuction(params['id']);
      }
    });

    this.authenticationService.watchUser.subscribe((user: User) => {
      this.user = user;
    });
  }

  checkForOpenDialog(): void {
    this.route.data.subscribe((data: any) => {
      if (data.dialog === true && this.auction) {
        this.openDialog();
      }
    });
  }

  openDialog(): void {
    this.location.go('auctions/' + this.auction.id + '/bid');
    const dialogRef = this.dialog.open(BidDialogComponent, {
      width: '250px',
      data: { auction: this.auction }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.location.go('/auctions/' + this.auction.id);
      if (result !== undefined) {
        this.auctionService.createBid(this.auction.id, this.authenticationService.getUserId(), result)
          .subscribe(() => {
            this.getAuction(this.auction.id);
          });
      }
    });
  }

  getAuction(auctionId: string): void {
    this.auctionService.getAuction(auctionId)
      .subscribe((auction: Auction) => {
        this.auction = auction;
        this.checkForOpenDialog();
      });
  }

}

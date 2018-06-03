import { Component, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';
import {ActivatedRoute, UrlSegment} from '@angular/router';
import { AuctionService } from '../../../services/http/auction.service';
import { MatDialog } from '@angular/material';
import { BidDialogComponent } from '../../dialogs/bid-dialog/bid-dialog.component';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { Location } from '@angular/common';
import { User } from '../../../models/User';
import { SocketService } from '../../../services/socket/socket.service';

@Component({
  selector: 'app-auction-details',
  templateUrl: './auction-details.component.html',
  styleUrls: ['./auction-details.component.scss']
})
export class AuctionDetailsComponent implements OnInit {
  auction: Auction;
  user: User;
  remainingTime: Date;

  constructor(private route: ActivatedRoute,
              private auctionService: AuctionService,
              private authenticationService: AuthenticationService,
              private dialog: MatDialog,
              private location: Location,
              private socketService: SocketService) {
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

    setInterval( () => {
      if (this.remainingTime && this.remainingTime.getSeconds() > 0) {
        this.remainingTime.setSeconds(this.remainingTime.getSeconds() - 1);
      }
    }, 1000);

    this.socketConnection();
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
            this.socketService.sendBid(this.auction.id);
          });
      }
    });
  }

  getAuction(auctionId: string): void {
    this.auctionService.getAuction(auctionId)
      .subscribe((auction: Auction) => {
        this.auction = auction;
        this.checkForOpenDialog();
        this.remainingTime = new Date(Date.parse(auction.endTime.toString()) - Date.now());
      });
  }

  socketConnection() {
    this.socketService.initSocket();
    this.socketService.onBid()
      .subscribe((data) => {
        if (data.auctionID === this.auction.id) {
          this.getAuction(this.auction.id);
        }
      });
  }

  getRemainder(): String {
    let seconds = Math.floor(this.remainingTime.getTime() / 1000);
    console.log(seconds);
    let output: String = '';

    if (seconds >= (7 * 24 * 60 * 60)) {
      output += Math.floor(seconds / (7 * 24 * 60 * 60)) + ' weeks, ';
      seconds = seconds % (7 * 24 * 60 * 60);
    }
    if (seconds >= (24 * 60 * 60)) {
      output += Math.floor(seconds / (24 * 60 * 60)) + ' days, ';
      seconds = seconds % (24 * 60 * 60);
    }
    output +=  Math.floor(seconds / (60 * 60)) + ':';
    seconds = seconds % (60 * 60);
    output +=  Math.floor(seconds / 60) + ':';
    seconds = seconds % 60;
    output +=  Math.floor(seconds) + ' left';

    return output;
  }
}

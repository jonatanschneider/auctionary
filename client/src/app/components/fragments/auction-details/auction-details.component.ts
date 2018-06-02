import { Component, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';
import { ActivatedRoute, Router } from '@angular/router';
import { AuctionService } from '../../../services/http/auction.service';
import { MatDialog } from '@angular/material';
import { BidDialogComponent } from '../../dialogs/bid-dialog/bid-dialog.component';
import { AuthenticationService } from '../../../services/http/authentication.service';
import { Location } from '@angular/common';
import { User } from '../../../models/User';
import { SocketService } from '../../../services/socket/socket.service';
import { EditDialogComponent } from '../../dialogs/edit-dialog/edit-dialog.component';
import { NotificationService } from '../../../services/util/notification.service';
import { DeleteDialogComponent } from '../../dialogs/delete-dialog/delete-dialog.component';

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
              private location: Location,
              private socketService: SocketService,
              private notificationService: NotificationService,
              private router: Router) {
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

    this.socketConnection();
  }

  checkForOpenDialog(): void {
    this.route.data.subscribe((data: any) => {
      if (!this.auction) {
        return;
      }
      if (data.dialog) {
        switch (data.dialog) {
          case 'bid':
            this.openBidDialog();
            break;
          case 'edit':
            this.openEditDialog();
            break;
          case 'delete':
            this.openDeleteDialog();
            break;
          default:
            return;
        }
      }
    });
  }

  openBidDialog(): void {
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

  openEditDialog(): void {
    this.location.go('auctions/' + this.auction.id + '/edit');
    const dialogRef = this.dialog.open(EditDialogComponent, {
      width: '400px',
      data: { auction: this.auction }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.location.go('auctions/' + this.auction.id);
      if (result !== undefined) {
        this.auctionService.editAuction(result)
          .subscribe(() => {
            this.getAuction(this.auction.id);
          });
      }
    });
  }

  openDeleteDialog(): void {
    this.location.go('auctions/' + this.auction.id + '/delete');
    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.auctionService.deleteAuction(this.auction.id)
          .subscribe(() => {
            this.notificationService.show('Successfully deleted auction ');
            this.router.navigate(['auctions']);
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

  socketConnection() {
    this.socketService.initSocket();
    this.socketService.onBid()
      .subscribe((data) => {
        if (data.auctionID === this.auction.id) {
          this.getAuction(this.auction.id);
        }
      });
  }
}

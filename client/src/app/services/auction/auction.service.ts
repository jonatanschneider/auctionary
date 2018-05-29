import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Auction } from '../../models/Auction';
import {NotificationService} from "../util/notification.service";

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  auction: Auction;

  private apiUrl = {
    base: 'https://localhost:8443/api',
    auction: '/auctions'
  };

  constructor(private http: HttpClient, private notificationService: NotificationService) {
  }

  getAuction(id: string): Observable<Auction> {
    const connectionUrl: string = this.apiUrl.base + this.apiUrl.auction + '/' + id;
    return this.http.get<Auction>(connectionUrl, {observe: 'response'})
      .map(result => {
        /* TODO: in error case, show notification
        this.notificationService.show(result.statusText);
        */
        return result.body['auction'];
      });
  }
}

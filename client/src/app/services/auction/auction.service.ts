import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Auction } from '../../models/Auction';

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  auction: Auction;

  private apiUrl = {
    base: 'https://localhost:8443/api',
    auction: '/auctions'
  };

  constructor(private http: HttpClient) {
  }

  getAuction(id: string): Observable<Auction> {
    const connectionUrl: string = this.apiUrl.base + this.apiUrl.auction + '/' + id;
    return this.http.get<Auction>(connectionUrl, {observe: 'response'})
      .map(result => {
        return result.body['auction'];
      });
  }
}

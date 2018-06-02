import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { Auction } from '../../models/Auction';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs/internal/observable/of';
import { NotificationService } from '../util/notification.service';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class AuctionService {
  private apiUrl = {
    base: 'https://localhost:8443/api',
    auctions: '/auctions',
    bid: '/bid',
    new: '/new',
    me: '/me',
    ownAuctions: '/my-auctions',
    bidAuctions: '/bid-auctions'
  };

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService) {
  }

  addAuction(auction: Auction): Observable<Auction> {
    let connectionUrl: string = this.apiUrl.base + this.apiUrl.auctions;

    return this.http.post<Auction>(connectionUrl, auction, httpOptions)
      .pipe(
        catchError(this.handleError<Auction>('addAuction'))
      );
  }

  getAuction(id: string): Observable<Auction> {
    let connectionUrl: string = this.apiUrl.base + this.apiUrl.auctions + '/' + id;
    return this.http.get<Auction>(connectionUrl, httpOptions)
      .pipe(
        catchError(this.handleError<Auction>('getAuction'))
      );
  }

  getAuctions(): Observable<Auction[]> {
    let connectionUrl: string = this.apiUrl.base + this.apiUrl.auctions;
    return this.http.get<Auction[]>(connectionUrl, httpOptions)
      .pipe(
        catchError(this.handleError<Auction[]>('getAuctions'))
      );
  }

  /**
   * Get auctions the user created
   *
   * @returns {Observable<Auction[]>}
   */
  getMyAuctions(): Observable<Auction[]> {
    let connectionUrl: string = this.apiUrl.base + this.apiUrl.me + this.apiUrl.ownAuctions;
    return this.http.get<Auction[]>(connectionUrl, httpOptions)
      .pipe(
        catchError(this.handleError<Auction[]>('getMyAuctions'))
      );
  }

  /**
   * Get auctions the user bid on
   *
   * @returns {Observable<Auction[]>}
   */
  getMyBidAuctions(): Observable<Auction[]> {
    let connectionUrl: string = this.apiUrl.base + this.apiUrl.me + this.apiUrl.bidAuctions;
    return this.http.get<Auction[]>(connectionUrl, httpOptions)
      .pipe(
        catchError(this.handleError<Auction[]>('getMyBidAuctions'))
      )
  }

  createBid(id: string, userId: string, bid: string): Observable<Auction> {
    let connectionUrl: string = this.apiUrl.base + this.apiUrl.auctions
      + '/' + id + this.apiUrl.bid;
    let data = {
      userid: userId,
      bid: bid
    };
    return this.http.post<Auction>(connectionUrl, data, httpOptions)
      .pipe(
        catchError(this.handleError<Auction>('createBid'))
      );
  }

  editAuction(auction: Auction): Observable<Auction> {
    let connectionUrl: string = this.apiUrl.base + this.apiUrl.auctions + '/' + auction.id;
    return this.http.put<Auction>(connectionUrl, auction, httpOptions)
      .pipe(
        catchError(this.handleError<Auction>('editAuction'))
      );
  }

  deleteAuction(auctionId: string): Observable<Auction> {
    let connectionUrl: string= this.apiUrl.base + this.apiUrl.auctions + '/' + auctionId;
    return this.http.delete<Auction>(connectionUrl, httpOptions)
      .pipe(
        catchError(this.handleError<Auction>('deleteAuction'))
      );
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      this.log('An error occured.');

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private log(message: string) {
    this.notificationService.show('AuctionService: ' + message);
  }
}

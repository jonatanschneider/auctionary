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
    new: '/new'
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

  createBid(id: string, userId: string, bid: number): Observable<Auction> {
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
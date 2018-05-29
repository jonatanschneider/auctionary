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
  private apiUrl = 'api/auctions';

  constructor(
    private http: HttpClient,
    private notificationService: NotificationService) {
  }

  addAuction(auction: Auction): Observable<Auction> {
    return this.http.post<Auction>(this.apiUrl, auction, httpOptions).pipe(
      catchError(this.handleError<Auction>('addAuction'))
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

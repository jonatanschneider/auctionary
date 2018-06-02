import { Injectable } from '@angular/core';
import { Bid } from '../../models/Bid';
import { Observable } from 'rxjs/internal/Observable';
import * as io from 'socket.io-client';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket;
  private server = 'https://localhost:8443';
  constructor() { }

  public initSocket(): void {
    this.socket = io(this.server);
  }

  public sendBid(auctionID: string) {
    this.socket.emit('newBid', {auctionID: auctionID});
  }

  public onBid(): Observable<any> {
    return new Observable<any>(observer => {
      this.socket.on('newBid', (data) => observer.next(data));
    });
  }
}

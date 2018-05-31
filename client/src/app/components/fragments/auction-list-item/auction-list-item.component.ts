import { Component, Input, OnInit } from '@angular/core';
import { Auction } from '../../../models/Auction';

@Component({
  selector: 'app-auction-list-item',
  templateUrl: './auction-list-item.component.html',
  styleUrls: ['./auction-list-item.component.scss']
})
export class AuctionListItemComponent implements OnInit {

  @Input()
  auction: Auction;

  constructor() { }

  ngOnInit() {
  }

}

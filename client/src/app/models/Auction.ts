import {Bid} from './Bid';

export class Auction {
  id: string;
  seller: string;
  name: string;
  description: string;
  images: string[];
  manufaturer: string;
  color: string;
  startingPrice: number;
  endTime: Date;
  currentBid: Bid;
}

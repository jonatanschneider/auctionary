import { Bid } from './Bid';

export class Auction {
  id: string;
  sellerId: string;
  name: string;
  description: string;
  images: string[];
  manufacturer: string;
  color: string;
  startingPrice: number;
  endTime: Date;
  currentBid: Bid;
}

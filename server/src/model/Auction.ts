import { Bid } from './Bid';

export class Auction {
    _id: string;
    sellerId: string;
    name: string;
    description: string;
    images: string[] = [];
    manufacturerId: string;
    color: string;
    startingPrice: number;
    endTime: Date;
    bids: Bid[];
}

import { Express, Request, Response } from 'express';
import { Collection } from 'mongodb';
import { Auction } from './model/Auction';

export class Auctions {
    static init(router: Express, auctionsCollection: Collection) {
        router.get('/api/auctions', function (req: Request, res: Response) {
            // TODO: Implement database actions
            res.status(200).send({ auctions: [] });
        });
        router.get('/api/auctions/:id', function(req: Request, res: Response) {
            const query: Object = {_id: new ObjectID(id)};
            auctionsCollection.findOne(query)
                .then((auction: Auction) => {
                    if (auction !== null) {
                        message = 'Successfully retrieved auction ' + id;
                        // TODO: maybe wrong Auction type?
                        data = new Auction(
                            auction._id,
                            auction.sellerId,
                            auction.name,
                            auction.description,
                            auction.images,
                            auction.manufacturerId,
                            auction.color,
                            auction.startingPrice,
                            auction.endTime,
                            auction.bids[auction.bids.length - 1]);
                        status = 200;
                    } else {
                        message = 'Id ' + id + 'not found';
                        status = 404;
                    }
                })
                .catch((error: MongoError) => {
                    message = 'Database error ' + error.code;
                    status = 505;
                });
            res.status(200).send({data: [], message: message});
        });
    }
}

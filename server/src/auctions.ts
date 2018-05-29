import { Express, Request, Response } from 'express';
import { Collection, MongoError } from 'mongodb';
import { Auction } from './model/Auction';
import { ObjectID } from 'bson';

export class Auctions {
    static init(router: Express, auctionsCollection: Collection) {
        router.get('/api/auctions', function (req: Request, res: Response) {
            // TODO: Implement database actions
            res.status(200).send({ auctions: [] });
        });
        router.get('/api/auctions/:id', function(req: Request, res: Response) {
            let status: number;
            let message = '';
            const id: string = req.params.id;
            const query: Object = {_id: new ObjectID(id)};
            auctionsCollection.findOne(query)
                .then((auction: Auction) => {
                    if (auction !== null) {
                        auction['id'] = auction['_id'];
                        auction['_id'] = undefined;
                        if (auction.hasOwnProperty('bids') && auction.bids.length > 0) {
                            auction['currentBid'] = auction.bids[auction.bids.length - 1];
                        } else {
                            auction['currentBid'] = undefined;
                        }
                        auction['bids'] = undefined;
                        message = 'Successfully retrieved auction ' + id;
                        status = 200;
                    } else {
                        message = 'Id ' + id + ' not found';
                        status = 404;
                    }
                    res.status(status).send({auction: auction, message: message});
                })
                .catch((error: MongoError) => {
                    message = 'Database error: ' + error;
                    status = 505;
                    res.status(status).send({message: message});
                });
        });
    }
}

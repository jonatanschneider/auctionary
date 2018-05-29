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

            if (!ObjectID.isValid(id)) {
                message = 'Invalid ID format';
                status = 404;
                res.status(status).send({message: message});
                return;
            }

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

        router.post('/api/auctions', function (req: Request, res: Response) {
            const auction = new Auction();
            auction.sellerId = req.body.seller ? req.body.seller.trim() : '';
            auction.name = req.body.name ? req.body.name.trim() : '';
            auction.description = req.body.description ? req.body.description.trim() : '';
            auction.color = req.body.color ? req.body.color.trim() : '';
            auction.startingPrice = req.body.startingPrice ? req.body.startingPrice as number : -1;
            auction.endTime = req.body.endTime ? req.body.endTime as Date : undefined;

            if (!auction.name || !auction.sellerId || auction.startingPrice < 0 || !auction.endTime) {
                res.status(400).send();
                return;
            }

            auctionsCollection.insertOne(auction).then((insertedAuction) => {
                const transformedAuction = insertedAuction.ops[0];
                transformedAuction.id = transformedAuction._id;
                delete transformedAuction._id;
                res.status(201).send(insertedAuction.ops[0]);
            }).catch(() => {
                res.status(500).send();
            });
        });
    }
}

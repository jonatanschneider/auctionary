import { Express, Request, Response } from 'express';
import {
    Collection,
    Db,
    DeleteWriteOpResultObject,
    MongoClient,
    MongoError,
    UpdateWriteOpResult,
} from 'mongodb';
import { Auction } from './model/Auction';
import { ObjectID } from 'bson';
import { Bid } from './model/Bid';

export class Auctions {
    static init(router: Express, auctionsCollection: Collection) {

        /**
         * GET /api/auctions
         *
         * Returns all auctions stored in the database
         */
        router.get('/api/auctions', function (req: Request, res: Response) {
            auctionsCollection.find({}).toArray()
                .then((auctions: Auction[]) => {
                    if (auctions !== null) {
                        for (let auction of auctions) {
                            auction['id'] = auction['_id'];
                            auction['_id'] = undefined;
                            if (auction['bids']) {
                                auction['currentBid'] = auction['bids'][auction.bids.length - 1];
                                auction['bids'] = undefined;
                            }
                        }
                        res.status(200).send(auctions);
                    } else {
                        res.status(200).send([]);
                    }
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Failed to fetch auctions from database', error);
                    res.status(505).send();
                });
        });

        /**
         * GET /api/auctions/:id
         *
         * Returns the auction requested by its id
         */
        router.get('/api/auctions/:id', function (req: Request, res: Response) {
            const id: string = req.params.id;

            if (!ObjectID.isValid(id)) {
                res.status(404).send();
                return;
            }

            const query: Object = { _id: new ObjectID(id) };
            auctionsCollection.findOne(query)
                .then((auction: Auction) => {
                    if (auction !== null) {
                        auction['id'] = auction['_id'];
                        auction['_id'] = undefined;
                        if (auction['bids']) {
                            auction['currentBid'] = auction['bids'][auction['bids'].length - 1];
                        }
                        auction['bids'] = undefined;
                    }
                    res.status(200).send(auction);
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Failed to fetch auction from database', error);
                    res.status(505).send();
                });
        });

        /**
         * POST /api/auctions
         *
         * Creates a new auction in the database and returns it to client
         */
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

            auctionsCollection.insertOne(auction)
                .then((insertedAuction) => {
                    const transformedAuction = insertedAuction.ops[0];
                    transformedAuction.id = transformedAuction._id;
                    delete transformedAuction._id;
                    res.status(201).send(insertedAuction.ops[0]);
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Failed to create auction in database', error);
                    res.status(500).send();
                });
        });

        /**
         * PUT /api/auctions/:id
         *
         * Updates the auction selected by its id in the database and returns it to client
         */
        router.put('/api/auctions/:id', function (req: Request, res: Response) {
            const id: string = req.params.id;

            if (!ObjectID.isValid(id)) {
                res.status(404).send();
                return;
            }

            const query: Object = { _id: new ObjectID(id) };
            const set: Object = {
                $set: {
                    name: req.body.name ? req.body.name.trim() : '',
                    description: req.body.description ? req.body.description.trim() : '',
                    color: req.body.color ? req.body.color.trim() : '',
                    startingPrice: req.body.startingPrice ? req.body.startingPrice as number : -1,
                    endTime: req.body.endTime ? req.body.endTime as Date : undefined
                }
            };
            auctionsCollection.updateOne(query, set)
                .then(response => {
                    if (response.matchedCount === 1) {
                        res.status(200).send();
                    } else {
                        res.status(404).send();
                    }
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Failed to update auction in database', error);
                    res.status(505).send();
                });

            res.status(501).send();
        });

        /**
         * DELETE /api/auctions/:id
         *
         * Deletes the auction selected by its id in the database
         */
        router.delete('/api/auctions/:id', function (req: Request, res: Response) {
            const id: string = req.params.id;

            if (!ObjectID.isValid(id)) {
                res.status(404).send();
                return;
            }

            const query: Object = { _id: new ObjectID(id) };
            auctionsCollection.deleteOne(query)
                .then(() => {
                    res.status(200).send();
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Failed to delete auction from database', error);
                    res.send(505).send();
                });
        });

        /**
         * POST /api/auctions/:auctionId/bid
         *
         * Creates a new bid for an auction
         */
        router.post('/api/auctions/:auctionId/bid', function(req: Request, res: Response) {
            const id = req.params.auctionId;
            const userID = req.body.userid ? req.body.userid : '';
            const newBid = req.body.bid ? req.body.bid as number : -1;

            if (userID === '' || newBid === -1 || !ObjectID.isValid(id)) {
                res.status(400).send();
                return;
            }
            // Find auction in database
            const query: Object = {_id: new ObjectID(id)};
            auctionsCollection.findOne(query)
                .then((auction: Auction) => {
                    const bid = new Bid();
                    bid.userId = userID;
                    bid.price = newBid;
                    bid.time = new Date();
                    if (!auction.bids || auction.bids.length === 0) {
                        if (newBid > Number(auction.startingPrice)) {
                            return bid;
                        } else {
                            console.log('[ERR]: Bid is below starting price!');
                            res.status(400).send();
                            return null;
                        }
                    } else if (newBid > Number(auction.bids[auction.bids.length - 1].price)) {
                        return bid;
                    } else {
                        console.log('[ERR]: Bid is too low');
                        res.status(400).send();
                        return null;
                    }
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Failed to fetch auction from database', error);
                    res.status(505).send();
                    return;
                })
                // Update auction
                .then((bids: Bid) => {
                    if (bids) {
                        auctionsCollection.updateOne(query, {$push: { bids }})
                            .then(response => {
                                if (response.matchedCount === 1) {
                                    res.status(200).send();
                                } else {
                                    res.status(404).send();
                                }
                            });
                    }
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Failed to update auction in database', error);
                    res.status(505).send();
                });
        });
    }
}

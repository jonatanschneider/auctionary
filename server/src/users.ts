import { Router } from 'express-serve-static-core';
import { Collection, MongoError } from 'mongodb';
import { ObjectID } from 'bson';
import { Request, Response } from 'express';
import { Auction } from './model/Auction';

const AUTH_HEADER_KEY = 'auctionary-user-id';

export class Users {
    static init(router: Router, usersCollection: Collection, auctionsCollection: Collection) {
        router.get('/api/user/:id', function (req: Request, res: Response) {
            let userId: string = req.params.id;
            let query: Object = {
                _id: new ObjectID(userId)
            };

            usersCollection.findOne(query)
                .then(user => {
                    if (user) {
                        // Map user id
                        user.id = user._id;
                        // Strip unwanted information
                        delete user._id;
                        delete user.auctions;
                        delete user.ownAuctions;

                        res.status(200).send(user);
                    } else {
                        // User could not be found
                        res.status(404).send();
                    }
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Could not find one user ', error);
                    res.status(500).send();
                });
        });

        router.get('/api/me/won-auctions', function(req: Request, res: Response) {
            let userId: string = JSON.parse(req.headers[AUTH_HEADER_KEY].toString()).id;
            let query: Object = {
                _id: new ObjectID(userId)
            };
            let auctionIds: string[] = [];
            let wonAuctions: Auction[] = [];

            // Get all auction ids created by own user
            usersCollection.findOne(query)
                .then(user => {
                    if (user.auctionIds) {
                        for (let auctionId of user.auctionIds) {
                            auctionIds.push(new ObjectID(auctionId));
                        }
                    }
                })
                .then(() => {
                    query = {
                        '_id': {
                            '$in': auctionIds
                        },
                        'endTime': {$lt: new Date().toISOString()}
                    };
                    auctionsCollection.find(query).toArray()
                        .then((bidAuctions: Auction[]) => {
                            for (let auction of bidAuctions) {
                                if (auction.bids[auction.bids.length - 1].userId === userId) {
                                    auction['id'] = auction['_id'];
                                    auction['_id'] = undefined;
                                    wonAuctions.push(auction);
                                }
                            }
                            res.status(200).send(wonAuctions);
                        });
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Could not find one user ', error);
                    res.status(505).send([]);
                });
        });

        router.get('/api/me/lost-auctions', function(req: Request, res: Response) {
            let userId: string = JSON.parse(req.headers[AUTH_HEADER_KEY].toString()).id;
            let query: Object = {
                _id: new ObjectID(userId)
            };
            let auctionIds: string[] = [];
            let lostAuctions: Auction[] = [];

            // Get all auction ids created by own user
            usersCollection.findOne(query)
                .then(user => {
                    if (user.auctionIds) {
                        for (let auctionId of user.auctionIds) {
                            auctionIds.push(new ObjectID(auctionId));
                        }
                    }
                })
                .then(() => {
                    query = {
                        '_id': {
                            '$in': auctionIds
                        },
                        'endTime': {$lt: new Date().toISOString()}
                    };
                    auctionsCollection.find(query).toArray()
                        .then((bidAuctions: Auction[]) => {
                            for (let auction of bidAuctions) {
                                if (auction.bids[auction.bids.length - 1].userId !== userId) {
                                    auction['id'] = auction['_id'];
                                    auction['_id'] = undefined;
                                    lostAuctions.push(auction);
                                }
                            }
                            res.status(200).send(lostAuctions);
                        });
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Could not find one user ', error);
                    res.status(505).send([]);
                });
        });

        /**
         * Get own user data
         */
        router.get('/api/me', function (req: Request, res: Response) {
            let userId: string = JSON.parse(req.headers[AUTH_HEADER_KEY].toString()).id;
            let query: Object = {
                _id: new ObjectID(userId)
            };


            usersCollection.findOne(query)
                .then(user => {
                    if (user) {
                        // Map user id
                        user.id = user._id;
                        // Strip unwanted information
                        delete user._id;
                        delete user.auctions;
                        delete user.ownAuctions;

                        res.status(200).send(user);
                    } else {
                        // User could not be found
                        res.status(404).send();
                    }
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Could not find one user ', error);
                    res.status(500).send();
                });
        });

        /**
         * Get own created auctions
         */
        router.get('/api/me/my-auctions', function (req: Request, res: Response) {
            let userId: string = JSON.parse(req.headers[AUTH_HEADER_KEY].toString()).id;
            let query: Object = {
                _id: new ObjectID(userId)
            };
            let auctionIds: string[] = [];

            // Get all auction ids created by own user
            usersCollection.findOne(query)
                .then(user => {
                    if (user.ownAuctionIds) {
                        for (let auctionId of user.ownAuctionIds) {
                            auctionIds.push(new ObjectID(auctionId));
                        }
                    }
                })
                .then(() => {
                    query = {
                        '_id': {
                            '$in': auctionIds
                        }
                    };
                    auctionsCollection.find(query).toArray()
                        .then((ownAuctions: Auction[]) => {
                            for(let auction of ownAuctions) {
                                auction['id'] = auction['_id'];
                                auction['_id'] = undefined;
                            }
                            res.status(200).send(ownAuctions);
                        });
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Could not finde one user ', error);
                    res.status(505).send([]);
                });
        });

        /**
         * Get auctions the user bid on
         */
        router.get('/api/me/bid-auctions', function (req: Request, res: Response) {
            let userId: string = JSON.parse(req.headers[AUTH_HEADER_KEY].toString()).id;
            let query: Object = {
                _id: new ObjectID(userId)
            };
            let auctionIds: string[] = [];

            // Get all auction ids created by own user
            usersCollection.findOne(query)
                .then(user => {
                    if (user.auctionIds) {
                        for (let auctionId of user.auctionIds) {
                            auctionIds.push(new ObjectID(auctionId));
                        }
                    }
                })
                .then(() => {
                    query = {
                        '_id': {
                            '$in': auctionIds
                        }
                    };
                    auctionsCollection.find(query).toArray()
                        .then((bidAuctions: Auction[]) => {
                            for(let auction of bidAuctions) {
                                auction['id'] = auction['_id'];
                                auction['_id'] = undefined;
                            }
                            res.status(200).send(bidAuctions);
                        });
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Could not finde one user ', error);
                    res.status(505).send([]);
                });
        });
    }
}

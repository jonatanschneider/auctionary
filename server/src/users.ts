import { Router } from 'express-serve-static-core';
import { Collection, MongoError } from 'mongodb';
import { ObjectID } from 'bson';
import { Request, Response } from 'express';
import { Auction } from './model/Auction';

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

        /**
         * Get own user data
         */
        router.get('/api/me', function (req: Request, res: Response) {
            let userId: string = req.headers.me.toString();
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
            let userId: string = req.headers.me.toString();
            let query: Object = {
                _id: new ObjectID(userId)
            };
            let auctionIds: string[] = [];

            // Get all auction ids created by own user
            usersCollection.findOne(query)
                .then(user => {
                    if (user.ownAuctionIds) {
                        console.log('[LOG]: Auction Ids: ', user.ownAuctionIds);
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
                    console.log('[LOG]: Own auctions query: ', query);
                    auctionsCollection.find(query).toArray()
                        .then((ownAuctions: Auction[]) => {
                            res.status(200).send(ownAuctions);
                        });
                })
                .catch((error: MongoError) => {
                    console.log('[ERR]: Could not finde one user ', error);
                    res.status(505).send([]);
                });
        });
    }
}

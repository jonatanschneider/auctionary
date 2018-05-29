import { Router } from 'express-serve-static-core';
import { Collection, MongoError } from 'mongodb';
import { ObjectID } from 'bson';

export class Users {
    static init(router: Router, usersCollection: Collection) {
        router.get('/api/user/:id', function (req, res) {
            let userId: string = req.params.id;
            let query: Object = {
                _id: new ObjectID(userId)
            };

            usersCollection.findOne(query)
                .then(user => {
                    if (user) {
                        // Map user id
                        user['id'] = user['_id'];
                        // Strip unwanted information
                        user['_id'] = undefined;
                        user['auctions'] = undefined;
                        user['own-auctions'] = undefined;

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
    }
}

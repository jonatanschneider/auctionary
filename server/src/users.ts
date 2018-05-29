import { Router } from 'express-serve-static-core';
import { Collection } from 'mongodb';
import { User } from './model/User';

export class Users {
    static init(router: Router, usersCollection: Collection) {
        router.get('/api/user/me', function(req, res) {
            let user: User = new User();

            // ToDo: Fetch UserId from Session
            // ToDo: Fetch User from Database
            // ToDo: Strip unwanted information on user

            res.status(200).send(JSON.stringify(user));
        });
    }
}

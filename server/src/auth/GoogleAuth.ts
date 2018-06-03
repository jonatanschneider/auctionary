import * as pGoogle from 'passport-google-oauth20';
import * as request from 'request-promise';
import { AuthenticationConfig } from './AuthenticationConfig';
import { Express } from 'express';
import { PassportStatic } from 'passport';
import { Collection, MongoError } from 'mongodb';
import { LoginProvider } from '../model/LoginProvider';
import { User } from '../model/User';
import { Login } from '../model/Login';

export class GoogleAuth {

    static init(passport: PassportStatic, authConf: AuthenticationConfig, router: Express, usersCollection: Collection) {
        passport.use(new pGoogle.Strategy({
            clientID: authConf.googleAuth.clientID,
            clientSecret: authConf.googleAuth.clientSecret,
            callbackURL: authConf.googleAuth.callbackURL,
        }, function (req, accessToken, refreshToken, profile, done) {
            const options = {
                method: 'GET',
                uri: 'https://www.googleapis.com/auth/plus.me',
                qs: {
                    access_token: accessToken,
                    fields: 'email, picture, gender, first_name, last_name'
                }
            };
            request(options)
                .then(() => {
                    done(null, profile);
                })
                .catch((err) => {
                    console.log('[ERR]: Could not access Google for login ' + err);
                });
        }));

        router.get('/auth/google',
            passport.authenticate('google', {
                scope: ['profile', 'email']
            })
        );

        router.get('/auth/google/callback',
            passport.authenticate('google', { failureRedirect: '/login' }),
            function (req, res) {
                GoogleAuth.checkUser(req.user, usersCollection)
                    .then(userId => {
                        res.redirect('/profile/' + userId);
                    })
                    .catch(() => {
                        res.redirect('/');
                    })
            });
    }

    static checkUser(user, usersCollection: Collection): Promise<string> {

        let query: Object = {
            'login.type': LoginProvider.GOOGLE,
            'login.id': user.id
        };
        return usersCollection.findOne(query)
            .then((foundUser: User) => {
                if (foundUser) {
                    return foundUser._id;
                } else {
                    return this.persistUser(user, usersCollection);
                }
            })
            .catch((error: MongoError) => {
                console.log('[ERR]: Could not check user', error);
                return '';
            });
    }

    static persistUser(user, usersCollection: Collection): Promise<string> {
        console.log('[LOG]: Persisting user...');
        let insertUser = new User();

        insertUser.name = user.displayName;
        insertUser.firstname = user.name.givenName;
        insertUser.lastname = user.name.familyName;
        insertUser.email = user.emails[0].value;
        insertUser.profilePicture = user.photos[0].value;
        insertUser.login = new Login(user.id, LoginProvider.GOOGLE);

        return usersCollection.insertOne(insertUser)
            .then(insertDocument => {
                return insertDocument.insertedId;
            })
            .catch((error: MongoError) => {
                console.log('[ERR]: Could not persist user', error);
                return null;
            });
    }
}

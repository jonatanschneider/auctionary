import * as pFacebook from 'passport-facebook';
import * as request from 'request-promise';
import { AuthenticationConfig } from './AuthenticationConfig';
import { Express } from 'express';
import { PassportStatic } from 'passport';
import { Collection, MongoError } from 'mongodb';
import { LoginProvider } from '../model/LoginProvider';
import { User } from '../model/User';
import { Login } from '../model/Login';


export class FacebookAuth {


    static init(passport: PassportStatic, authConf: AuthenticationConfig, router: Express, usersCollection: Collection) {;
        passport.use(new pFacebook.Strategy({
            clientID: authConf.facebookAuth.clientID,
            clientSecret: authConf.facebookAuth.clientSecret,
            callbackURL: authConf.facebookAuth.callbackURL,
            passReqToCallback: true
        }, function (req, accessToken, refreshToken, profile, done) {
                const fbAccessToken = accessToken;
                const fbUserId = profile.id;
                // set up parameters of Graph-API request
                const options = {
                    method: 'GET',
                    uri: 'https://graph.facebook.com/v3.0/me',
                    qs: {
                        access_token: accessToken,
                        fields: 'email, picture, gender, first_name, last_name'
                    }
                };
                // request Graph-API
                request(options)
                    .then(fbRes => {
                        const parsedRes = JSON.parse(fbRes);
                        // add some attributes to the user
                        profile.emails = [{value: parsedRes.email}];
                        profile.photos = [{value: parsedRes.picture.data.url}];
                        profile.gender = parsedRes.gender;
                        profile.name.givenName = parsedRes.first_name;
                        profile.name.familyName = parsedRes.last_name;
                        done(null, profile);
                    })
                    .catch((err) => {
                        console.log('Error: ' + err);
                    });
            }
        ));

        router.get('/auth/facebook',
            passport.authenticate('facebook', {
                scope: ['public_profile', 'email']
            })
        );

        router.get('/auth/facebook/callback',
            passport.authenticate('facebook', { failureRedirect: '/login' }),
            function (req, res) {
                FacebookAuth.checkUser(req.user, usersCollection)
                    .then(userId => {
                        res.redirect('/profile/' + userId);
                    })
                    .catch(() => {
                        res.redirect('/');
                    })
            });
    }

    static checkUser(user, usersCollection: Collection): Promise<string> {
        const query: Object = {
            'login.type': LoginProvider.FACEBOOK,
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
                return '';
            });
    }

    static persistUser(user, usersCollection: Collection): Promise<string> {
        let insertUser = new User();

        insertUser.name = user.displayName;
        insertUser.firstname = user.name.givenName;
        insertUser.lastname = user.name.familyName;
        insertUser.email = user.emails[0].value;
        insertUser.profilePicture = user.photos[0].value;
        insertUser.login = new Login(user.id, LoginProvider.FACEBOOK);

        return usersCollection.insertOne(insertUser)
            .then(insertDocument => {
                return insertDocument.insertedId;
            })
            .catch((error: MongoError) => {
                return null;
            });
    }
}
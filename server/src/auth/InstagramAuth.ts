import * as pInstagram from 'passport-instagram';
import * as request from 'request-promise';
import { AuthenticationConfig } from './AuthenticationConfig';
import { Express } from 'express';
import { PassportStatic } from 'passport';
import { Collection, MongoError } from 'mongodb';
import { LoginProvider } from '../model/LoginProvider';
import { User } from '../model/User';
import { Login } from '../model/Login';

export class InstagramAuth {
    static init(passport: PassportStatic, authConf: AuthenticationConfig, router: Express, usersCollection: Collection) {
        passport.use(new pInstagram.Strategy({
            clientID: authConf.instagramAuth.clientID,
            clientSecret: authConf.instagramAuth.clientSecret,
            callbackURL: authConf.instagramAuth.callbackURL,
        }, function (accessToken, refreshToken, profile, done) {
            const options = {
                method: 'GET',
                uri: 'https://api.instagram.com/v1/users/self/',
                qs: {
                    access_token: accessToken
                }
            };
            request(options).then(igRes => {
                const parsedRes = JSON.parse(igRes);
                profile.emails = [{ value: parsedRes.data.email }];
                profile.photos = [{ value: parsedRes.data.profile_picture }];
                profile.gender = parsedRes.gender;
                profile.name.givenName = '';
                profile.name.familyName = parsedRes.data.full_name;
                done(null, profile);
            })
                .catch((err) => {
                    console.log('Error: ' + err);
                });
        }));

        router.get('/auth/instagram', passport.authenticate('instagram', {
                scope: ['basic']
            })
        );

        router.get('/auth/instagram/callback',
            passport.authenticate('instagram', { failureRedirect: '/login' }),
            function (req, res) {
                InstagramAuth.checkUser(req.user, usersCollection)
                    .then(userId => {
                        res.redirect('/profile/' + userId);
                    })
                    .catch(() => {
                        res.redirect('/');
                    });
            });
    }

    static checkUser(user, usersCollection: Collection): Promise<string> {

        const query: Object = {
            'login.type': LoginProvider.INSTAGRAM,
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
        const insertUser = new User();

        insertUser.name = user.displayName;
        insertUser.firstname = user.name.givenName;
        insertUser.lastname = user.name.familyName;
        insertUser.email = user.emails[0].value;
        insertUser.profilePicture = user.photos[0].value;
        insertUser.login = new Login(user.id, LoginProvider.INSTAGRAM);

        return usersCollection.insertOne(insertUser)
            .then(insertDocument => {
                return insertDocument.insertedId;
            })
            .catch((error: MongoError) => {
                return null;
            });
    }
}

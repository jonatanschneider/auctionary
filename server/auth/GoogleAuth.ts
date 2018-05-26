import * as pGoogle from 'passport-google-oauth20';
import * as request from 'request-promise';

export class GoogleAuth {

    static init(passport, authConf, router) {
        passport.use(new pGoogle.Strategy({
            clientID: authConf.googleAuth.clientID,
            clientSecret: authConf.googleAuth.clientSecret,
            callbackURL: authConf.googleAuth.callbackURL,
        }, function(req, accessToken, refreshToken, profile, done) {
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
                    console.log('Error: ' + err);
                });
        }));

        router.get('/auth/google',
            passport.authenticate('google', {
                scope: ['profile', 'email']
            })
        );
        router.get('/auth/google/callback',
            passport.authenticate('google', {
                successRedirect: '/profile',
                failureRedirect: '/'
            })
        );
    }
}

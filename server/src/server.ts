import * as express from 'express';
import * as fs from 'fs';
import * as https from 'https';
import {
    Collection,
    Db,
    DeleteWriteOpResultObject,
    MongoClient,
    MongoError,
    UpdateWriteOpResult,
} from 'mongodb';
import * as passport from 'passport';
import { AuthenticationConfig } from './auth/AuthenticationConfig';
import * as bodyParser from 'body-parser';
import { Profile } from 'passport';
import { GoogleAuth } from './auth/GoogleAuth';
import { Auctions } from './auctions';

// Database variables
let appDb: Db;
let auctionsCollection: Collection;

// Connect to database server
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
    .then((dbClient: MongoClient) => {
        // Select database
        appDb = dbClient.db('auction');
        // Select collection
        auctionsCollection = appDb.collection('auction');
        console.log('Database connection established');
        console.log('Initializing routes');
        initRoutes();
    })
    .catch((err: MongoError) => {
        console.error('Connection to database failed:\n' + err);
    });

// Server constants
const router = express();
const privateKey = fs.readFileSync(__dirname + '/../sslcert/localhost.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/../sslcert/localhost.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Start https server
https.createServer(credentials, router).listen(8443, function () {
    console.log('HTTPS-server started on https://localhost:8443/');
});

// Configure router
router.use(bodyParser.urlencoded({
    extended: true
}));

// Publish dist folder
router.use('/', express.static(__dirname + '/../dist'));

// Authentication
router.use(passport.initialize());
router.use(passport.session());

passport.serializeUser(function (profile: Profile, done) {
    done(null, profile);
});
passport.deserializeUser(function (profile: Profile, done) {
    done(null, profile);
});

const authConf = new AuthenticationConfig();

function initRoutes(): void {
    GoogleAuth.init(passport, authConf, router);
    Auctions.init(router, auctionsCollection);
}

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
import { Profile } from 'passport';
import { GoogleAuth } from './auth/GoogleAuth';
import { Auctions } from './auctions';
import { Users } from './users';
import socket = require('socket.io');
import { InstagramAuth } from './auth/InstagramAuth';

// Server constants
const router = express();
const privateKey = fs.readFileSync(__dirname + '/../sslcert/localhost.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/../sslcert/localhost.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Start https server
const server = https.createServer(credentials, router).listen(8443, function () {
    console.log('HTTPS-server started on https://localhost:8443/');
});

// Configure router
router.use(express.json());
router.use(express.static(__dirname + './../dist'));

// Database variables
let appDb: Db;
let auctionsCollection: Collection;
let usersCollection: Collection;

// Connect to database server
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
    .then((dbClient: MongoClient) => {
        // Select database
        appDb = dbClient.db('auction');
        // Select collection
        auctionsCollection = appDb.collection('auction');
        usersCollection = appDb.collection('user');
        console.log('Database connection established');
        initRoutes();
        console.log('Server initialized');
    })
    .catch((err: MongoError) => {
        console.error('Connection to database failed:\n' + err);
    });

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
    console.log('Initializing routes');
    InstagramAuth.init(passport, authConf, router, usersCollection);
    GoogleAuth.init(passport, authConf, router, usersCollection);
    Auctions.init(router, auctionsCollection);
    Users.init(router, usersCollection);

    // Setup middleware redirection route
    router.use('/*', express.static(__dirname + '/../dist'));
}

const io = socket(server);
io.on('connection', (socket) => {
    socket.on('newBid', function (data) {
        socket.broadcast.emit('newBid', data);
    });
});

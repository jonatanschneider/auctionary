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

// Database variables
let appDb: Db;
let auctionCollection: Collection;

// Connect to database server
MongoClient.connect('mongodb://localhost:27017', { useNewUrlParser: true })
    .then((dbClient: MongoClient) => {
        // Select database
        appDb = dbClient.db('auction');
        // Select collection
        auctionCollection = appDb.collection('auction');
        console.log('Database connection established');
    })
    .catch((err: MongoError) => {
        console.error('Connection to database failed:\n' + err);
    });

// Server constants
const router = express();
const privateKey = fs.readFileSync(__dirname + '/sslcert/localhost.key', 'utf8');
const certificate = fs.readFileSync(__dirname + '/sslcert/localhost.crt', 'utf8');
const credentials = { key: privateKey, cert: certificate };

// Start https server
https.createServer(credentials, router).listen(8443, function() {
    console.log('HTTPS-server started on https://localhost:8443/');
});

// Publish dist folder
router.use('/', express.static(__dirname + '/dist'));

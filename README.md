# Auctionary

This app is a shopping portal. It is build like a regular online shop, but 
prices are not set. You can only buy any item by taking a bid on it. 

## Technology

### Server

We use express as a server which is connected to a MongoDB database containing 
all information on the items as well as information on users (seller/customer).

### Client

The client frontend is written in Angular. As a Framework, we want to use 
Material Design to style our application. We use SCSS to create custom style 
definitions. 

### Connection

The communication between server and client takes place with AJAX requests (for 
product detail pages etc.) and with io websockets (live-update of article bids).

We use Promises to synch callbacks of requests.

### Authenticaion

Authentication will be possible with common social media logins such as 
Google+, Facebook, Instagram and Twitter using oAuth2. User data will be 
persisted in our MongoDB database.

## Running instructions

### Database

Run your database using `mongod -dbPath "<path-to-your-mongodb-running-directory>"`

### Server

> Note: To run your server, the database must be running.

> Note: To be able to compile your typescript files, typescript must be installed. If you haven't already, install it
using `npm install -g typescript`. You may need to restart your terminal/console to recognize the tsc command. You can 
check for a successfull installation using `which tsc`.

Navigate to server directory using `cd server`. 

* Compile the server application using `npm run-script compile`
* Run the server application using `npm run-script run`
* Compile and run the server application using `npm run-script start`

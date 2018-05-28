# Auctionary

This app is a digital auction house. 

* Create/Update/Delete auctions in the Seller Dashboard
* Browse/See/Bid auctions in the Customer section
* Browse your purchases and your lost auctions

## Technology

### Server

Regarding the server express is being used, which is connected to a MongoDB database containing 
all information on the items as well as information on users (seller/customer).

### Client

The client frontend is written in Angular. As a Framework, we want to use 
Material Design to style our application. We use SCSS to create custom style 
definitions. 

### Connection

The communication between server and client takes place with AJAX requests (for 
product detail pages etc.) and with io websockets (live-update of article bids).

We use Promises to sync callbacks of requests.

### Authentication

Authentication will be possible with common social media logins such as 
Google+, Facebook, Instagram and Twitter using oAuth2. User data will be 
persisted in our MongoDB database.

## Running instructions

### Using the run script

> Note: This feature is still in development.

#### Prerequisites

Before using the run script:

* Make sure Node.js is installed
* Install the SSL certificates. Please have a look at the `SSL certificates` section for further instructions.
* Install MongoDB. Please have a loog at the `Database` section for further instructions. You only need to install 
MongoDB, you do not need to run it!

#### Executing the run script

* [WIN]: Execute `run.bat`. The script will take care of all necessary steps for you to run the app in development mode.
* [UNIX]: Execute `./run.sh`. The script will take care of all necessary steps for you to run the app in development 
mode.

### Node.js

* Download and install [Node.js](https://nodejs.org/en/)

> Hint: Make sure to use the LTS version.

> [WIN]: You may need to restart your machine to use Node.js commands

* Install TypeScript `npm i -g typescript`
* Install Angular `npm i -g @angular/cli`

### SSL certificates

* Navigate to server directory using `cd server`
* Create new folder (if not exist) using `mkdir sslcert`
* Navigate to new sslcert directory using `cd sslcert`
* [WIN]: Download and install [WIN32OpenSSL](http://slproweb.com/download/Win32OpenSSL_Light-1_1_0h.exe)
* [WIN]: Add your installation path to your environment path variable
* [WIN]: Create your own personal SSL certificates using `openssl req -x509 -out localhost.crt -keyout localhost.key 
-newkey rsa:2048 -nodes -sha256 -subj "//CN=localhost"`
* [UNIX]: Create your own personal SSL certificates using `openssl req -x509 -out localhost.crt -keyout localhost.key 
-newkey rsa:2048 -nodes -sha256 -subj "/CN=localhost"`

### Database

* Download and install [MongoDB - Community Server](https://www.mongodb.com/download-center?jmp=nav#community)
* Make sure your installation path of MongoDB is available in your environmental path variable
* Run your database using `mongod -dbPath "<path-to-your-mongodb-running-directory>"`

> [WIN]: You may need to restart your machine before using the command `mongod` or using the run script

### Server

> Note: To run your server, you first need to generate your own personal SSL certificate

> Note: To run your server, the database must be running.

> Note: To be able to compile your typescript files, typescript must be installed. If you haven't already, install it
using `npm install -g typescript`. You may need to restart your terminal/console to recognize the tsc command. You can 
check for a successfull installation using `which tsc`.

Navigate to server directory using `cd server`. 

* Run `npm install`
* Duplicate `server/auth/AuthentiationConfig.skeleton` and rename it to `AuthenticationConfig.ts`
* Fill in your personal API information to the specified login methods in `server/auth/AuthenticationConfig.ts`

You now have multiple opportunities:

* Compile the server application using `npm run-script compile`
* Run the server application using `npm run-script run`
* Compile and run the server application using `npm run-script start` (preferred)

### Client

> Note: Developing is possible with a local testing server (on port 4200) and with a running server. The second choice 
is recommended

> Note: Build options marked with <sup>1</sup> need a running server. See `server` for further instructions 

Navigate to client directory using `cd client`.

* Run `npm install`

You now have multiple opportunities:

* Run the client on a standalone testing server using `ng s -o`
* Run the client in development mode delivered by the server using `npm run-script build` <sup>1</sup>
* Run the client in production mode delivered by the server using `npm run-script build-prod` <sup>1</sup>

#### Styling the client

Since Angular Material is used to style this web app, you can use all elements listed on 
[Angular Material](https://material.angular.io/components/)

For layouting [Angular Flex Layout](https://github.com/angular/flex-layout) is being used

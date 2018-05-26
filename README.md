# < insert-app-name-here >

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

> In this area instructions on how to run and deploy our app will be given. 
> Please be patient; we're working on it!

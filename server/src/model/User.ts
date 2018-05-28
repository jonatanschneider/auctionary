import { Login } from './Login';

export class User {
    _id: string;
    name: string;
    firstname: string;
    lastname: string;
    email: string;
    login: Login;
    profilePicture: string;
    auctionIds: string[];
    ownAuctionIds: string[];
}

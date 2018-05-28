import { Express, Request, Response } from 'express';
import { Collection } from 'mongodb';

export class Auctions {
    static init(router: Express, auctionsCollection: Collection) {
        router.get("/api/auctions", function(req: Request, res: Response) {
            // TODO: Implement database actions
            res.status(200).json({ auctions: [] });
        });
    }
}

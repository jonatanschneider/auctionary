import { Express, Request, Response } from 'express';
import { Collection } from 'mongodb';

export class Auctions {
    static init(router: Express, auctionsCollection: Collection) {
        router.get('/api/auctions', function (req: Request, res: Response) {
            // TODO: Implement database actions
            res.status(200).send({ auctions: [] });
        });
        router.get('/api/auctions/:id', function(req: Request, res: Response) {
            const query: Object = {_id: new ObjectID(id)};
           // TODO: Implement database actions
            res.status(200).send({data: []});
        });
    }
}

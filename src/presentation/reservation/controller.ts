import { Request, Response } from 'express';
import { ReservationService } from '..';
import { JwtAdapter } from '../../config';
import { RestaurantModel } from '../../data';
import { CustomError, ReservationDto } from '../../domain';

export class ReservationController {
    constructor(
        public readonly reservationService: ReservationService
    ) { }

    private handleError = ( error: unknown, res: Response ) => {
        if ( error instanceof CustomError ) {
          return res.status( error.statusCode ).json( { error: error.message } );
        }
    
        console.log( `${ error }` );
        return res.status( 500 ).json( { error: 'Internal server error' } );
      };

    createReservation = async (req: Request, res: Response) => {
        try {
            const restaurant = await RestaurantModel.findOne({
                name: req.body.restaurantName,
                address: req.body.restaurantAddress
            });

            if (!restaurant) {
                return res.status(404).json({ error: 'Restaurant not found' });
            }

            const token = req.headers.authorization?.split(' ')[1];
            const tokenDecrypted = await JwtAdapter.validateToken(token!);

            if (!tokenDecrypted) {
                return res.status(401).json({ error: 'Invalid token' });
            }

            const { _id } = restaurant;
            const { id } = tokenDecrypted as { id: string };

            const [day, month, year] = req.body.date.split(/[-\/]/);


            const [error, reservation] = ReservationDto.create({
                ...req.body,
                restaurantId: _id,
                date: new Date(Number(year), Number(month) - 1, Number(day)),
                userId: id
            });

            if (error) {
                return res.status(400).json({ error });
            }

            this.reservationService.createReservation(reservation!)
                .then((data) => res.json(data))
                .catch((error) => this.handleError(error, res));

        } catch (error) {
            console.log(error);
            this.handleError(error, res);
        }
    }
}

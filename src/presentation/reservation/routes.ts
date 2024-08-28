import { Router } from 'express';
import { AuthMiddleware } from '..';
import { ReservationService } from '../services/reservation.service';
import { ReservationController } from './controller';


export class ReservationRoutes {
    static get routes(): Router {
        const router = Router();
        const reservationService = new ReservationService();
        const reservationController = new ReservationController(reservationService)
        router.post('/', [AuthMiddleware.validateJWT], reservationController.createReservation);
        return router;
    }
}
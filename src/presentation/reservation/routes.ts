import { Router } from 'express';
import { AuthMiddleware, EmailService } from '..';
import { envs } from '../../config';
import { ReservationService } from '../services/reservation.service';
import { ReservationController } from './controller';


export class ReservationRoutes {
    static get routes(): Router {
        const router = Router();
        const emailService = new EmailService(
            envs.MAILER_SERVICE,
            envs.MAILER_EMAIL,
            envs.MAILER_SECRET_KEY,
            envs.SEND_EMAIL,
        );
        const reservationService = new ReservationService(emailService);
        const reservationController = new ReservationController(reservationService)
        router.get('/', [AuthMiddleware.validateJWT], reservationController.getReservations);
        router.post('/', [AuthMiddleware.validateJWT], reservationController.createReservation);
        router.get('/:restaurantName', [AuthMiddleware.validateJWT], reservationController.getReservationsByRestaurant);
        
        return router;
    }
}
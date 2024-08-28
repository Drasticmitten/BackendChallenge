import { Router } from 'express';
import { AuthRoutes, ReservationRoutes, RestaurantRoutes } from '.';



export class AppRoutes {
    static get routes(): Router {
        const router = Router();

        router.use('/api/auth', AuthRoutes.routes);
        router.use('/api/restaurant', RestaurantRoutes.routes);
        router.use('/api/reservation', ReservationRoutes.routes);
        return router;
    }
}
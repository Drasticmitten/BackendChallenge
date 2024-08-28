import { Router } from 'express';
import { AuthMiddleware, RestaurantController, RestaurantService } from '..';

export class RestaurantRoutes {
    static get routes(): Router {
        const router = Router();
        const restaurantService = new RestaurantService();
        const restaurantController = new RestaurantController(restaurantService)
        router.get('/', [AuthMiddleware.validateJWT], restaurantController.getAllRestaurants);
        router.post('/', [AuthMiddleware.validateJWT], restaurantController.createRestaurant);
        return router;
    }
}
import { Request, Response } from "express";
import { RestaurantService } from "..";
import { CustomError, RestaurantDto } from "../../domain";

export class RestaurantController {
    constructor(
        private readonly restaurantService: RestaurantService
    ) { }

    private handleError = (error: unknown, res: Response) => {
        if (error instanceof CustomError) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`error: ${error}`);
        return res.status(500).json({ error: 'Internal server error' });
    };

    getAllRestaurants = (req: Request, res: Response) => {

        this.restaurantService.getAllRestaurants()
            .then((data) => res.json(data))
            .catch((error) => this.handleError(error, res));
    }

    getRestaurantByNameAndCity = (req: Request, res: Response) => {
        this.restaurantService.getRestaurantByNameAndCity(req.query.name as string, req.query.city as string)
        .then((data) => res.json(data))
        .catch((error) => this.handleError(error, res));
    }

    createRestaurant = (req: Request, res: Response) => {
        const [error, restaurantDto] = RestaurantDto.create(req.body);
        if (error) return res.status(400).json({ error });
        
        this.restaurantService.createRestaurant(restaurantDto!)
            .then((restaurant) => res.json(restaurant))
            .catch((error) => this.handleError(error, res));
    }
}
import { RestaurantModel } from "../../data";
import { CustomError } from "../../domain";
import { RestaurantDto } from "../../domain/dtos/restaurant/restaurant.dto";

export class RestaurantService {
    constructor() {}
    
    async getAllRestaurants(  ) : Promise<{ total: number, restaurants: any[] }> {
        try {
            const [ total, restaurants] = await Promise.all([
                RestaurantModel.countDocuments(),
                RestaurantModel.find()]);
            return {
                total: total,
                restaurants: restaurants.map((restaurant) => ({
                    id                  : restaurant._id,
                    name                : restaurant.name,
                    description         : restaurant.description,
                    address             : restaurant.address,
                    city                : restaurant.city,
                    photos              : restaurant.photo,
                    reservationsdone    : restaurant.reservationsDone,
                }))
            }
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    }

    
    async getRestaurantByNameAndCity(name: string, city: string) {
        try {
            const [ total , restaurants] = await Promise.all([
                RestaurantModel.countDocuments({ name, city }),
                RestaurantModel.find({ name: new RegExp(`^${name}`, 'i'), city })
            ]);
            if (!restaurants) {
                throw CustomError.notFound(`Restaurants with name ${name} o similar and city ${city} not found`);
            }
            return {
                total: total,
                restaurants: restaurants.map((restaurant) => ({
                    id                  : restaurant._id,
                    name                : restaurant.name,
                    description         : restaurant.description,
                    address             : restaurant.address,
                    city                : restaurant.city,
                    photos              : restaurant.photo,
                    reservationsdone    : restaurant.reservationsDone,
                }))
            }
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
        
    }

    async createRestaurant(restaurantDto: RestaurantDto) {
        const restaurantExists = await RestaurantModel.findOne({ name: restaurantDto.name, city: restaurantDto.city, address: restaurantDto.address });
        if (restaurantExists) throw CustomError.badRequest('Restaurant already exists');
    
        try {
            const restaurant = new RestaurantModel(restaurantDto);
            await restaurant.save();
            return restaurant;
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    }
}
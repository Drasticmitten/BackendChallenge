import { ReservationModel, UserModel } from "../../data";
import { CustomError, ReservationDto } from "../../domain";

export class ReservationService {
    constructor() {}

    async getReservationsByRestaurantId(restaurantId: string) {
        try {
            const reservations = await ReservationModel.find({ restaurantId });
            return {
                total           : reservations.length,
                reservations    : reservations.map((reservation) => ({
                id              : reservation._id,
                restaurantId    : reservation.restaurantId,
                userId          : reservation.userId,
                tableNumber     : reservation.tableNumber,
            }))}
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    }

    async getAllReservations() {
        try {
            const reservations = await ReservationModel.find();
            return {
                total           : reservations.length,
                reservations    : reservations.map((reservation) => ({
                id              : reservation._id,
                restaurantId    : reservation.restaurantId,
                userId          : reservation.userId,
                tableNumber     : reservation.tableNumber,
            }))};
        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    }

    async createReservation(reservationDto: ReservationDto) {
        try {
            const reservations = await ReservationModel.find({ tableNumber: reservationDto.tableNumber, date: reservationDto.date}).countDocuments();
            console.log(reservations);
            if ( reservations > 0) throw CustomError.badRequest('Table is already reserved');
            
            const amountOfReservations = await ReservationModel.find({ restaurantName: reservationDto.restaurantName, restaurantAddress: reservationDto.restaurantAddress , date: reservationDto.date}).countDocuments();
            
            const user = await UserModel.findById(reservationDto.userId);
            if (amountOfReservations > 15) {
                throw CustomError.badRequest('Restaurant is full');
            }
            const reservation = new ReservationModel(reservationDto);
            
            await reservation.save();
            
            
            return {
                id                  : reservation._id,
                name                : user!.name,
                date                : reservation.date,
            }



        } catch (error) {
            throw CustomError.internalServer('Internal server error');
        }
    }
}
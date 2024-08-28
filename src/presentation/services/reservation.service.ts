import { EmailService } from "..";
import { ReservationModel, RestaurantModel, UserModel } from "../../data";
import { CustomError, ReservationDto } from "../../domain";

export class ReservationService {
    constructor(
        private readonly emailService: EmailService,
    ) {}

    async getReservationsByRestaurantName(restaurantName: string) {
        try {
            const reservations = await ReservationModel.find({ restaurantName: new RegExp(`^${restaurantName}$`, 'i') });
            if (reservations.length === 0) throw CustomError.notFound('Reservations not found');
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
            const amountOfReservations = await ReservationModel.find({ restaurantName: reservationDto.restaurantName, restaurantAddress: reservationDto.restaurantAddress , date: reservationDto.date}).countDocuments();
            
            if (amountOfReservations >= 15) throw CustomError.badRequest('Restaurant is full');

            const reservations = await ReservationModel.find({ tableNumber: reservationDto.tableNumber, date: reservationDto.date}).countDocuments();
            
            if ( reservations > 0) throw CustomError.badRequest('Table is already reserved');
            


            const user = await UserModel.findById(reservationDto.userId);
            const { email } = user as { email: string };
            const reservation = new ReservationModel(reservationDto);
            
            await reservation.save();

            const reservationsDate = await RestaurantModel.findOne({
                _id: reservationDto.restaurantId,
                "reservationsDone.date": reservationDto.date,
            });
            
            if (reservationsDate) {
                await RestaurantModel.findOneAndUpdate(
                    { _id: reservationDto.restaurantId, "reservationsDone.date": reservationDto.date },
                    { $inc: { "reservationsDone.$.count": 1 } }
                );
            } else {
                // Si no existe, añade un nuevo objeto a reservationsDone
                await RestaurantModel.findOneAndUpdate(
                    { _id: reservationDto.restaurantId },
                    { $push: { reservationsDone: { date: reservationDto.date, count: 1 } } },
                    { new: true }
                );
            }

            const emailSent = await this.emailService.sendEmail({
                to: email,
                subject: 'Reservation created',
                htmlBody: `Your reservation for ${reservationDto.restaurantName} has been created for the ${reservationDto.date}`,
            });

            if (!emailSent) {
                console.log('Email not sent');
            }
            
            return {
                id                  : reservation._id,
                name                : user!.name,
                date                : reservation.date,
            }



        } catch (error) {
            if (error instanceof CustomError) {
                throw error;
            }
            throw CustomError.internalServer('Internal server error');
        }
    }
}
import { model, Schema, Types } from 'mongoose';

const reservationSchema = new Schema({
    restaurantId: {
        type: Types.ObjectId,
        ref: 'Restaurant',
        required: [true, 'Restaurant ID is required'],
    },
    userId: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'User ID is required'],
    },
    restaurantName: {
        type: String,
        required: [true, 'Restaurant name is required'],
    },
    restaurantAddress: {
        type: String,
        required: [true, 'Restaurant address is required'],
    },
    tableNumber: {
        type: Number,
        required: [true, 'Table number is required'],
    },
    date: {
        type: Date,
        required: [true, 'Date is required'],
    }
    }
);

export const ReservationModel = model('Reservation', reservationSchema);
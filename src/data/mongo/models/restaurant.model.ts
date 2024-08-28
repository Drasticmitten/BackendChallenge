import { model, Schema } from "mongoose";

const reservationsDoneSchema = new Schema({
    date: {
        type: String, 
        required: true,
    },
    count: {
        type: Number,
        default: 0,
    }
}, { _id: false });

const resturantSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required'],
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
    },
    address: {
        type: String,
        required: [true, 'Address is required'],
    },
    city: {
        type: String,
        required: [true, 'City is required'],
    },
    capacity: {
        type: Number,
        default: 15,
    },
    photo: {
        type: String,
        required: [true, 'Photo is required'],
    },
    reservationsDone: {
        type: [reservationsDoneSchema],
        default: [],
    },
    
});

export const RestaurantModel = model('Restaurant', resturantSchema);
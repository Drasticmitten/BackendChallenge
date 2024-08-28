import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
    },
    emailValidated: {
        type: Boolean,
        default: false,
    },
    password: {
        type: String,
        required: [true, "Password is required"],
    },
    name: {
        type: String,
        required: [true, "Name is required"],
    },
});

export const UserModel = mongoose.model("User", userSchema);
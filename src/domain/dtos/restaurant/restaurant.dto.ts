import { ReservationStatus } from "../..";


export class RestaurantDto {
    constructor(
        public readonly name: string,
        public readonly description: string,
        public readonly address: string,
        public readonly city: string,
        public readonly photo: string,
        public readonly reservationsDone: ReservationStatus,
        public readonly capacity: number = 15,
    ) {}
    
    static create(obj: { [key: string]: any }): [string?, RestaurantDto?] {
        const { name, description, address, city, photo, reservationsDone } = obj;
        if (!name) return ['name is required'];
        if (!description) return ['description is required'];
        if (!address) return ['address is required'];
        if (!city) return ['city is required'];
        if (!photo) return ['photo is required'];

        return [undefined, new RestaurantDto(name, description, address, city, photo, reservationsDone)];
    }
}
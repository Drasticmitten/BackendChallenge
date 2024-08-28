

export class ReservationDto {
    constructor(
        public readonly restaurantId: string,
        public readonly restaurantName: string,
        public readonly restaurantAddress: string,
        public readonly userId: number,
        public readonly tableNumber: number,
        public readonly date: Date,
    ){}

    static create(object: {[key:string]: any}): [string?, ReservationDto?] {
        const { restaurantId, restaurantName,  restaurantAddress, userId, tableNumber, date} = object;
        if (!restaurantId) return ['restaurantId is required'];
        if (!restaurantName) return ['restaurantName is required'];
        if (!restaurantAddress)  return ['restaurantAddress is required'];
        if (!userId) return ['userId is required'];
        if (!tableNumber)return ['tableNumber is required'];
        if (!date) return ['date is required'];

        return [undefined , new ReservationDto( restaurantId, restaurantName, restaurantAddress, userId, tableNumber, date)];
    }
}
export enum ReservationStatus {
    PENDING     = 'pending',
    APPROVED    = 'approved',
    REJECTED    = 'rejected',
}

export interface Reservation {
    userId  : string,
    roomId  : string,
    date    : Date,
    status  : ReservationStatus
}

export class Reservation {


    constructor(
        userId  : string,
        roomId  : string,
        date    : Date,
        status  : ReservationStatus,
    ) { }


}
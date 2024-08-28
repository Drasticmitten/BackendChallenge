import { CustomError } from "..";

export class UserEntity {
    constructor(
        public name: string,
        public email: string,
        public emailValidated: boolean,
        public password: string,
    ) { }

    static fromObject(obj: {[key: string]: any}): UserEntity {
        const { _id, name, email, emailValidated, password } = obj;
        if (!_id) {
            throw CustomError.badRequest('User id is required');
        }
        if (!name) {
            throw CustomError.badRequest('User name is required');
        }
        if (!email) {
            throw CustomError.badRequest('User email is required');
        }
        if (emailValidated === undefined) {
            throw CustomError.badRequest('User emailValidated is required');
        }
        if (!password) {
            throw CustomError.badRequest('User password is required');
        }
        
        return new UserEntity(name, email, emailValidated, password);
    }
}

export class RegisterUserDto {
    private constructor(
        public readonly email: string,
        public readonly password: string,
        public readonly name: string,
    ) { }

    static create(object: {[key:string]: any}): [string?, RegisterUserDto?] {
        const { email, password, name } = object;
        if (!email) return ['Email is required'];
        
        if (!password) return ['Password is required'];
    
        if (password.length < 6) return ['Password must be at least 6 characters'];

        if (!name) return ['Name is required'];

        // if (!regularExps.email.test(email)) return ['Email is invalid'];
        
        return [undefined , new RegisterUserDto(email, password, name)];
    }
}
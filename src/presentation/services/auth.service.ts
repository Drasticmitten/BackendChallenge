import { bcryptAdapter, envs, JwtAdapter } from '../../config';
import { UserModel } from '../../data';
import { CustomError, LoginUserDto, RegisterUserDto, UserEntity } from '../../domain';
import { EmailService } from './email.service';

export class AuthService {
    constructor(
        private readonly emailService: EmailService,
    ) { }

    public async registerUser(registerUserDto: RegisterUserDto) {
        const existUser = await UserModel.findOne({ email: registerUserDto.email });
        if (existUser) {
            throw CustomError.badRequest('Email already exists');
        }

        try {
            const user = new UserModel(registerUserDto);
            user.password = await bcryptAdapter.hash(user.password);
            await user.save();

            await this.sendEmailValidationLink(user.email);

            const { password, ...userEntity } = UserEntity.fromObject(user);
            console.log("user: ", user);
            const token = await JwtAdapter.generateToken({ 
                id: user._id,
                name: user.name,
                email: user.email,
                emailValidated: user.emailValidated,
            });
            if (!token) throw CustomError.internalServer('Error getting token');

            return {
                user: userEntity,
                token: token,
            };
            
        } catch (error) {
            throw CustomError.internalServer('Error registering user');
        }

    }

    public async loginUser( loginUser: LoginUserDto) {
        const user = await UserModel.findOne({ email: loginUser.email });
        if (!user) {
            throw CustomError.badRequest('Email doesn\'t exist');
        }
    
        const isValidPassword = await bcryptAdapter.compare(loginUser.password, user.password);
        if (!isValidPassword) {
            throw CustomError.badRequest('Email or password incorrect');
        }

        const { password, ...userWithoutPassword } = UserEntity.fromObject(user);
        const token = await JwtAdapter.generateToken({ id: user._id });
        if (!token) throw CustomError.internalServer('Error getting token');

        return { user: userWithoutPassword, token };

    }

    private sendEmailValidationLink = async (email: string) => {

        const token = await JwtAdapter.generateToken({ email });
        if (!token) throw CustomError.internalServer('Error getting token');

        const link = `${envs.WEBSERVICE_URL}/auth/validate-email/${token}`;
        const html = `
        <h1>Validate your email</h1>
        <p>Click on the following link to validate your email</p>
        <a href="${link}">Validate your email: ${email}</a>
        `;

        const options = {
            to: email,
            subject: 'Validate your email',
            htmlBody: html,
        }

        const isSent = await this.emailService.sendEmail(options);
        if (!isSent) throw CustomError.internalServer('Error sending email');

        return true;
    }

    public validateEmail = async (token: string) => {
        const payload = await JwtAdapter.validateToken(token);
        if (!payload) throw CustomError.badRequest('Invalid token');
        
        const { email } = payload as { email: string };
        if (!email) throw CustomError.badRequest('Invalid token');

        const user = await UserModel.findOne({ email });
        if (!user) throw CustomError.badRequest('User not found');

        user.emailValidated = true;
        await user.save();
        return true;
    }
}
import jwt from 'jsonwebtoken';
import { envs } from './envs';

const JWT_SEED = envs.JWT_SEED;

export class JwtAdapter {

    static async generateToken<T>(payload: any): Promise<T | null> {
        console.log(payload);
        return new Promise((resolver) => {
            jwt.sign(payload, JWT_SEED, {
                expiresIn: '1h'
            }, (err, token) => {
                if (err) resolver(null);
                
                resolver(token as T);
            });
        });
    }

    static validateToken<T>(token: string): Promise<T | null> {
        return new Promise((resolve) => {
            jwt.verify(token, JWT_SEED, (err, decoded) => {
                if (err) {
                    console.log(err);
                    resolve(null);
                } else {
                    resolve(decoded as T);
                }
            });
        });
    }
    
}
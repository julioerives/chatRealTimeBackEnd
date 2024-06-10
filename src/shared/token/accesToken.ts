import jwt from 'jsonwebtoken';
import { config } from 'dotenv';
config();
export function accessToken(id:number|string):any{
    if (!process.env.SECRET_KEY) {
        throw new Error('Secret key is not defined in environment variables');
    }
    return jwt.sign({id},process.env.SECRET_KEY,{expiresIn:"60m"})
}
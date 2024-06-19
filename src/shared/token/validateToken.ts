import { Response } from "../../models/response";
import { error } from "../../response/error";
import { config } from "dotenv";
import jwt from 'jsonwebtoken';
import { errorMessage } from "../../constants/errorMessages";
import { routesNoProtected } from "../../constants/routesNoProtected";

config();
export function validateToken(req: any, res: any,next:any){
    const accessToken = req.headers['authorization'];
    console.log(req.path);
    if (routesNoProtected.includes(req.path)) {
        return next();
    }
    if (!process.env.SECRET_KEY) {
        throw new Error('Secret key is not defined in environment variables');
    }
    if(!accessToken){
        res.status(401).json(error(errorMessage.NO_TOKEN))
        return
    }
    const token = accessToken.split(' ')[1];
    jwt.verify(token,process.env.SECRET_KEY,(err:any,user:any)=>{        
        if(err){
            res.json(error(errorMessage.INVALID_TOKEN))
            return
        }
        next();
    })
}
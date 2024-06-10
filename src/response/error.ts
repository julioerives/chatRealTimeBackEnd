import { Response } from "../models/response"
export const error =(message:string):Response=>({
    message:message,
    error:true,
    data:[]
})
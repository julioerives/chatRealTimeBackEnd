import { Response } from "../models/response"
export const correctResponse = (message:string,data:any):Response=>({
    message:message,
    error:false,
    data:data
})
import { getConnection } from "../database/database"
import { errorMessage } from "../constants/errorMessages";
import { error } from "../response/error";
import { correctResponse } from "../response/correct";
import { messagesUsers } from "../constants/messagesUsers";
import { chatsMessages } from "../constants/chatsMessages";
export const getChats = async  (req:any, res:any)=>{
    console.log("Chats")
    const id = req.params.id;
    // const id = 1;
    try{
        const connection = await getConnection();
        // const [rows]:any = await connection.query("SELECT chatUsers.*, comentarios.* FROM chatUsers INNER JOIN comentarios ON comentarios.id_usuario = chatUsers.id_user AND comentarios.id_chat = chatUsers.id_chat WHERE chatUsers.id_user =?", [id]);
        const [rows]:any = await connection.query("SELECT chatUsers.*, chats.id, chats.nombre,DATE_FORMAT(fecha_creacion, '%d-%m-%Y') AS fecha_creacion FROM chatUsers INNER JOIN chats ON chatUsers.id_chat = chats.id WHERE chatUsers.id_user =?",[id])
        console.log("🚀 ~ getChats ~ rows:", rows)
        if(rows.length <1){
            res.json(error(errorMessage.NOT_FOUND))
            return;
        }
        res.json(correctResponse(chatsMessages.chats_found,rows))
    }catch(e){
        res.json(error(errorMessage.ERROR));
        console.log(e)
    }

}
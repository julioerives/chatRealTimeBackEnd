import { getConnection } from "../database/database"
import { errorMessage } from "../constants/errorMessages";
import { error } from "../response/error";
import { correctResponse } from "../response/correct";
import { messagesUsers } from "../constants/messagesUsers";
import { chatsMessages } from "../constants/chatsMessages";
export const getChats = async  (req:any, res:any)=>{
    const id = req.params.id;
    let connection;
    try{
        connection = await getConnection();

        // const [rows]:any = await connection.query("SELECT chatUsers.*, comentarios.* FROM chatUsers INNER JOIN comentarios ON comentarios.id_usuario = chatUsers.id_user AND comentarios.id_chat = chatUsers.id_chat WHERE chatUsers.id_user =?", [id]);
        const [rows]:any = await connection.query("SELECT chatUsers.*, chats.id, chats.nombre,DATE_FORMAT(fecha_creacion, '%d-%m-%Y') AS fecha_creacion FROM chatUsers INNER JOIN chats ON chatUsers.id_chat = chats.id WHERE chatUsers.id_user =?",[id])
        if(rows.length <1){
            res.json(error(errorMessage.NOT_FOUND))
            return;
        }
        res.json(correctResponse(chatsMessages.chats_found,rows))
    }catch(e){
        res.json(error(errorMessage.ERROR));
        console.log(e)
    }finally{
        if(connection) connection.release()
    }

}
export const insertChats = async (req:any, res:any) => {
    const data =req.body;
    console.log(data)
    let connection;
    try{
        connection = await getConnection();
        const [rowsChat]: any = await connection.query("INSERT INTO chats(nombre,descripcion) VALUES(?,?    )", [data.nombre,data.descripcion]);
        const insertValues = data.friends.map((userId: any) => [rowsChat.insertId, userId.id]);
        insertValues.push([rowsChat.insertId,data.id])
        const placeholders = insertValues.map(() => '(?, ?)').join(',');
        const flatValues = insertValues.reduce((acc:any, val:any) => acc.concat(val), []);
        
        const insertQuery = await connection.query(`INSERT INTO chatUsers (id_chat, id_user) VALUES ${placeholders}`, flatValues);
        
        res.json(correctResponse(chatsMessages.CHAT_INSERTED, insertQuery));
    }catch(e){
        console.log(e)
        res.json(error(errorMessage.ERROR))
    }finally{
        connection?.release();
    }
}
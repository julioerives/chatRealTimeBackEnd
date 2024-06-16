import { getConnection } from "../database/database"
import { errorMessage } from "../constants/errorMessages";
import { error } from "../response/error";
import { correctResponse } from "../response/correct";
import { messagesUsers } from "../constants/messagesUsers";
import { accessToken } from "../shared/token/accesToken";
export const register= async (req:any,res:any)=>{
    const data:any = req.body;
    try{
        const connection = await getConnection();
        const [rows]:any = await connection.query("SELECT * FROM usuarios where correo = ?", [data.correo]);
        if(rows.length > 0){
            res.json(error(errorMessage.MAIL_EXISTS))
            return;
        }
        const postUsuarios = await connection.query("INSERT INTO usuarios(nombre_usuario,correo,contraseña) VALUES (?,?,?)",[data.nombreUsuario,data.correo,data.contraseña])
        const response = correctResponse(messagesUsers.INSERTED_USER,postUsuarios)
        res.json(correctResponse("Registro hecho con exito",response))
    }catch(err){
        console.log(err);
        res.json(error(errorMessage.ERROR))
    }
}
export const login= async (req:any, res:any) => {
    const data = req.body;
    console.log(data.contraseña)
    try{
        const connection = await getConnection();
        const [rows]:any = await connection.query("SELECT * FROM usuarios WHERE  correo = ? AND contraseña =?",[data.correo,data.contraseña]);
        if (rows.length < 1) {
            res.json(error(errorMessage.NOT_FOUND));
            return;
          }
        const token = accessToken(rows[0].id)
        res.header("authorization",token).json(correctResponse("Usuario autenticado",{id:rows[0].id,token:token}))
    }catch(e){
        console.log(e)
        res.json(error(errorMessage.ERROR))
    }
}
export const addFriend = async (req:any, res:any)=>{
    const data = req.body;
    try{
        const connection = await getConnection();
        const [rows2]:any = await connection.query("SELECT * FROM usuarios where id =? OR id=?",[data.idUser1,data.idUser2])
        if(rows2.length <2){
            res.json(error(messagesUsers.USERS_NOT_FOUND))
        }
        const [rows]:any = await connection.query("INSERT INTO friends(id_usuario1,id_usuario2) VALUES (?, ?)", [data.idUser1, data.idUser2]);
        res.json(correctResponse(messagesUsers.ADDED_FRIEND,rows))
    }catch(e){
        console.log(e)
        res.json(error(errorMessage.ERROR))
    }
}
export const getUser = async (req:any, res:any) => {
    console.log("hola")
    const id = req.params.id;
    try{
        const connection = await getConnection();
        const [rows2]:any = await connection.query("Select * from usuarios where id =?",[id]);
        if(rows2.length <1){
            res.json(error(messagesUsers.USERS_NOT_FOUND))
        }
        res.json(correctResponse(messagesUsers.USER_FOUND,rows2[0]))
    }catch(e){
        res.json(error(errorMessage.ERROR));
    }
}
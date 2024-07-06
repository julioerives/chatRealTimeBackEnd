import { getConnection } from "../database/database";
import { gruposPublicosMensajes } from "../constants/gruposPublicosMessages";
import { errorMessage } from "../constants/errorMessages";
import { correctResponse } from "../response/correct";
import { error } from "../response/error";
export const getGrupos= async (req:any,res:any) =>{
    const {id} = req.params;
    console.log(id);
    try{
        const connection = await getConnection();
        const consulta = `
         SELECT UG.id as id_usuarios_grupos, G.*
         FROM usuarios_tienen_grupos UG
         INNER JOIN grupos G ON UG.id_grupo = G.id
         WHERE UG.id_grupo = ?;
        `
        const[rows]:any = await connection.query(consulta,[id]);
        if(rows.length < 1){
            res.json(error(gruposPublicosMensajes.PUBLIC_GROUPS_NOT_FOUND))
            return;
        }
        res.json(correctResponse(rows,gruposPublicosMensajes.PUBLIC_GROUPS_FOUNDS))
    }catch(err){
        res.json(error(errorMessage.ERROR))
        console.log(err);
    }
}
export const getDataGroups = async (req:any, res:any) => {
    const {id} = req.params;
    try{
        const connection = await getConnection();
        const consultaGrupo = 
        `
        SELECT G.*
        FROM grupos G
        WHERE G.id = ?;
        `;
        const consultaUsuarios =
        `
        SELECT  U.*
        FROM grupos G
        INNER JOIN usuarios_tienen_grupos US ON G.id = US.id_grupo
        INNER JOIN usuarios U ON U.id = US.id_usuario
        WHERE G.id = ?;
        `
        const [rowsGrupo]:any = await connection.query(consultaGrupo,[id]);
        const [rowsUsuarios]:any = await connection.query(consultaUsuarios,[id]);
        if(rowsGrupo.length <1){
            res.json(error(gruposPublicosMensajes.DATA_NOT_FOUND))
            return;
        }
        if(rowsUsuarios.length <1){
            res.json(error(gruposPublicosMensajes.USERS_NOT_FOUND))
        }
        const [dataGruops]:any = rowsGrupo
        res.json(correctResponse(gruposPublicosMensajes.DATA_FOUND,{
            ...dataGruops,
            usuarios:rowsUsuarios
        }))
    }catch(err){
        console.log(err);
        res.json(error(errorMessage.ERROR))
    }
}
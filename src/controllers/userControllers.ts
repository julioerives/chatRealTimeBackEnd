import { getConnection } from "../database/database";
import { errorMessage } from "../constants/errorMessages";
import { error } from "../response/error";
import { correctResponse } from "../response/correct";
import { messagesUsers } from "../constants/messagesUsers";
import { accessToken } from "../shared/token/accesToken";
export const register = async (req: any, res: any) => {
  const data: any = req.body;
  try {
    const connection = await getConnection();
    const [rows]: any = await connection.query(
      "SELECT * FROM usuarios where correo = ?",
      [data.correo]
    );
    if (rows.length > 0) {
      res.json(error(errorMessage.MAIL_EXISTS));
      return;
    }
    const [rows2]: any = await connection.query(
      "SELECT * FROM usuarios where nombre_usuario = ?",
      [data.nombreUsuario]
    );
    if (rows2.length > 0) {
      res.json(error(errorMessage.USER_NAME_EXISTS));
      return;
    }
    const [rows3]: any = await connection.query(
      "INSERT INTO usuarios(nombre_usuario,correo,contraseña) VALUES (?,?,?)",
      [data.nombreUsuario, data.correo, data.contraseña]
    );
    const token = accessToken(rows3.insertId);
    res
      .header("authorization", token)
      .json(
        correctResponse("Usuario autenticado", {
          id: rows3.insertId,
          token: token,
        })
      );
    // const response = correctResponse(messagesUsers.INSERTED_USER,postUsuarios)
    // res.json(response)
  } catch (err) {
    console.log(err);
    res.json(error(errorMessage.ERROR));
  }
};
export const login = async (req: any, res: any) => {
  const data = req.body;
  console.log(data);
  try {
    console.log("Hola");
    const connection = await getConnection();
    const [rows]: any = await connection.query(
      "SELECT * FROM usuarios WHERE  correo = ? AND contraseña =?",
      [data.correo, data.contraseña]
    );
    console.log(rows.length)
    if (rows.length < 1) {
      res.json(error(errorMessage.NOT_FOUND));
      return;
    }
    const token = accessToken(rows[0].id);
    res
      .header("authorization", token)
      .json(
        correctResponse("Usuario autenticado", { id: rows[0].id, token: token })
      );
  } catch (e) {
    console.log(e);
    res.json(error(errorMessage.ERROR));
  }
};
export const addFriend = async (req: any, res: any) => {
  const data = req.body;
  console.log(data);
  try {
    const connection = await getConnection();
    const [rows2]: any = await connection.query(
      "SELECT * FROM usuarios where id =? OR id=?",
      [data.idSeguidor, data.idSeguido]
    );
    console.log(rows2);
    if (rows2.length < 2) {
      res.json(error(messagesUsers.USERS_NOT_FOUND));
    }
    const [rows]: any = await connection.query(
      "INSERT INTO seguidores(id_seguidor,id_seguido) VALUES (?, ?)",
      [data.idSeguidor, data.idSeguido]
    );
    res.json(correctResponse(messagesUsers.ADDED_FRIEND, rows));
  } catch (e) {
    console.log(e);
    res.json(error(errorMessage.ERROR));
  }
};
export const getUser = async (req: any, res: any) => {
  const id = req.params.id;
  try {
    const connection = await getConnection();
    const [rows2]: any = await connection.query(
      "Select * from usuarios where id =?",
      [id]
    );
    if (rows2.length < 1) {
      res.json(error(messagesUsers.USERS_NOT_FOUND));
      return;
    }
    res.json(correctResponse(messagesUsers.USER_FOUND, rows2[0]));
  } catch (e) {
    res.json(error(errorMessage.ERROR));
  }
};
export const getAllUsers = async (req: any, res: any) => {
  const { id, page } = req.query;
  const limitUsers = page * 10;
  try {
    const connection = await getConnection();
      
    const consulta = `
    (
  SELECT u1.nombre_usuario, u1.correo, u1.id
  FROM usuarios u1
  LEFT JOIN seguidores s1 ON u1.id = s1.id_seguido AND s1.id_seguidor = ?
  WHERE s1.id_seguido IS NULL AND u1.id != ?
)
UNION
(
  SELECT u2.nombre_usuario, u2.correo, u2.id
  FROM usuarios u2
  JOIN seguidores s2 ON u2.id = s2.id_seguidor
  LEFT JOIN seguidores s3 ON u2.id = s3.id_seguido AND s3.id_seguidor = ?
  WHERE s2.id_seguido = ? AND s3.id_seguidor IS NULL AND u2.id != ?
)
ORDER BY RAND()
LIMIT ?;
    `;
    const [rows]: any = await connection.query(
      consulta,
      [id,id,id,id,id, limitUsers]
    );
    console.log("Rowsss",rows);
    if (rows.length < 1) {
      res.json(error(messagesUsers.USERS_NOT_FOUND));
      return;
    }
    res.json(correctResponse(messagesUsers.USER_FOUND, rows));
  } catch (e) {
    console.log(e)
    res.json(error(errorMessage.ERROR));
  }
};
export const getFriends = async (req: any, res: any) => {
  const { id } = req.query;
  try {
    const connection = await getConnection();
    const consulta = `
    SELECT u1.nombre_usuario,u1.correo,u1.id
FROM usuarios u1
JOIN seguidores s1 ON u1.id = s1.id_seguido
JOIN seguidores s2 ON s1.id_seguidor = s2.id_seguido
WHERE s1.id_seguidor = ? AND s2.id_seguido = ? AND s2.id_seguidor = u1.id;
    `;
    const [rows]: any = await connection.query(consulta, [id, id]);

    if (rows.length < 1) {
      res.json(error(messagesUsers.FRIENDS_NOT_FOUND));
      return;
    }
    res.json(correctResponse(messagesUsers.FRIENDS_FOUND, rows));
  } catch (err) {
    console.log(err);
    res.json(error(errorMessage.ERROR));
  }
};
export const getFollowing= async (req:any, res:any)=>{
  const { id } = req.query;
  console.log("🚀 ~ getFollowing ~ id :", id )
  try {
    const connection = await getConnection();
    const consulta = `
    SELECT u1.nombre_usuario,u1.correo,u1.id
FROM usuarios u1
JOIN seguidores s1 ON u1.id = s1.id_seguido
WHERE s1.id_seguidor = ?;
    `;
    const [rows]: any = await connection.query(consulta, [id, id]);
    console.log(rows);
    if (rows.length < 1) {
      res.json(error(messagesUsers.FOLLOWING_NOT_FOUND));
      return;
    }
    res.json(correctResponse(messagesUsers.FOLLOWING_FOUND, rows));
  } catch (err) {
    console.log(err);
    res.json(error(errorMessage.ERROR));
  }
}
export const getFollowers = async (req:any,res:any) => {
  const { id } = req.query;
  try {
    const connection = await getConnection();
    const consulta = `
    SELECT u1.nombre_usuario,u1.correo,u1.id
FROM usuarios u1
JOIN seguidores s1 ON u1.id = s1.id_seguidor
WHERE s1.id_seguido = ?;
    `;
    const [rows]: any = await connection.query(consulta, [id]);
    console.log(rows);
    if (rows.length < 1) {
      res.json(error(messagesUsers.FOLLOWERS_NOT_FOUND));
      return;
    }
    res.json(correctResponse(messagesUsers.FOLLOWERS_FOUND, rows));
  } catch (err) {
    console.log(err);
    res.json(error(errorMessage.ERROR));
  }
}
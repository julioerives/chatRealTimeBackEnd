import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { routerUsers } from './routes/userRoutes';
import { routerChats } from './routes/chatsRoutes';
import dotenv from 'dotenv';
import { validateToken } from './shared/token/validateToken';
import { getConnection } from './database/database';
dotenv.config();
const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
      origin: "*", 
      methods: ["GET", "POST"],
      allowedHeaders: ["Content-Type"],
      credentials: true
    }
  });
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(validateToken)
app.use(express.json());
app.use("/user",routerUsers);
app.use("/chats",routerChats)
app.get("/",(req, res) => {
  res.send("hol")
})
app.use((req:any, res:any) => {
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","*")
    res.header("Access-Control-Allow-Headers","Content-Type, Authorization")
});

io.on('connection', async  (socket:any) => {
  console.log("Socket")
  const connection = await getConnection();
  const chatId = socket.handshake.query.idChat;
  console.log("chat: ",chatId);
  const [messages] = await connection.query('SELECT comentarios.mensaje,TIME(comentarios.fecha_creacion) AS hora_creacion,comentarios.id_usuario,comentarios.id_chat ,usuarios.id,usuarios.nombre_usuario,usuarios.correo FROM comentarios INNER JOIN usuarios ON comentarios.id_usuario = usuarios.id  WHERE id_chat = ? ORDER BY fecha_creacion ASC', [chatId]);
  socket.emit('previous messages', messages);
  socket.on("chat",async (message:any)=>{
    console.log(message)
    try{
       const [rows]:any=await connection.query("INSERT INTO comentarios(mensaje,id_usuario,id_chat)VALUES (?, ?,?)",[message.mensaje,message.id_user,chatId]);
       const [rowsSelect]:any = await connection.query("SELECT comentarios.mensaje,TIME(comentarios.fecha_creacion) AS hora_creacion,comentarios.id_usuario,comentarios.id_chat,usuarios.id,usuarios.nombre_usuario,usuarios.correo from comentarios  INNER JOIN usuarios ON comentarios.id_usuario = usuarios.id WHERE comentarios.id=?",rows.insertId)
       console.log(rowsSelect);
       io.emit('chat', rowsSelect[0]);
    }catch(err){
      console.log(err);
    }
    
  })
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

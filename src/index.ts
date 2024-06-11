import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { routerUsers } from './routes/userRoutes';
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
app.use("/user",routerUsers)
app.use((req:any, res:any,next) => {
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","*")
    res.header("Access-Control-Allow-Headers","Content-Type, Authorization")
});

io.on('connection', async  (socket:any) => {
  const connection = await getConnection();
  const chatId = socket.handshake.query.idChat;
  const [messages] = await connection.query('SELECT * FROM comentarios WHERE id_chat = ? ORDER BY fecha_creacion ASC', [chatId]);
  socket.emit('previous messages', messages);
  socket.on("chat",async (message:any)=>{
    try{
       const [rows]:any=await connection.query("INSERT INTO comentarios(mensaje,id_usuario,id_chat)VALUES (?, ?,?)",[message.mensaje,message.id_user,chatId]);
       const [rowsSelect]:any = await connection.query("SELECT * from comentarios WHERE id=?",rows.insertId)
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

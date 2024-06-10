import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';
import { routerUsers } from './routes/userRoutes';
import dotenv from 'dotenv';
import { validateToken } from './shared/token/validateToken';
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
})
io.on('connection', (socket: Socket) => {
  socket.on("chat",(message)=>{
    console.log(message)
    io.emit('chat', message);
  })
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

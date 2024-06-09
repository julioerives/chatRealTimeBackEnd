import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import cors from 'cors';  // Importar cors

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
app.use((req:any, res:any,next) => {
    res.header("Access-Control-Allow-Origin","*")
    res.header("Access-Control-Allow-Methods","*")
    res.header("Access-Control-Allow-Headers","Content-Type, Authorization")
})
app.get('/', (req, res) => {
  res.send('Socket.io server is running.');
});

io.on('connection', (socket: Socket) => {
  socket.on("chat",(message)=>{
    console.log(message)
    io.emit('chat', message);
  })
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

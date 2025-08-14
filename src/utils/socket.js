const socket = require("socket.io");

const intializeSocket = (server)=>{
    const io = socket(server, {
        cors:{
            origin:"http://localhost:5173"
        }
    });
    io.on("connection",(socket)=>{
        //hanlde requests

        socket.on("joinchat" , ({ userId, id }) =>{
            const room = [userId,id].sort().join("_");
            socket.join(room);
        });

        socket.on("sendMessage", ({firstName, userId, id, text })=>{
             const roomId = [userId,id].sort().join("_");
            io.to(roomId).emit("messageReceived",{firstName,userId,id,text})
        });

        socket.on("disconnect", () =>{});
    })
}

module.exports = intializeSocket;
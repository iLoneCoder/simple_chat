import { Socket, Server } from "socket.io";

export default function socketHandler(socket: Socket, io: Server) {
    console.log("user connected: ", socket.id)
    socket.on("send-message", messageObj => {
        if (messageObj.room) {
            console.log(messageObj)
            socket.to(messageObj.room).emit("receive-message", messageObj.message)
        }
    })

    socket.on("join-room", (room) => {
        console.log("join-room: ", room)
        socket.join(room)
    })

    socket.on("unsubscribe", () => {
        console.log(socket.id)
        const currentId = socket.id
        for (let room of socket.rooms) {
            if (room !== currentId) {
                socket.leave(room)
            }
        }
        // console.log("unsubscribe: ", socket.rooms)
    })
}
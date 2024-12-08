import { Socket } from "socket.io";

export default function socketHandler(socket: Socket) {
    console.log("user connected: ", socket.id)
    socket.on("send-message", messageObj => {
        console.log(messageObj)
        socket.emit("receive-message", messageObj.message)
    })
}
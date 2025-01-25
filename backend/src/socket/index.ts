import { Socket, Server } from "socket.io";
import { getMemeberOfRoom } from "../commands/room";
import { getSetValueByIndex } from "../utils/helpers";

export default function socketHandler(socket: Socket, io: Server) {
    console.log("user connected: ", socket.id)
    socket.emit("authenticated", "Hello, you area logged in")
    
    socket.on("send-message", (messageObj: {username: string, room: string, message: string}) => {
        if (messageObj.room) {
            socket.broadcast.to(messageObj.room).emit("receive-message", {username: messageObj.username, type: "message", text: messageObj.message})
        }
    })

    socket.on("join-room", async (joinData:{room: string, username: string, password: string}) => {
        try {
            await getMemeberOfRoom(+joinData.room, joinData.username, joinData.password)   
            // leave previous room
            if (socket.rooms.size === 2) {
                const prevRoom = getSetValueByIndex(socket.rooms, 1)
                if (prevRoom) {
                    socket.leave(prevRoom)
                }
            }
            socket.join(joinData.room)

            io.to(joinData.room).emit("response_on_join", {
                type: "announcement",
                text: `${joinData.username} joined room ${joinData.room}`
            })
        } catch (error) {
            console.log(error)
            socket.emit("response_on_join", {
                type: "error",
                text: `You can't join the room`
            })
        }
    })

    socket.on("unsubscribe", () => {
        const currentId = socket.id
        for (let room of socket.rooms) {
            if (room !== currentId) {
                socket.leave(room)
            }
        }
    })
}
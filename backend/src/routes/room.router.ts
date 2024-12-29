import express from "express"
import { 
    addMemberToRoom, 
    createRoom, 
    getRoomMembers, 
    isMemberOfRoom, 
    listRooms, 
    removeMemberFromRoom, 
    leaveRoom } from "../controllers/room.controller"
import { verifyUser } from "../controllers/user.controller"

const route = express.Router()

route.post("/room", verifyUser, createRoom)
route.get("/rooms", verifyUser, listRooms)
route.post("/room/:roomId/member", verifyUser, addMemberToRoom)
route.delete("/room/:roomId/member", verifyUser, removeMemberFromRoom)
route.post("/room/:roomId/user", verifyUser, leaveRoom)
route.post("/room/:roomId/members", verifyUser, getRoomMembers)
route.post("/room/:roomId", verifyUser, isMemberOfRoom)

export default route
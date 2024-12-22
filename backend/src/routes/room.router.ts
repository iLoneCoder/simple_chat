import express from "express"
import { addMemberToRoom, createRoom, getRoomMembers, isMemberOfRoom, listRooms, removeMemberFromRoom } from "../controllers/room.controller"
import { verifyUser } from "../controllers/user.controller"

const route = express.Router()

route.post("/room", verifyUser, createRoom)
route.get("/rooms", verifyUser, listRooms)
route.post("/room/:roomId/member", verifyUser, addMemberToRoom)
route.delete("/room/:roomId/member", verifyUser, removeMemberFromRoom)
route.get("/room/:roomId/members", verifyUser, getRoomMembers)
route.post("/room/:roomName", verifyUser, isMemberOfRoom)

export default route
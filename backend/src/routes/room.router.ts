import express from "express"
import { addMemberToRoom, createRoom, getRoomByName, getRoomMembers, isMemberOfRoom, removeMemberFromRoom } from "../controllers/room.controller"
const route = express.Router()

route.post("/room", createRoom)
route.post("/room/:roomId/member", addMemberToRoom)
route.delete("/room/:roomId/member", removeMemberFromRoom)
route.get("/room/:roomId/members", getRoomMembers)
route.get("/room/:roomName", getRoomByName)
route.get("/room/:roomName/member/:memberName", isMemberOfRoom)

export default route
import express from "express"
import { addMemberToRoom, createRoom, getRoomByName, getRoomMembers, isMemberOfRoom, listRooms, removeMemberFromRoom } from "../controllers/room.controller"
const route = express.Router()

route.post("/room", createRoom)
route.get("/rooms", listRooms)
route.post("/room/:roomId/member", addMemberToRoom)
route.delete("/room/:roomId/member", removeMemberFromRoom)
route.get("/room/:roomId/members", getRoomMembers)
route.get("/room/:roomName", getRoomByName)
route.get("/room/:roomName/member/:memberName", isMemberOfRoom)

export default route
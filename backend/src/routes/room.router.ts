import express from "express"
import { addMemberToRoom, createRoom } from "../controllers/room.controller"
const route = express.Router()

route.post("/room", createRoom)
route.post("/member", addMemberToRoom)

export default route
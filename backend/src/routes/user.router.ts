import express from "express"
import { createUser, joinAsUser } from "../controllers/user.controller"
const route = express.Router()

route.post("/user", createUser)
route.get("/user/:username", joinAsUser)
export default route
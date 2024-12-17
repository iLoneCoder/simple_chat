import express from "express"
import { createUser, getUserDetails, listUsers } from "../controllers/user.controller"
const route = express.Router()

route.post("/user", createUser)
route.get("/users", listUsers)
route.get("/user/:username", getUserDetails)
export default route
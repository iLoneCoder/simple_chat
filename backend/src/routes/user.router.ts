import express from "express"
import { createUser, getUserDetails, listUsers, login, verifyUser } from "../controllers/user.controller"
const route = express.Router()

route.post("/user", createUser)
route.post("/login", login)
route.get("/users", verifyUser, listUsers)
route.get("/user/:username", verifyUser, getUserDetails)
export default route
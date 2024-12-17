import express from "express"
import { createUser, getUserDetails, listUsers, login } from "../controllers/user.controller"
const route = express.Router()

route.post("/user", createUser)
route.post("/login", login)
route.get("/users", listUsers)
route.get("/user/:username", getUserDetails)
export default route
import express from "express"
import { createUser } from "../controllers/user.controller"
const route = express.Router()

route.post("/user", createUser)

export default route
import express, { NextFunction, Request, Response } from "express"
import * as dotenv from "dotenv"
import { createServer } from "node:http"
import { Server } from "socket.io"
import cors from "cors"
import userRouter from "./routes/user.router"
import roomRouter from "./routes/room.router"
import socketHandler from "./socket"
import { verifySocketRequester } from "./socket/middlewares"

dotenv.config()
const app = express()
const server = createServer(app)
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173"
    }
})
const PORT = 8000

app.use(cors())
app.use(express.json())

app.use("/api/v1", userRouter)
app.use("/api/v1", roomRouter)

io.use(verifySocketRequester)

io.on("connection", (socket) => {
    socketHandler(socket, io)
})

app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: "error",
        message: "URL not found"
    })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    const statusCode = err.statusCode ? err.statusCode : 500

    if (err.errors && err.errors[0].type === "notNull Violation") {
        err.operational = true
    }
    
    if (err.errors && err.errors[0].type === "unique violation") {
        err.operational = true
        err.message = err.errors[0].message
    }
    
    console.log(err)
        
    res.status(statusCode).json({
        status: "error",
        message: err.message
    })
})

server.listen(PORT, () => console.log(`Server is listening to port ${PORT}`))
import express, { NextFunction, Request, Response } from "express"
import userRouter from "./routes/user.router"
import roomRouter from "./routes/room.router"

const app = express()
const PORT = 8000

app.use(express.json())

app.use("/api/v1", userRouter)
app.use("/api/v1", roomRouter)

app.use("*", (req: Request, res: Response) => {
    res.status(404).json({
        status: "error",
        message: "Not found"
    })
})

app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    const statusCode = 500
    console.log(err)
    res.status(statusCode).json({
        status: "error",
        message: err.message
    })
})

app.listen(PORT, () => console.log(`Server is listening to port ${PORT}`))
import { ExtendedError, Socket } from "socket.io";
import { verifyTokenAsync } from "../utils/roomPassword";
import { JsonWebTokenError } from "jsonwebtoken";

export async function verifySockerRequester(socket: Socket, next: (err?: ExtendedError) => void) {
    try {
        const token = socket.handshake.auth.token
        await verifyTokenAsync(token)
        if (!token) {
            next(new Error("Not authorized, token is missing"))
        }
    
        next()
    } catch (error) {
        if (error instanceof JsonWebTokenError) {
            console.log(error)
            next(error)
        }

        next(new Error("Unknown error during authorization"))
    }
}
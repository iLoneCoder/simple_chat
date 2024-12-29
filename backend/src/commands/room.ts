import { Room } from "../db";
import AppError from "../utils/appError";
import { comparePasswords } from "../utils/roomPassword";

export async function getMemeberOfRoom(roomId: number, memberName: string, password: string): Promise<boolean> {
    const room = await Room.scope("withPassword").findByPk(roomId, {        
        include: {
            association: "members",
            where: {
                username: memberName
            },
            through: {
                attributes: []
            }
        }
    })

    if (!room) {
        throw new AppError("Room not found or you aren't room member", 404)
    }

    if (room.isProtected) {
        if (!password) {
            throw new AppError("password is required", 400)
        }
        const passwordCorrect = await comparePasswords(password, room.password)
        if (!passwordCorrect) {
            throw new AppError("Incorrect passowrd", 400)
        }
    }
 

    return true
}
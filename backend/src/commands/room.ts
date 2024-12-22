import { Room } from "../db";
import AppError from "../utils/appError";
import { comparePasswords } from "../utils/roomPassword";

export async function getMemeberOfRoom(roomName: string, memberName: string, password: string): Promise<boolean> {
    const room = await Room.scope("withPassword").findOne({
        where: {
            name: roomName
        },
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

    const passwordCorrect = await comparePasswords(password, room.password)
    if (!passwordCorrect) {
        throw new AppError("Incorrect passowrd", 400)
    }
 

    return true
}
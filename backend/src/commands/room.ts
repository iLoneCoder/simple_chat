import { Room } from "../db";
import AppError from "../utils/appError";

export async function getMemeberOfRoom(roomName: string, memberName: string): Promise<Room> {
    const room = await Room.findOne({
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

    return room
}
import { NextFunction, Request, Response } from "express";
import { Room, RoomMember, User } from "../db";
import AppError from "../utils/appError";
import { getMemeberOfRoom } from "../commands/room";
import { comparePasswords, hashPassword } from "../utils/roomPassword";

export async function createRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, password } = req.body

        if (!name) {
            throw new AppError("name is required", 400)
        }

        if (!password) {
            throw new AppError("password is required", 400)
        }

        const hashedPassword = await hashPassword(password)
        const room = await Room.create({ name, password: hashedPassword })

        res.status(201).json({
            status: "success",
            data: room
        })
    } catch (error) {
        next(error)
    }
}

export async function listRooms(req: Request, res: Response, next: NextFunction) {
    try {
        const rooms = await Room.findAll()

        res.status(200).json({
            status: "success",
            data: rooms
        })
    } catch (error) {
        next(error)
    }
}

export async function addMemberToRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId } = req.params
        const { password } = req.body

        if (!password) {
            throw new AppError("password is required", 400)
        }

        const room = await Room.scope("withPassword").findByPk(roomId)
        if (!room) {
            throw new AppError("Room not found", 404)
        }
        
        const passwordCorrect = await comparePasswords(password, room.password)

        if (!passwordCorrect) {
            throw new AppError("Incorrect password", 400)
        }

        await room.addMember(req.user.id)

        res.status(201).json({
            status: "success",
            data: "member added"
        })

    } catch (error) {
        next(error)
    }
}

export async function removeMemberFromRoom(req:Request, res:Response, next:NextFunction) {
    try {
        const { roomId } = req.params
        const { memberId, roomName, roomPassword } = req.body 

        if (!memberId) {
            throw new AppError("memberId is required", 400)
        }

        if (!roomName) {
            throw new AppError("roomName is required", 400)
        }

        if (!roomPassword) {
            throw new AppError("roomPassword is required", 400)
        }

        await getMemeberOfRoom(roomName, req.user.username, roomPassword)

        const room = await Room.findByPk(roomId)

        if (!room) {
            throw new AppError("Room not found", 404)
        }
        
        await room.removeMember(memberId)

        res.status(204).json()
    } catch (error) {
        next(error)
    }
}

export async function leaveRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId } = req.params
        const { roomName, roomPassword } = req.body
        
        if (!roomName) {
            throw new AppError("roomName is required", 400)
        }
        
        if (!roomPassword) {
            throw new AppError("roomPassword is required", 400)
        }

        await getMemeberOfRoom(roomName, req.user.username, roomPassword)

        const room = await req.user.removeRoom(+roomId)
        console.log(room)
        res.status(204).json()
    } catch (error) {
        next(error)
    }
}

export async function getRoomMembers(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId } = req.params
        const { roomPassword, roomName } = req.body

        if (!roomName) {
            throw new AppError("roomName is required", 400)
        }

        if (!roomPassword) {
            throw new AppError("roomPassword is required", 400)
        }

        await getMemeberOfRoom(roomName, req.user.username, roomPassword)

        const roomMembers = await Room.findByPk(roomId, { include: { association: "members", through: {attributes: []} }})

        if (!roomMembers) {
            throw new AppError("Room not found", 404)
        }
        
        res.status(200).json({
            status: "success",
            data: roomMembers
        })
    } catch (error) {
        next(error)
    }
}

export async function isMemberOfRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomName } = req.params
        const { password } = req.body

        if (!password) {
            throw new AppError("password is required", 400)
        }

        const room = await getMemeberOfRoom(roomName, req.user.username, password)

        res.status(200).json({
            status: "success",
            data: room
        })
    } catch (error) {
        next(error)
    }
}

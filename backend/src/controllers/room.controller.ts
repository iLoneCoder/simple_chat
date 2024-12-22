import { NextFunction, Request, Response } from "express";
import { Room, User } from "../db";
import AppError from "../utils/appError";
import { getMemeberOfRoom } from "../commands/room";
import { hashPassword } from "../utils/roomPassword";

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

        const room = await Room.findByPk(roomId)

        if (!room) {
            throw new AppError("Room not found", 404)
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

        const room = await Room.findByPk(roomId)

        if (!room) {
            throw new AppError("Room not found", 404)
        }
        
        await room.removeMember(req.user.id)

        res.status(204).json()
    } catch (error) {
        next(error)
    }
}

export async function getRoomMembers(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId } = req.params

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

        const room = await getMemeberOfRoom(roomName, req.user.username)

        res.status(200).json({
            status: "success",
            data: room
        })
    } catch (error) {
        next(error)
    }
}

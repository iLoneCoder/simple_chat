import { NextFunction, Request, Response } from "express";
import { Room, User } from "../db";

export async function createRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const { name } = req.body

        if (!name) {
            throw new Error("name is required")
        }

        const room = await Room.create({ name })

        res.status(201).json({
            status: "success",
            data: room
        })
    } catch (error) {
        next(error)
    }
}

export async function addMemberToRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const {roomId, memberId} = req.body

        const room = await Room.findByPk(roomId)
        const user = await User.findByPk(memberId)
        if (!room) {
            throw new Error("Room not found")
        }

        if (!user) {
            throw new Error("user not found")
        }

        
        await room.addMember(user)


        res.status(201).json({
            status: "success",
            data: "member added"
        })

    } catch (error) {
        next(error)
    }
}
import { NextFunction, Request, Response } from "express";
import { Room, RoomMember, User } from "../db";
import AppError from "../utils/appError";
import { getMemeberOfRoom } from "../commands/room";
import { comparePasswords, hashPassword } from "../utils/roomPassword";

export async function createRoom(req: Request, res: Response, next: NextFunction) {
    try {
        const { name, password, isProtected } = req.body

        if (!name) {
            throw new AppError("name is required", 400)
        }

        if (isProtected === undefined || isProtected === null) {
            throw new AppError("isProtected is required", 400)
        }

        if (isProtected && !password) {
            throw new AppError("password is required", 400)
        }

        let hashedPassword: string
        type Options = {
            name: string,
            isProtected: boolean,
            password: string | null
        }

        const options: Options = {
            name,
            isProtected,
            password: null
        }

        if (isProtected && password) {
            hashedPassword = await hashPassword(password)
            options.password = hashedPassword
        }

        const room = await Room.create(options)

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

        
        const room = await Room.scope("withPassword").findByPk(roomId)
        if (!room) {
            throw new AppError("Room not found", 404)
        }
        
        if (room.isProtected && !password) {
            throw new AppError("password is required", 400)
        }

        let passwordCorrect: boolean = false

        if (room.isProtected && password) {
            passwordCorrect = await comparePasswords(password, room.password)
        }

        if (room.isProtected && !passwordCorrect) {
            throw new AppError("Incorrect password", 400)
        }

        await room.addMemberWithCheck(req.user.id)

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
        const { memberId, roomPassword } = req.body 

        if (isNaN(+roomId)) {
            throw new AppError("roomId must be a number", 400)
        }

        if (!memberId) {
            throw new AppError("memberId is required", 400)
        }

        const room = await Room.scope("withPassword").findByPk(roomId, {
            include: {
                association: "members",
                where: {
                    id:  req.user.id
                },
                through: {
                    attributes: []
                }
            }
        })

        if (!room) {
            throw new AppError("Room not found", 404)
        }

        if (room.isProtected && !roomPassword) {
            throw new AppError("roomPassword is required", 400)
        }
        
        if (room.isProtected) {
            const passwordCorrect = await comparePasswords(roomPassword, room.password)

            if (!passwordCorrect) {
                throw new AppError("wrong password", 401)
            }
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

        const isMember = await RoomMember.findOne({ where: { roomId, memberId: req.user.id }})
        if (isMember) {
            await req.user.removeRoom(+roomId)
        }

        res.status(204).json()
    } catch (error) {
        next(error)
    }
}

export async function getRoomMembers(req: Request, res: Response, next: NextFunction) {
    try {
        const { roomId } = req.params
        const { roomPassword } = req.body

        if (isNaN(+roomId)) {
            throw new AppError("roomId must be number", 400)
        }

        await getMemeberOfRoom(+roomId, req.user.username, roomPassword)

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

export async function isMemberOfRoom(req: Request<any, any, {password: string}>, res: Response, next: NextFunction) {
    try {
        const { roomId } = req.params
        const { password } = req.body

        if (isNaN(+roomId)) {
            throw new AppError("roomId must be number", 400)
        }

        const room = await getMemeberOfRoom(+roomId, req.user.username, password)

        res.status(200).json({
            status: "success",
            data: room
        })
    } catch (error) {
        next(error)
    }
}

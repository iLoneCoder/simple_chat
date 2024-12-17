import { NextFunction, Request, Response } from "express";
import { User } from "../db";
import AppError from "../utils/appError";
import { hashPassword } from "../utils/roomPassword";

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, password, confirmPassword } = req.body

        if (!username) {
            throw new AppError("username is required", 400)
        }

        if (!password) {
            throw new AppError("password is required", 400)
        }

        if (!confirmPassword) {
            throw new AppError("confirmPassword is required", 400)
        }

        if (password !== confirmPassword) {
            throw new AppError("password and confirmPassword must match", 400)
        }

        const hashedPassword = await hashPassword(password)

        const user = await User.create({username, password: hashedPassword})

        res.status(201).json({
            status: "success",
            data: user
        })
    } catch (error) {
        next(error)
    }
}

export async function joinAsUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { username } = req.params
        
        const user = await User.findOne({
            where: {username},
            include: {
                association: "rooms",
                through: {
                    attributes: []
                }
            }
        })
       
        if (!user) {
            throw new AppError("User not found", 404)
        }

        res.status(200).json({
            status: "success",
            data: user
        })
    } catch (error) {
        next(error)
    }
}
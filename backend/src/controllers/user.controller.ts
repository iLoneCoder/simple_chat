import { NextFunction, Request, Response } from "express";
import { User } from "../db";
import AppError from "../utils/appError";

export async function createUser(req: Request, res: Response, next: NextFunction) {
    try {
        const { username } = req.body

        if (!username) {
            throw new Error("Username is required")
        }

        const user = await User.create({username})

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
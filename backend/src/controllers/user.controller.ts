import { NextFunction, Request, Response } from "express";
import { User } from "../db";

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
import { NextFunction, Request, Response } from "express";
import { User } from "../db";
import AppError from "../utils/appError";
import { comparePasswords, generateToken, hashPassword, verifyTokenAsync } from "../utils/roomPassword";

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

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const { username, password } = req.body

        if (!username) {
            throw new AppError("username is required", 400)
        }

        if (!password) {
            throw new AppError("password is required", 400)
        }

        const user = await User.scope("withPassword").findOne({where: { username }})

        if (!user) {
            throw new AppError("Username or Password incorrect", 400)
        }

        const passwordIsCorrect = await comparePasswords(password, user.password)

        if (!passwordIsCorrect) {
            throw new AppError("Username or Password incorrect", 400)
        }

        const token = await generateToken(username, user.id)
        
        res.status(200).json({
            status: "success",
            token
        })
    } catch (error) {
        next(error)
    }
}

export async function verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
        const {authorization} = req.headers

        if (!authorization) {
            throw new AppError("Unauthorized", 401)
        }

        const token = authorization.replace("Bearer ", "")
        if (!token) {
            throw new AppError("Unauthorized", 401)
        }

        const decoded = await verifyTokenAsync(token)
        const { id } = decoded
        
        const user = await User.findByPk(id)
        if (!user) {
            throw new AppError("Unauthorized", 401)
        }

        req.user = user

        next()
    } catch (error) {
        next(error)
    }
}

export async function listUsers(req: Request, res: Response, next:NextFunction) {
    try {
        const users = await User.findAll()

        res.status(200).json({
            status: "success",
            data: users
        })
    } catch (error) {
        next(error)
    }
}

export async function getUserDetails(req: Request, res: Response, next: NextFunction) {
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


export async function updateUser(req: Request<{username: string}, {}, {publicKey: string}>, res: Response, next: NextFunction) {
    try {
        const { username } = req.params
        const { publicKey } = req.body

        if (!username) {
            throw new AppError("username is required", 400)
        }

        if (!publicKey) {
            throw new AppError("publicKey is required", 400)
        }

        const user = await User.findOne({where: {username}})

        if (!user) {
            throw new AppError("User not found", 404)
        }

        await user.update({publicKey})

        res.status(204).json()
    } catch (error) {
        next(error)
    }
}
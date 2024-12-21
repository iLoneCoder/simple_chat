import * as express from "express"
import { User } from "../../src/db"

type SafeUser = Omit<User, "password">

declare global {
    namespace Express {
        interface Request {
            user: SafeUser
        }
    }
}
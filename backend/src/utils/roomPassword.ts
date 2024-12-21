import crypto from "crypto"
import util from "util"
import jwt from "jsonwebtoken"

const scrypt = util.promisify(crypto.scrypt)

function createSalt() {
    return crypto.randomBytes(16).toString("hex")
}

async function hashPassword(password: string, salt=createSalt()): Promise<string> {
    const hashedPassword = await scrypt(password, salt, 64) as Buffer

    return `${hashedPassword.toString("hex")}.${salt}`
}

async function comparePasswords(inputPassword: string, dbPassword: string): Promise<boolean> {
    const salt = dbPassword.split(".")[1]
    const hashedPassword = await hashPassword(inputPassword, salt)

    return hashedPassword === dbPassword
}

async function generateToken(username: string, id: number): Promise<string> {
    return new Promise((res, rej) => {
        const secret = process.env.SECRET || "secret"
        jwt.sign({
            username,
            id
        }, secret, {expiresIn: "7d"}, (err, token) => {
            if (err) rej(err)
            
            if (typeof token === "undefined") {
                rej(new Error("token not generated"))
                return
            } 
            
            res(token)
        })

    })
}

type decodedJWTType = {
    id: number,
    username: string,
    iat: number,
    exp: number
}

function verifyTokenAsync<T = decodedJWTType>(token: string): Promise<T> {
    return new Promise((res, rej) => {
        const secret = process.env.SECRET || "secret"
        jwt.verify(token, secret, (err, decoded) => {
            if (err) rej(err)
            
            res(decoded as T)
        })
    })
}

export {
    hashPassword,
    comparePasswords,
    generateToken,
    verifyTokenAsync
}
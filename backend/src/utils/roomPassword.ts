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

async function generateToken(username: string): Promise<string> {
    const secret = process.env.SECRET || "secret"
    const token = await jwt.sign({
        username
    }, secret, {expiresIn: "7d"})

    return token
}

export {
    hashPassword,
    comparePasswords,
    generateToken
}
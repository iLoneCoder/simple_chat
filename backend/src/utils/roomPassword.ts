import crypto from "crypto"
import util from "util"

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

    return hashedPassword === inputPassword
}


export {
    hashPassword,
    comparePasswords
}
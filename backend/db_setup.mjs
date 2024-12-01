import pkg from "pg"
import * as dotenv from "dotenv"
dotenv.config()

const { Client } = pkg

const PORT = process.env.DB_PORT && isNaN(+process.env.DB_PORT) ? process.env.DB_PORT : 5432
const databaseName = process.env.DB_NAME || "simple_chat"

const client = new Client({
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "1122",
    host: process.env.DB_HOST || "localhost",
    port: PORT
})

async function db_setup() {
    try {
        await client.connect()

        await client.query(`CREATE DATABASE ${databaseName}`)
        console.log(`Database with name ${databaseName} was created`)
    } catch (error) {
        console.log(error)        
    } finally {
        if (client) {
            await client.end()
        }
    }

}

db_setup()
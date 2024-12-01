import * as dotenv from "dotenv"
import { Dialect } from "sequelize"
dotenv.config()

const PORT = process.env.DB_PORT && isNaN(+process.env.DB_PORT) ? +process.env.DB_PORT : 5432
const databaseName = process.env.DB_NAME || "simple_chat"

const config = {
    development: {
        username: process.env.DB_USER || "postgres",
        password: process.env.DB_PASSWORD || "1122",
        host: process.env.DB_HOST || "localhost",
        port: PORT,
        database: databaseName,
        dialect: "postgres" as Dialect,
        logging: false
    }
}

export default config
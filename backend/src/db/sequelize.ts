import { Sequelize } from "sequelize";
import config from "./config";

let sequelize: Sequelize
const envinronment = process.env.NODE_ENV || "development"

function createSequelize() {
    if (!sequelize) {
        sequelize = new Sequelize(config[envinronment as keyof typeof config])
    }

    return sequelize
}

export default createSequelize()


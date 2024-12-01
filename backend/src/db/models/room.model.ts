import { Sequelize, Model, DataTypes } from "sequelize";
import sequelize from "../sequelize";

class Room extends Model {
    declare id: number
    declare name: string
}

Room.init({
    id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    sequelize,
    modelName: "Room",
    tableName: "rooms",
    createdAt: "created_at",
    updatedAt: "updated_at"
})

export default Room
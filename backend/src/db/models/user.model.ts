import { DataTypes, Model } from "sequelize";
import sequelize from "../sequelize";

class User extends Model {
    declare id: number
    declare username: string
}

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: true
    },
    username: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
},
{
    sequelize,
    modelName: "User",
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at"
})

export default User

import { DataTypes, Model, Association } from "sequelize";
import sequelize from "../sequelize";
import RoomMember from "./room_member.model";
import Room from "./room.model";

class User extends Model {
    declare id: number
    declare username: string
    declare RoomMembers: RoomMember[]
    declare Rooms: Room[]

    static associations: { 
        RoomMembers: Association<User, RoomMember>; 
        Room: Association<User, Room>; 
    }

    static associate() {
        this.belongsToMany(Room, { foreignKey: "memberId",  through: RoomMember})
        this.hasMany(RoomMember, { foreignKey: "memberId" })
    }
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

import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../sequelize";
import RoomMember from "./room_member.model";
import User from "./user.model";

class Room extends Model {
    declare id: number
    declare name: string
    declare RoomMembers: RoomMember[]
    declare Members: User[]

    static associations: { 
        RoomMembers: Association<Room, RoomMember>; 
        Members: Association<Room, User>; 
    }

    static associate() {
        this.belongsToMany(User, { foreignKey: "roomId", through: RoomMember })
        this.hasMany(RoomMember, { foreignKey: "roomId" })
    }
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
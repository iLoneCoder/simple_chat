import { Model, DataTypes, Association } from "sequelize";
import sequelize from "../sequelize";
import User from "./user.model";
import Room from "./room.model";

class RoomMember extends Model {
    declare id: number
    declare roomId: number
    declare memberId: number
    declare Rooms: Room[]
    declare Members: User[]
    static associations: { 
        Members: Association<RoomMember, User>
        Rooms: Association<RoomMember, Room>
    };

    static associate() {
        this.belongsTo(Room, {foreignKey: "id"})
        this.belongsTo(User, {foreignKey: "id"})
    }
}

RoomMember.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    roomId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "room_id"
    },
    memberId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: "member_id"
    }
}, {
    sequelize,
    modelName: "RoomMember",
    tableName: "room_members",
    createdAt: "created_at",
    updatedAt: "updated_at"
})


export default RoomMember
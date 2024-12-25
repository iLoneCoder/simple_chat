import { DataTypes, Model, Association, BelongsToManyGetAssociationsMixin, BelongsToManyRemoveAssociationMixin } from "sequelize";
import sequelize from "../sequelize";
import RoomMember from "./room_member.model";
import Room from "./room.model";

class User extends Model {
    declare id: number
    declare username: string
    declare password: string
    declare RoomMembers: RoomMember[]
    // declare Rooms: Room[]
    declare rooms: Room[]

    declare getRooms: BelongsToManyGetAssociationsMixin<Room>
    declare removeRoom: BelongsToManyRemoveAssociationMixin<Room, number>
    
    static associations: { 
        RoomMembers: Association<User, RoomMember>; 
        // Room: Association<User, Room>;
        rooms: Association<User, Room>
    }

    static associate() {
        this.belongsToMany(Room, { foreignKey: "memberId", otherKey: "roomId", through: RoomMember, as: "rooms"})
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
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
},
{
    sequelize,
    modelName: "User",
    tableName: "users",
    createdAt: "created_at",
    updatedAt: "updated_at",
    defaultScope: {
        attributes: {
            exclude: ["password"]
        }
    },
    hooks: {
        afterCreate: (user: User) => {
            if (user.dataValues) {
                delete user.dataValues.password
            }
        }
    },
    scopes: {
        withPassword: {
            attributes: {
                include: ["password"]
            }
        }
    }
})

export default User

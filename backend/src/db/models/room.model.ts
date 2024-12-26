import { 
    Model, 
    DataTypes, 
    Association, 
    BelongsToManyAddAssociationMixin, 
    BelongsToManyGetAssociationsMixin, 
    BelongsToManyRemoveAssociationMixin } from "sequelize";
import sequelize from "../sequelize";
import RoomMember from "./room_member.model";
import User from "./user.model";

class Room extends Model {
    declare id: number
    declare name: string
    declare password: string
    declare isProtected: boolean
    declare RoomMembers: RoomMember[]
    // declare Members: User[]
    declare members: User[]

    // Association methods
    declare addMember: BelongsToManyAddAssociationMixin<User, number>;
    declare getMembers: BelongsToManyGetAssociationsMixin<User>;
    declare removeMember: BelongsToManyRemoveAssociationMixin<User, number>

    static associations: { 
        RoomMembers: Association<Room, RoomMember>; 
        // Members: Association<Room, User>; 
        members: Association<Room, User>; 
    }

    static associate() {
        this.belongsToMany(User, { foreignKey: "roomId", otherKey: "memberId", through: RoomMember, as: "members" })
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
    },
    password: {
        type: DataTypes.STRING,
        allowNull: true
    },
    isProtected: {
        type: DataTypes.BOOLEAN,
        allowNull: true,
        field: "is_protected"
    }
},
{
    sequelize,
    modelName: "Room",
    tableName: "rooms",
    createdAt: "created_at",
    updatedAt: "updated_at",
    defaultScope: {
        attributes: {
            exclude: [ "password" ]
        }
    },
    hooks: {
        afterCreate: (user) => {
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

export default Room
import User from "./models/user.model";
import Room from "./models/room.model";
import RoomMember from "./models/room_member.model";

User.associate()
Room.associate()
RoomMember.associate()

export {
    User,
    Room,
    RoomMember
}
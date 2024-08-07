import mongoose from "mongoose";

const UserSchema= new mongoose.Schema({
    username:String,
    name:String,
    password: String

})
const UserModel= mongoose.model("users", UserSchema)

export default UserModel;
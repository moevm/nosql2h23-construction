const mongoose = require('mongoose');

const User = new mongoose.Schema({
    username: String,
    password: String,
    role: String,
    avatar: {
        _id: false,
        name: String, 
        content: Buffer,
        type: String
    }
}, { typeKey: '$type' });

const UserModel = mongoose.model("Users", User);

async function mongoGetUsers(){
    return await UserModel.find({}).lean();
}

async function mongoFindUser(data){
    return UserModel.find(data)
}

async function mongoAddUser(username, password, role, avatar){
    await UserModel.insertMany(
        [
            {
                username: username,
                password: password,
                role: role,
                avatar:   avatar
            }]).then(console.log("User added successfully"));
}

module.exports = {mongoGetUsers, mongoFindUser, mongoAddUser}
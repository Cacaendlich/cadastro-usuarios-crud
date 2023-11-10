import mongoose, { Schema } from 'mongoose';

const UsersSchema = new Schema({
    email : {type : String, required : true},
    senha : {type : String, required : true}
});

export const UserModel = (mongoose.models.users || mongoose.model('users', UsersSchema));
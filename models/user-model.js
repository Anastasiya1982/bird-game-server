const {Schema, model} = require('mongoose');

const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    name: {type: String,default:""},
    isActivated: {type: Boolean, default: false},
    activationLink: {type: String},
    avatar: {type: String, default: ""}
});

module.exports = model('User', UserSchema);

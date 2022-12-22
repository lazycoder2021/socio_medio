const mongoose = require('mongoose'); 

const userSchema = mongoose.Schema({
    name: {
        type: String, 
        required: true
    }, 
    password: {
        type: String, 
        required: true
    }, 
    following: [], 
    followers: [], 
    bio: {
        type: String, 
        default: 'No bio added'
    }, 
    profile: {
        type: String, 
        required: false
    }
})

const User = mongoose.model('User', userSchema); 

module.exports = User; 

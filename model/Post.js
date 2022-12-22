const mongoose = require('mongoose'); 

const postSchema = mongoose.Schema({
    title: {
        type: String, 
        required: true
    }, 
    body: {
        type: String,
        required: true
    }, 
    userId: {
        type: String, 
        required: true
    }, 
    likes: {
        type: Number, 
        required: false, 
        default:'0'
    }, 
    comments: [], 
    postImage: {
        type: String, 
        required:false
    }
})

const Post = mongoose.model('Post', postSchema); 

module.exports = Post; 



import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


const postSchema = new mongoose.Schema({
    author: {type: String, required: true, unique: false},
    content: {type: String, required: true, unique: false},
    date: {type: String, required: true, unique: false},
    time: {type: String, required: true, unique: false},
    likes: {type: Number, required: true, unique: false},
    likedBy: [String]
}, {
    collection: 'post'
});

postSchema.plugin(uniqueValidator);

const PostModel = mongoose.model('post', postSchema);

module.exports = PostModel;

export default {
    model: PostModel
};
import mongoose from 'mongoose';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';
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


// async function authorizeAuthor(author) {
//     const result = await PostModel.find({author: author});
//     if (result && mongoConverter(result)) {
//         return result;
//     } else {
//         return false;
//     }
//     throw applicationException.new(applicationException.UNAUTHORIZED, 'author does not match');
// }

module.exports =  PostModel;

export default {
    //getByAuthor: getByAuthor,
    model: PostModel,
    // authorizeAuthor: authorizeAuthor
};
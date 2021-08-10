import mongoose from 'mongoose';
import * as _ from 'lodash';
import Promise from 'bluebird';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';
import uniqueValidator from 'mongoose-unique-validator';


const userRole = {
    admin: 'admin',
    user: 'user'
};

const userRoles = [userRole.admin, userRole.user];

const postSchema = new mongoose.Schema({
    author: {type: String, required: true, unique: false},
    content: {type: String, required: true, unique: false},
    date: {type: String, required: true, unique: false},
    time: {type: String, required: true, unique: false},
    likes: {type: Number, required: true, unique: false},
}, {
    collection: 'post'
});

postSchema.plugin(uniqueValidator);

const PostModel = mongoose.model('post', postSchema);


// async function getByAuthor(name) {
//     const result = await PostModel.find({author: name});
//     if (result) {
//         return mongoConverter(result);
//     }
//     throw applicationException.new(applicationException.NOT_FOUND, 'Post not found');
// }

async function authorizeAuthor(author) {
    console.log('authorizeAuthor');
    const result = await PostModel.find({author: author});
    console.log('result ' + result);
    if (result && mongoConverter(result)) {
        return result;
    } else {
        return false;
    }
    throw applicationException.new(applicationException.UNAUTHORIZED, 'author does not match');
}

export default {
    //getByAuthor: getByAuthor,
    userRole: userRole,
    model: PostModel,
    authorizeAuthor: authorizeAuthor
};
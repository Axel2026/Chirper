import mongoose from 'mongoose';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';
import uniqueValidator from 'mongoose-unique-validator';


const messageSchema = new mongoose.Schema({
    author: {type: String, required: true, unique: false},
    content: {type: String, required: true, unique: false},
    time: {type: String, required: true, unique: false}
}, {
    collection: 'message'
});

messageSchema.plugin(uniqueValidator);

const MessageModel = mongoose.model('message', messageSchema);


// async function authorizeAuthor(author) {
//     const result = await MessageModel.find({author: author});
//     if (result && mongoConverter(result)) {
//         return result;
//     } else {
//         return false;
//     }
//     throw applicationException.new(applicationException.UNAUTHORIZED, 'author does not match');
// }

module.exports =  MessageModel;

export default {
    //getByAuthor: getByAuthor,
    // userRole: userRole,
    model: MessageModel,
    // authorizeAuthor: authorizeAuthor
};
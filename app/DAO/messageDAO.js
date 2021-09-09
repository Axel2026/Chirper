import mongoose from 'mongoose';
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

module.exports = MessageModel;

export default {
    model: MessageModel,
};
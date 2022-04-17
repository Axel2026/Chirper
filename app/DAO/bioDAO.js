import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


const bioSchema = new mongoose.Schema({
    userId: {type: String, required: true, unique: true},
    content: {type: String, required: true, unique: false},
}, {
    collection: 'bio'
});

bioSchema.plugin(uniqueValidator);

const BioModel = mongoose.model('bio', bioSchema);

module.exports = BioModel;

export default {
    model: BioModel
};

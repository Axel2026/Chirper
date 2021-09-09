import mongoose from 'mongoose';
import * as _ from 'lodash';
import Promise from 'bluebird';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';
import uniqueValidator from 'mongoose-unique-validator';


const userSchema = new mongoose.Schema({
    nickname: {type: String, required: true, unique: true},
    email: {type: String, required: true, unique: true},
    name: {type: String, required: false, unique: false},
    surname: {type: String, required: false, unique: false},
    isAdmin: {type: Boolean, default: true, required: true},
    birthday: {type: String, required: true, unique: false}
}, {
    collection: 'user'
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('user', userSchema);

function createNewOrUpdate(user) {
    return Promise.resolve().then(() => {
        if (!user.id && findByEmailOrNickname(user.email, user.nickname)) {
            return new UserModel(user).save().then(result => {
                if (result) {
                    return mongoConverter(result);
                }else{
                }
            });
        } else {
            return UserModel.findByIdAndUpdate(user.id, _.omit(user, 'id'), {new: true});
        }
    }).catch(error => {
        if ('ValidationError' === error.name) {
            throw applicationException.new(applicationException.BAD_REQUEST, error.message);
        }
        throw error;
    });
}

async function getByEmailOrName(name) {
    const result = await UserModel.findOne({$or: [{email: name}, {name: name}]});
    if (result) {
        return mongoConverter(result);
    }
    throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
}


async function findByEmailOrNickname(email,nickname) {
    const result = await UserModel.findOne({$or: [{email: email}, {nickname: nickname}]});
    if (result) {
        return true;
    }else{
        console.log("User with that email or nickname already exists!")
        return false;
    }
}

async function removeById(id) {
    return await UserModel.findByIdAndRemove(id);
}

export default {
    createNewOrUpdate: createNewOrUpdate,
    getByEmailOrName: getByEmailOrName,
    findByEmailOrNickname: findByEmailOrNickname,
    removeById: removeById,
    model: UserModel
};

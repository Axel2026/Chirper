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
    // password: {type: String, required: true, unique: false},
    isAdmin: {type: Boolean, default: true, required: true},
    birthday: {type: String, required: true, unique: false}
}, {
    collection: 'user'
});

userSchema.plugin(uniqueValidator);

const UserModel = mongoose.model('user', userSchema);

function createNewOrUpdate(user) {
    console.log('createXXX 1')
    return Promise.resolve().then(() => {
        if (!user.id && findByEmailOrNickname(user.email, user.nickname)) {
            console.log('user.email ' + user.email)
            console.log('user.nickname ' + user.nickname)
            console.log('createXXX 2')
            return new UserModel(user).save().then(result => {
                console.log('createXXX 2.5')
                if (result) {
                    console.log('createXXX 3')
                    return mongoConverter(result);
                }else{
                    console.log('createXXX 69')
                }
            });
        } else {
            console.log('createXXX 4')
            return UserModel.findByIdAndUpdate(user.id, _.omit(user, 'id'), {new: true});
        }
    }).catch(error => {
        console.log('createXXX 5 blad')
        if ('ValidationError' === error.name) {
            // error = error.errors[Object.keys(error.errors)[0]];
            throw applicationException.new(applicationException.BAD_REQUEST, error.message);
        }
        throw error;
    });
}

async function getByEmailOrName(name) {
    const result = await UserModel.findOne({$or: [{email: name}, {name: name}]});
    if (result) {
        console.log('przechodzi get by email or name')
        return mongoConverter(result);
    }
    throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
}


async function findByEmailOrNickname(email,nickname) {
    const result = await UserModel.findOne({$or: [{email: email}, {nickname: nickname}]});
    if (result) {
        return true;
    }else{
        alert("Taki nick lub email już istnieje!")
        return false;
    }
}


// async function get(id) {
//   const result = await UserModel.findOne({ _id: id });
//   if (result) {
//     return mongoConverter(result);
//   }
//   throw applicationException.new(applicationException.NOT_FOUND, 'User not found');
// }

async function removeById(id) {
    return await UserModel.findByIdAndRemove(id);
}

export default {
    createNewOrUpdate: createNewOrUpdate,
    getByEmailOrName: getByEmailOrName,
    findByEmailOrNickname: findByEmailOrNickname,
    //get: get,
    removeById: removeById,
    model: UserModel
};

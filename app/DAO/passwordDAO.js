import mongoose from 'mongoose';
import * as _ from 'lodash';
import applicationException from '../service/applicationException';
import mongoConverter from '../service/mongoConverter';


const passwordSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true },
  password: { type: String, required: true }
}, {
  collection: 'password'
});

const PasswordModel = mongoose.model('password', passwordSchema);

async function createOrUpdate(data) {
  const result = await PasswordModel.findOneAndUpdate({ userId: data.userId }, _.omit(data, 'id'), { new: true });
  if (!result) {
    const result = await new PasswordModel({ userId: data.userId, password: data.password }).save();
    if (result) {
      return mongoConverter(result);
    }
  }
  return result;
}

async function authorize(email, password) {
  console.log('testowanie1')
  const result = await PasswordModel.findOne({ email: email, password: password });
  console.log('testowanie2')
  if (result && mongoConverter(result)) {
    console.log('testowanie2.5')
    return true;
  }
  console.log('testowanie3')
  throw applicationException.new(applicationException.UNAUTHORIZED, 'User and password does not match');
}


export default {
  createOrUpdate: createOrUpdate,
  authorize: authorize,

  model: PasswordModel
};

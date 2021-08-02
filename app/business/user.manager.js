import PasswordDAO from '../DAO/passwordDAO';
import TokenDAO from '../DAO/tokenDAO';
import UserDAO from '../DAO/userDAO';
import applicationException from '../service/applicationException';
import sha1 from 'sha1';

function create(context) {

  function hashString(password) {
    return sha1(password);
  }

  async function authenticate(email, password) {
    console.log('test1')
    let userData;
    const user = await UserDAO.getByEmailOrName(email);
    console.log('test2')
    if (!user) {
      throw applicationException.new(applicationException.UNAUTHORIZED, 'User with that email does not exist');
    }
    console.log('test2.5')
    userData = await user;
    console.log('test2.6')
    //await PasswordDAO.authorize(user.id, hashString(password));
    await PasswordDAO.authorize(email, password);
    console.log('test2.7')
    const token = await TokenDAO.create(userData);
    console.log('test3')
    return getToken(token);

  }

  function getToken(token) {
    return {token: token.value};
  }

  async function createNewOrUpdate(userData) {
    const user = await UserDAO.createNewOrUpdate(userData);
    if (await userData.password) {
      return await PasswordDAO.createOrUpdate({userId: user.id, password: hashString(userData.password)});
    } else {
      return user;
    }
  }

  async function removeHashSession(userId) {
    return await TokenDAO.remove(userId);
  }

  return {
    authenticate: authenticate,
    createNewOrUpdate: createNewOrUpdate,
    removeHashSession: removeHashSession
  };
}

export default {
  create: create
};

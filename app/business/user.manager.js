import PasswordDAO from '../DAO/passwordDAO';
import TokenDAO from '../DAO/tokenDAO';
import UserDAO from '../DAO/userDAO';
import PostDAO from '../DAO/postDAO';
import applicationException from '../service/applicationException';
import sha1 from 'sha1';
import * as logger from "mongoose";
import * as db from "mongodb";
import * as MongoClient from "mongodb";
import * as res from "express";
import userDAO from "../DAO/userDAO";

function create(context) {

    let userArray = [8];

    function hashString(password) {
        return sha1(password);
    }

    function fetchAll() {
        MongoClient.connect('mongodb+srv://admin:12345@cluster0.r6n5m.mongodb.net/usersdb', function (err, db) {
            if (err) throw err;

            let coll = db.collection('post');

            coll.find({}).toArray(function (err, result) {
                if (err) {
                    res.send(err);
                } else {

                    res.send(JSON.stringify(result));
                }
            })

        });
    }

    function getValues() {
        return {
            first: getFirstValue(),
            second: getSecondValue(),
        };
    }

    async function authenticate(email, password) {
        let userData;
        const user = await UserDAO.getByEmailOrName(email);
        if (!user) {
            throw applicationException.new(applicationException.UNAUTHORIZED, 'User with that email does not exist');
        }
        userData = await user;
        await PasswordDAO.authorize(user.id, hashString(password));
        // await PasswordDAO.authorize(email, password);
        const token = await TokenDAO.create(userData);

        // for (let i = 0; i < user.length; i++) {
        //     userArray[i] = JSON.stringify(user[i]);
        // }
        // user.push({key: token, value: getToken(token)});
        // userArray[7] = getToken(token);

        console.log('użytkownik istnieje w bazie')
        return {
            token: getToken(token),
            user: user
        };

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
        removeHashSession: removeHashSession,
        fetchAll: fetchAll,
    };
}

export default {
    create: create
};

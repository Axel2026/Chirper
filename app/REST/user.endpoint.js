import business from '../business/business.container';
import applicationException from '../service/applicationException';
import auth from '../middleware/auth';
import config from '../config.js';
import convert from '../service/mongoConverter.js';

const PostModel = require('../DAO/postDAO');
const MessageModel = require('../DAO/messageDAO');
const userEndpoint = (router) => {

    router.post('/api/user/auth', async (request, response) => {
        try {
            let result = await business.getUserManager(request).authenticate(request.body.email, request.body.password);

            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });


    router.get('/api/feed/posts', (req, res) => {
        PostModel.find({})
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    });

    router.get('/api/feed/chat', (req, res) => {
        MessageModel.find({})
            .then((data) => {
                res.json(data);
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    });

    router.post('/api/feed/save', (req, res) => {

        var date = new Date();
        console.log('aktualna data: ' +  date);

        //date.setMonth(date.getMonth()+1 );
        //console.log('aktualna data0,5: ' +  date);
        if (date.getMonth() < 10) {
            var month = date.getMonth()+1
            if(date.getDate() < 10) {
                var dateString = "0" + date.getDate() + "." + "0" + month + "." + date.getFullYear();
            }else{
                var dateString = date.getDate() + "." + "0" + month + "." + date.getFullYear();
            }
        } else {
            var month = date.getMonth()+1
            if(date.getDate() < 10) {
                var dateString = "0" + date.getDate() + "." + month + "." + date.getFullYear();
            }else{
                var dateString = date.getDate() + "." + month + "." + date.getFullYear();
            }
        }
        console.log('aktualna data2: ' +  dateString);

        if (date.getMinutes() < 10) {
            var timeString = date.getHours() + ":0" + date.getMinutes()
        } else {
            var timeString = date.getHours() + ":" + date.getMinutes()
        }

        console.log('REQ BODY LIKES ' + req.body.likes)
        const newPostModel = new PostModel({
            author: req.body.author,
            content: req.body.content,
            date: dateString,
            time: timeString,
            likes: req.body.likes,
            likedBy: []
        });

        newPostModel.save((error) => {
            if (error) {
                res.status(500).json({msg: 'Sorry, internal server errors'});
                return;
            }
            return res.json({
                msg: 'Your data has been saved!'
            });
        });
    });


    router.post('/api/feed/send', (req, res) => {

        var date = new Date();

        if (date.getMinutes() < 10) {
            var timeString = date.getHours() + ":0" + date.getMinutes()
        } else {
            var timeString = date.getHours() + ":" + date.getMinutes()
        }
        const newMessageModel = new MessageModel({
            author: req.body.author,
            content: req.body.content,
            time: timeString,
        });

        newMessageModel.save((error) => {
            if (error) {
                res.status(500).json({msg: 'Sorry, internal server errors'});
                return;
            }
            return res.json({
                msg: 'Your data has been saved!'
            });
        });
    });

    router.post('/api/feed/update', (req, res) => {

        var numberOfLikes = 0;
        PostModel.find({_id: req.body.postId}, {_id: 0, likes: 1, likedBy: 2, author: 3})
            .then((data) => {
                var actionLikes;
                if (!req.body.isLiked) {
                    actionLikes = 1
                    // data[0].likedBy.push(data[0].author)
                    data[0].likedBy.push(req.body.nickname)
                    console.log("TABLICA OSÓB LUBIĄCYCH: " + data[0].likedBy)
                } else {
                    actionLikes = -1;
                    // data[0].likedBy.remove(data[0].author)
                    data[0].likedBy.remove(req.body.nickname)
                    console.log("TABLICA OSÓB LUBIĄCYCH: " + data[0].likedBy)
                }
                data[0].likes += actionLikes;
                numberOfLikes = data[0].likes;

                var myQuery = {_id: req.body.postId};
                var newValues = {$set: {likes: numberOfLikes, likedBy: data[0].likedBy}};

                PostModel.updateOne(myQuery, newValues, function (err, res) {
                    if (err) throw err;
                });
                res.status(200).send(data[0]);
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    });


    ////////od niego /////////////

    router.post('/api/user/create', async (request, response, next) => {
        try {
            const result = await business.getUserManager(request).createNewOrUpdate(request.body);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    router.delete('/api/user/logout/:userId', auth, async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).removeHashSession(request.body.userId);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });


};

export default userEndpoint;

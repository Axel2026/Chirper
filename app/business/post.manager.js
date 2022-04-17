import moment from "moment";
import postDAO from "../DAO/postDAO";

const PostModel = require('../DAO/postDAO');

function postManager() {

    function getCurrentDate() {
        return moment().format('DD[.]MM[.]YYYY');
    }

    function getCurrentTime() {
        return moment().format('HH:mm:ss');
    }

    function savePost(postInfo, response) {
        let currentDate = getCurrentDate()
        let currentTime = getCurrentTime()

        const newPostModel = new PostModel({
            userId: postInfo.body.userId,
            content: postInfo.body.content,
            date: currentDate,
            time: currentTime,
            likedBy: []
        });

        newPostModel.save((error) => {
            if (error) {
                console.log(error)
                response.status(500).json({msg: 'Sorry, internal server errors'});
                return;
            }
            console.log("Successfully added a post!")
            return response.json({
                msg: 'Your data has been saved!'
            });
        });
    }

    function getPosts(response) {
        PostModel.find({})
            .then((data) => {
                response.json(data);
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    }

    function getUserPosts(userId, response) {
        PostModel.find({userId: userId})
            .then((data) => {
                response.json(data);
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    }

    function deletePost(id) {
        try {
            postDAO.deleteOne({_id: id})
                .then(response => {
                    console.log("Successfully deleted " + response.deletedCount + " post")
                })
        } catch (error) {
            console.warn(error)
        }
    }

    function updateLikes(postInfo, response) {

        PostModel.find({_id: postInfo.body.postId}, {_id: 0, likedBy: 1, userId: 2})
            .then((data) => {
                if (!postInfo.body.isLiked) {
                    data[0].likedBy.push(postInfo.body.userId)
                } else {
                    data[0].likedBy.remove(postInfo.body.userId)
                }

                let postId = {_id: postInfo.body.postId};
                let updatedValues = {$set: {likedBy: data[0].likedBy}};

                PostModel.updateOne(postId, updatedValues, function (err) {
                    if (err) throw err;
                });
                response.status(200).send(data[0]);
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    }

    function getHotPosts(response) {
        PostModel.find().sort({"likedBy": -1}).limit(5)
            .then((data) => {
                response.json(data.sort(function (a, b) {
                    return b.likedBy.length - a.likedBy.length;
                }));
            })
            .catch((error) => {
                console.log('error: ', error);
            });
    }

    return {
        savePost: savePost,
        updateLikes: updateLikes,
        getPosts: getPosts,
        deletePost: deletePost,
        getUserPosts: getUserPosts,
        getHotPosts: getHotPosts
    };
}

export default {
    postManager: postManager
};

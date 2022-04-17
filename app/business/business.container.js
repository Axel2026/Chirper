import postManager from './post.manager';
import userManager from './user.manager';

function getPostManager(manager, request) {
    return function () {
        return manager.postManager(request, this);
    };
}

function getUserManager(manager, request) {
    return function () {
        return manager.userManager(request, this);
    };
}

export default {
    getPostManager: getPostManager(postManager),
    getUserManager: getUserManager(userManager)
};

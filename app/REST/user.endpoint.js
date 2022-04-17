import business from '../business/business.container';

const userEndpoint = (router) => {

    router.get('/api/feed/posts', (req, res) => {
        business.getPostManager().getPosts(res)
    });

    router.get('/api/feed/userposts/:id', (req, res) => {
        business.getPostManager().getUserPosts(req.params.id, res)
    });

    router.post('/api/feed/save', (req, res) => {
        business.getPostManager().savePost(req, res)
    });

    router.post('/api/feed/updatelikes', (req, res) => {
        business.getPostManager().updateLikes(req, res)
    });

    router.delete('/api/feed/deletepost/:id', (req) => {
        business.getPostManager().deletePost(req.params.id)
    });

    router.get('/api/posts/hotposts', (req, res) => {
        business.getPostManager().getHotPosts(res)
    });

    router.get('/api/user/getinfo/:id', (req, res) => {
        business.getUserManager().getUserInfo(req.params.id, res)
    });

    router.get('/api/user/getbio/:id', (req, res) => {
        business.getUserManager().getUserBio(req.params.id, res)
    });

    router.put('/api/user/editbio', (req, res) => {
        business.getUserManager().editUserBio(req, res)
    });
};

export default userEndpoint;

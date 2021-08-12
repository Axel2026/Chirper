import business from '../business/business.container';
import applicationException from '../service/applicationException';
import admin from '../middleware/admin';
import auth from '../middleware/auth';
import PostDAO from '../DAO/postDAO';

const userEndpoint = (router) => {
    router.post('/api/user/auth', async (request, response) => {
        try {
            let result = await business.getUserManager(request).authenticate(request.body.email, request.body.password);
            response.status(200).send(result);
            console.log('result ' + JSON.stringify(result))
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    router.post('/api/feed/posts', async (request, response) => {
        try {
            let result = await PostDAO.authorizeAuthor(request.body.author);
            response.status(200).send(result);
            console.log('result ' + JSON.stringify(result))
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });






    ////////od niego /////////////

    router.post('/api/user/create', async (request, response, next) => {
        try {
            console.log('create 1')
            const result = await business.getUserManager(request).createNewOrUpdate(request.body);
            console.log('create 2')
            response.status(200).send(result);
            console.log('create 3')
        } catch (error) {
            console.log('create 4 blad')
            applicationException.errorHandler(error, response);
        }
    });

    router.delete('/api/user/logout/:userId', auth,  async (request, response, next) => {
        try {
            let result = await business.getUserManager(request).removeHashSession(request.body.userId);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });


};

export default userEndpoint;

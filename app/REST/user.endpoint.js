import business from '../business/business.container';
import applicationException from '../service/applicationException';
import admin from '../middleware/admin';
import auth from '../middleware/auth';

const userEndpoint = (router) => {
    router.post('/api/user/auth', async (request, response, next) => {
        console.log('dalalaldlalwaldwaldwalwadladwadlwladwaldwlawdlawdadlw');
        try {
            console.log('request.body.email ' + request.body.email);
            console.log('request.body.password ' + request.body.password);
            let result = await business.getUserManager(request).authenticate(request.body.email, request.body.password);
            console.log('result ' + result);
            response.status(200).send(result);
        } catch (error) {
            applicationException.errorHandler(error, response);
        }
    });

    router.post('/api/user/create', async (request, response, next) => {
        try {
            const result = await business.getUserManager(request).createNewOrUpdate(request.body);
            response.status(200).send(result);
        } catch (error) {
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

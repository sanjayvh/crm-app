const authController = require("./../controllers/auth.controller");
const { verifyUserReqBody } = require("./../middlewares");

module.exports = function(app) {
    app.post('/crm/api/v1/auth/signup', [verifyUserReqBody.validateUserReqBody], authController.signup);
    app.post('/crm/api/v1/auth/signin', authController.signin);
}
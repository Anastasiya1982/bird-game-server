const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../api-error');
const TIME = 30 * 24 * 60 * 60 * 1000;

function sendErrorResponse(res, err) {
    return res.status(400).send({
        msg: err
    })
}


class UserController {
    async registration(req, res, next) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest("Validation error", errors.array()));
            }
            const {email, password} = req.body;
            const userData = await userService.registration(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: TIME, httpOnly: true});
            return res.json(userData);
        } catch (err) {
              sendErrorResponse(res,err)
               }
        }


    async login(req, res, next) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);
        } catch (err) {
            sendErrorResponse(res,err)
        }

    }

    async logout(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token)
        } catch (err) {
            sendErrorResponse(res,err)
        }
    }

    async refresh(req, res, next) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 60 * 1000, httpOnly: true});
            return res.json(userData);

        } catch (err){
            sendErrorResponse(res,err)
        }
    }

    async activate(req, res, next) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL + '/login');
        } catch (err) {
            sendErrorResponse(res,err)
        }
    }

    async getUsers(req, res, next) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (err) {
            sendErrorResponse(res,err)
        }
    }

    async updateUser(req, res, next) {
        try {
            const userId = req.params.id;
        } catch (err) {
            sendErrorResponse(res,err)
        }
    }

}

module.exports = new UserController();

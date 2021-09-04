const userService = require('../service/user-service');
const {validationResult} = require('express-validator');
const ApiError = require('../api-error');
const MONTH_IN_MS = 30 * 24 * 60 * 60 * 1000;

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
            const {name, email, password} = req.body;
            const userData = await userService.registration(name, email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: MONTH_IN_MS, httpOnly: true});
            return res.json(userData);
        } catch (err) {
            sendErrorResponse(res, err)
        }
    }


    async login(req, res) {
        try {
            const {email, password} = req.body;
            const userData = await userService.login(email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: MONTH_IN_MS, httpOnly: true});
            return res.json(userData);
        } catch (err) {
            sendErrorResponse(res,err)
        }

    }

    async logout(req, res) {
        try {
            const {refreshToken} = req.cookies;
            const token = await userService.logout(refreshToken);
            res.clearCookie('refreshToken');
            return res.json(token)
        } catch (err) {
            sendErrorResponse(res,err)
        }
    }

    async refresh(req, res) {
        try {
            const {refreshToken} = req.cookies;
            const userData = await userService.refresh(refreshToken);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: MONTH_IN_MS, httpOnly: true});

            return res.json(userData);

        } catch (err){
            sendErrorResponse(res,err)
        }
    }

    async activate(req, res) {
        try {
            const activationLink = req.params.link;
            await userService.activate(activationLink);
            return res.redirect(process.env.CLIENT_URL + '/login');
        } catch (err) {
            sendErrorResponse(res,err)
        }
    }

    async getUsers(req, res) {
        try {
            const users = await userService.getAllUsers();
            return res.json(users);
        } catch (err) {
            sendErrorResponse(res,err)
        }
    }

    async getOneUser(req,res){
        try{
            res.send("show user"+ req.params.id);
        }
        catch (err) {
           sendErrorResponse(res,err)
        }
    }
    async editUser(req,res){
        try {
            res.send("Edit user"+ req.params.id)
        } catch  (err) {
            sendErrorResponse(res,err)
        }
    }

    async updateUser(req, res) {
        try {
            const userId = req.params.id;
            const {id, name, email, password} = req.body;
            const userData=await userService.updateUser(id,name,email, password);
            res.cookie('refreshToken', userData.refreshToken, {maxAge: MONTH_IN_MS, httpOnly: true});
            return res.json(userData);
        } catch (err) {
            sendErrorResponse(res,err)
        }
    }

}

module.exports = new UserController();

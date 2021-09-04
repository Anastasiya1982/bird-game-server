const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('../service/token-service');
const UserDto = require('../dto/user-dto');
const ApiError = require('../api-error');


class UserService {
    async registration(name,email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`The user with email ${email} is already exist`);
        }
        const activationLink = uuid.v4();
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({name:name, email, password: hashPassword, activationLink});
        await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user);// id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async activate(activationLink) {
        try {
            const user = await UserModel.findOne({activationLink});
            if (!user) {
                throw ApiError.BadRequest("Incorrect activation link")
            }
            user.isActivated = true;
            await user.save();
        } catch (e) {
            console.log(e)
        }

    }

    async login(email, password) {
        const user = await UserModel.findOne({email});
        if (!user) {
            throw ApiError.BadRequest('the user was not found');
        }
        const isPasswordEqual = await bcrypt.compare(password, user.password);
        if (!isPasswordEqual) {
            throw ApiError.BadRequest("The password is not correct");
        }
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async logout(refreshToken) {
        const token = await tokenService.removeToken(refreshToken);
        return token;
    }

    async refresh(refreshToken) {
        if (!refreshToken) {
            throw ApiError.UnauthorizedError();
        }
        const userData = tokenService.validateRefreshToken(refreshToken);
        const isTokenInDB = await tokenService.findToken(refreshToken);
        if (!isTokenInDB || !userData) {
            throw ApiError.UnauthorizedError();
        }
        const user = await UserModel.findById(userData.id);
        const userDto = new UserDto(user);
        const tokens = tokenService.generateTokens({...userDto});

        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto}
    }

    async getAllUsers() {
        const users = await UserModel.find();
        return users;
    }

    async updateUser(id,name,email,password) {
        try {
           let hashPassword;
           if(password){
               hashPassword = await bcrypt.hash(password, 10);
           }
            let update = {name:name, email: email};
           if(hashPassword){
               update={
                   ...update,
                   password: hashPassword
               }
           }
            const option = {new: true} //will return updated document

            const user = await UserModel.findByIdAndUpdate(id, update, option);
            if (!user) {
                  throw ApiError.BadRequest('the user was not found');
                  }
            const userDto = new UserDto(user);// id, email, isActivated,password
            const tokens = tokenService.generateTokens({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return {...tokens, user: userDto};
            console.log(`Update user with ${id},name:${name},email: ${email} and password:${password}`);
        }

          catch (e) {
            throw ApiError.BadRequest('the user is not updated');
        }

    }
 }

module.exports = new UserService();

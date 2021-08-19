const UserModel = require('../models/user-model');
const bcrypt = require('bcrypt');
const uuid = require('uuid');
const mailService = require('./mail-service');
const tokenService = require('../service/token-service');
const UserDto = require('../dto/user-dto');
const ApiError = require('../api-error');


class UserService {
    async registration(email, password) {
        const candidate = await UserModel.findOne({email});
        if (candidate) {
            throw ApiError.BadRequest(`The user with email ${email} is already exist`);
        }
        const activationLink = uuid.v4();
        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await UserModel.create({email, password: hashPassword, activationLink});
        // await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`);

        const userDto = new UserDto(user)// id, email, isActivated
        const tokens = tokenService.generateTokens({...userDto});
        await tokenService.saveToken(userDto.id, tokens.refreshToken);
        return {...tokens, user: userDto};
    }

    async activate(activationLink) {
        const user = await UserModel.findOne({activationLink});
        if (!user) {
            throw ApiError.BadRequest("Incorrect activation link")
        }
        user.isActivated = true;
        await user.save();
    }
    async login(email,password){
        const user=await UserModel.findOne({email});
        if(!user){
            throw ApiError.BadRequest('the user was not found');
        }
        const isPasswordEqual=await bcrypt.compare(password,user.password);
       if(!isPasswordEqual){
           throw ApiError.BadRequest("The password is not correct");
       }
       const userDto=new UserDto();
       const tokens=tokenService.generateTokens({...userDto});
       await tokenService.saveToken(userDto.id,tokens.refreshToken);
       return {...tokens, user:userDto}
    }

}

module.exports = new UserService();

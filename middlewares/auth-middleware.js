const ApiError = require('../api-error');
const tokenService = require('../service/token-service');

module.exports = function (req, res, next) {
    try {
        // вытащить токен из заголовка
        const authorizationHeader = req.headers.authorization;
        if (!authorizationHeader) {
            return next(ApiError.UnauthorizedError())
        }

        const accessToken = authorizationHeader.split('')[1];
        if (!accessToken) {
            return next(ApiError.UnauthorizedError());
        }
        //валидируем
        const userData = tokenService.validateAccessToken(accessToken);
        if (!userData) {
            return next(ApiError.UnauthorizedError())
        }
        //помещаем данные о пользователе
        req.user = userData;
        // передаем  следующему middleware
        next();

    } catch (e) {
        return next(ApiError.UnauthorizedError());
    }
}

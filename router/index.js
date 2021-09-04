const Router = require('express').Router;
const userController = require('../controllers/user-controller');
const {body} = require('express-validator');
const router = new Router();
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('name').isLength({min:2, max:32}),
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/activate/:link', userController.activate);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddleware, userController.getUsers);
router.get('/:id',userController.getOneUser);
router.get('/:id/edit',userController.editUser);
router.put('/',
    body('name').isLength({min:2, max:32}),
    body('email').isEmail(),
    body('password').isLength({min: 3, max: 32}),
    userController.updateUser);

module.exports = router;

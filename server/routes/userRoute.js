const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.post('/signup', userController.signup);
userRouter.post('/login', userController.login);
userRouter.post('/getToken', userController.verifyToken);

userRouter.get('/allUsers', userController.getAllUsers);
userRouter.get('/favorite/:id', userController.getFavoriteAssociations);
userRouter.get('/:id', userController.getUserById);

userRouter.post('/updateExist/:id', userController.existUserFavorite);
userRouter.put('/updateAdd/:id', userController.addUserFavorite);
userRouter.put('/updateRemove/:id', userController.removeUserFavorite);

userRouter.delete('/deleteUserById/:id', userController.deleteUserById )
userRouter.delete('/deleteAllUsers', userController.deleteAllUsers);



module.exports = userRouter;
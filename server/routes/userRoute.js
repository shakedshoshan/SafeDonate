const express = require('express');
const userController = require('../controllers/userController');

const userRouter = express.Router();

userRouter.get('/allUsers', userController.getAllUsers);
userRouter.get('/favorite/:userId', userController.getFavoriteAssociations);
userRouter.get('/:id', userController.getUserById);

userRouter.post('/updateExist/:userId', userController.existUserFavorite);
userRouter.put('/updateAdd/:userId', userController.addUserFavorite);
userRouter.put('/updateRemove/:userId', userController.removeUserFavorite);

userRouter.delete('/deleteUserById/:id', userController.deleteUserById )
userRouter.delete('/deleteAllUsers', userController.deleteAllUsers);

module.exports = userRouter;
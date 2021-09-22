const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const userController = require('../controllers/userController');

router
  .post('/signup', authController.signup)

router
  .post('/login', authController.login)

router
  .post('/forgotpassword', authController.forgotPassword)

router
  .patch('/resetpassword/:token', authController.resetPassword)

router
  .route('/')
  .get(userController.getAllUser)
  .post(userController.createUser);

router
  .route('/:id')
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
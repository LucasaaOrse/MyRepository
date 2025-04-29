const express = require('express');
const UserController = require('../controllers/UserController');
const AdminAuth = require('../middleware/adminAuth')
const router = express.Router();

router.get('/users', AdminAuth , UserController.index);
router.post('/user', UserController.create);
router.get('/user/:id', UserController.getById)
router.put('/user', UserController.editUser)
router.delete('/user/:id', UserController.deleteUser)
router.post('/user/recover', UserController.passwordRecover)
router.put('/user/password', UserController.changePassword)
router.post('/login', UserController.login)
router.get('/me', UserController.me)

module.exports = router;

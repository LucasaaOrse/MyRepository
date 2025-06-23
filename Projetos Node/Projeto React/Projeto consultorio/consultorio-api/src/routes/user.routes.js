const express = require('express')
const router = express.Router()
const UserController = require('../controllers/UserController')
const authenticate = require('../middleware/authenticate')

router.get('/users', UserController.getUsers)
router.post('/user', UserController.createUser)
router.get('/user', UserController.getById)
router.put('/user', UserController.editUser)

router.post('/passwordRecovery', UserController.passwordRecovery)
router.put('/changePassword', UserController.changePassword)

router.post('/login', UserController.login)
router.get('/me', UserController.me)

router.get('/tokeninfo', UserController.getTokenInfo)


module.exports = router


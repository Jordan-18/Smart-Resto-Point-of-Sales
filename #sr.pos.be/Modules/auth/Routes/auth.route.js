const express = require("express");
const authController = require('../Http/auth.controller.js')
const {validateLogin, validateregister} = require('./auth.validation.js')

const router = express.Router();
const auth = new authController()

router.post('/login',validateLogin, auth.login);
router.post('/register', validateregister,auth.register);
router.get('/logout', auth.logout)


module.exports = router
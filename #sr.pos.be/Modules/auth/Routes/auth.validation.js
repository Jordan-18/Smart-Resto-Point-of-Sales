const {check} = require('express-validator');

const validateLogin = [
    check('user_username','is Required').notEmpty(),
    check('user_password','is Required').notEmpty(),
]
const validateregister = [
    check('user_name','is Required').notEmpty(),
    check('user_username','is Required').notEmpty(),
    check('user_email','is Required').notEmpty(),
    check('user_password','is Required').notEmpty(),
    check('user_password_repeat','is Required').notEmpty(),
]

module.exports = {validateLogin, validateregister}
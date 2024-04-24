const {check} = require('express-validator');

const validate = [
    check('access_kode','is Required').notEmpty(),
    check('access_name','is Required').notEmpty(),
]

module.exports = {validate}
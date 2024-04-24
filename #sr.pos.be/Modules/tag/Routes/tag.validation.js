const {check} = require('express-validator');

const validate = [
    check('tag_name','is Required').notEmpty(),
]
const validateItem = [
    check('tag_item_tag','is Required').notEmpty(),
    check('tag_item_dish','is Required').notEmpty(),
]

module.exports = {validate, validateItem}
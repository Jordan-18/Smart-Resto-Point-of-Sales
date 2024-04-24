const {check} = require('express-validator');

const validate = [
    check('transaction_user','is Required').notEmpty(),
    check('transaction_total_price','is Required').notEmpty(),
    check('transaction_shipping_price','is Required').notEmpty(),
    check('transaction_status_payment','is Required').notEmpty(),
    check('transaction_payment','is Required').notEmpty(),
]
const validateItem = [
    check('transaction_item_user','is Required').notEmpty(),
    check('transaction_item_transaction','is Required').notEmpty(),
    check('transaction_item_dish','is Required').notEmpty(),
    check('transaction_item_description','is Required').notEmpty(),
    check('transaction_item_quantity','is Required').notEmpty(),
]

module.exports = {validate, validateItem}
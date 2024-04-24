const {check} = require('express-validator');

const validate = [
    check('dish_name','is Required').notEmpty(),
]

const validateGallery = [
    check('dish_gallery_dish','is Required').notEmpty(),
    check('dish_gallery_url','is Required').notEmpty(),
]

module.exports = {validate, validateGallery}
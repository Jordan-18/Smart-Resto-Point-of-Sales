const express = require("express");
const dishController = require('../Http/dish.controller.js')
const dishGalleryController = require('../Http/gallery.dish.controller.js')
const {validate, validateGallery} = require('./dish.validation.js')
const middlewareJWT = require('../../../helpers/MiddlewareJWT.js');
const multer = require('multer');

const router = express.Router();
const dish = new dishController()
const dishGallery = new dishGalleryController()
const storage = multer.memoryStorage();
const upload = multer({ 
    storage: storage
});

router.use('/dish', middlewareJWT);
router.use('/dish-gallery', middlewareJWT);

router.get('/dish', dish.find);
router.get('/dish/:id', dish.findOne);
router.post('/dish',validate, dish.create);
router.put('/dish/:id',validate, dish.update);
router.delete('/dish/:id', dish.delete);

router.get('/dish-gallery', dishGallery.find);
router.get('/dish-gallery/:id', dishGallery.findOne);
router.post('/dish-gallery', upload.array('dish_gallery_url'),dishGallery.create);
router.put('/dish-gallery/:id',validateGallery, dishGallery.update);
router.delete('/dish-gallery/:id', dishGallery.delete);

module.exports = router
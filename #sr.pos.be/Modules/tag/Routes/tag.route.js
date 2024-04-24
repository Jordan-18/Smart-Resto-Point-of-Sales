const express = require("express");
const tagController = require('../Http/tag.controller.js')
const tagItemController = require('../Http/item.tag.controller.js')
const {validate, validateItem} = require('./tag.validation.js')
const middlewareJWT = require('../../../helpers/MiddlewareJWT.js');

const router = express.Router();
const tag = new tagController()
const tagItem = new tagItemController()

router.use('/tag', middlewareJWT);
router.use('/tag-item', middlewareJWT);

router.get('/tag', tag.find);
router.get('/tag/:id', tag.findOne);
router.post('/tag',validate, tag.create);
router.put('/tag/:id',validate, tag.update);
router.delete('/tag/:id', tag.delete);

router.get('/tag-item', tagItem.find);
router.get('/tag-item/:id', tagItem.findOne);
router.post('/tag-item', tagItem.create);
router.put('/tag-item/:id',validateItem, tagItem.update);
router.delete('/tag-item/:id', tagItem.delete);

module.exports = router
const express = require("express");
const accessController = require('../Http/access.controller.js')
const {validate} = require('./access.validation.js')
const middlewareJWT = require('../../../helpers/MiddlewareJWT.js');

const router = express.Router();
const access = new accessController()

router.use('/access', middlewareJWT);
router.get('/access', access.find);
router.get('/access/:id', access.findOne);
router.post('/access',validate, access.create);
router.put('/access/:id',validate, access.update);
router.delete('/access/:id', access.delete);

module.exports = router
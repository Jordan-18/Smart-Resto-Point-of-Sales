const express = require("express");
const userController = require('../Http/user.controller.js')
const {validate} = require('./user.validation.js')
const middlewareJWT = require('../../../helpers/MiddlewareJWT.js');

const router = express.Router();
const user = new userController()

router.use('/user', middlewareJWT);

router.get('/user', user.find);
router.get('/user/:id', user.findOne);
router.post('/user',validate, user.create);
router.put('/user/:id',validate, user.update);
router.delete('/user/:id', user.delete);

module.exports = router
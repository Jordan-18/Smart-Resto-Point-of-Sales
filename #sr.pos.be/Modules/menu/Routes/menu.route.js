const express = require("express");
const menuController = require('../Http/menu.controller.js')
const menuaccessController = require('../Http/menuaccess.controller.js')
const {validate} = require('./menu.validation.js')
const middlewareJWT = require('../../../helpers/MiddlewareJWT.js');

const router = express.Router();
const menu = new menuController()
const menuaccess = new menuaccessController()

router.use('/menu', middlewareJWT);
router.use('/menuaccess', middlewareJWT);

router.get('/menu', menu.find);
router.get('/menu/:id', menu.findOne);
router.post('/menu',validate, menu.create);
router.put('/menu/:id',validate, menu.update);
router.delete('/menu/:id', menu.delete);
router.get('/menus', menu.menus);

router.get('/menuaccess', menuaccess.find);
router.get('/menuaccess/:id', menuaccess.findOne);
router.post('/menuaccess',validate, menuaccess.create);
router.put('/menuaccess/:id',validate, menuaccess.update);
router.delete('/menuaccess/:id', menuaccess.delete);

router.get('/accessmenu/:id', menuaccess.accessMenu);
router.get('/roleaccess/:id', menuaccess.roleAccess);

module.exports = router
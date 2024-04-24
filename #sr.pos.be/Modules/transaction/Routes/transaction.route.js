const express = require("express");
const transactionController = require('../Http/transaction.controller.js')
const transactionItemController = require('../Http/item.transaction.controller.js')
const {validate, validateItem} = require('./transaction.validation.js')
const middlewareJWT = require('../../../helpers/MiddlewareJWT.js');

const router = express.Router();
const transaction = new transactionController()
const transactionItem = new transactionItemController()

router.use('/transaction', middlewareJWT);
router.use('/transaction/item', middlewareJWT);

router.get('/transaction', transaction.find);
router.get('/transaction/:id', transaction.findOne);
router.post('/transaction',validate, transaction.create);
router.put('/transaction/:id',validate, transaction.update);
router.delete('/transaction/:id', transaction.delete);

router.get('/transaction/item', transactionItem.find);
router.get('/transaction/item/:id', transactionItem.findOne);
router.post('/transaction/item',validateItem, transactionItem.create);
router.put('/transaction/item/:id',validateItem, transactionItem.update);
router.delete('/transaction/item/:id', transactionItem.delete);

module.exports = router
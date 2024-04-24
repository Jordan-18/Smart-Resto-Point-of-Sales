const express = require('express');
const router = express.Router();

router.use(require('./auth/Routes/auth.route.js'));
router.use(require('./access/Routes/access.route.js'));
router.use(require('./menu/Routes/menu.route.js'));
router.use(require('./user/Routes/user.route.js'));
router.use(require('./dish/Routes/dish.route.js'));
router.use(require('./tag/Routes/tag.route.js'));
router.use(require('./transaction/Routes/transaction.route.js'));

module.exports = router;
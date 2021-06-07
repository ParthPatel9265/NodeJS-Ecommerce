const express = require('express');

const authorization = require('../middleware/authorization');
const router = express.Router();

const adminContoller = require('../controllers/admin');

router.get('/', authorization ,adminContoller.getAdminDashboard );

module.exports = router;
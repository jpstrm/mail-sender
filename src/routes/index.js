const app = require('express')
const router = app.Router()
const healthController = require('../controllers').healthController

router.get('/health', healthController)

module.exports = router

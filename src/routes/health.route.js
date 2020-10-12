const app = require('express')
const router = app.Router()
const healthController = require('../controllers/health.controller')

router.get('/health', healthController)

module.exports = router

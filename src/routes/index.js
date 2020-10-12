const app = require('express')
const router = app.Router()
const healthController = require('../controllers').healthController
const mailController = require('../controllers').mailController

router.get('/health', healthController)

// Mail
router.post('/mail/send', mailController.send)

module.exports = router

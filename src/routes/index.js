const app = require('express')

const joiMiddleware = require('../middleware/joi.middleware')
const healthController = require('../controllers').healthController
const emailController = require('../controllers').emailController
const sendEmailSchema = require('../controllers/email/email.schema').sendEmailSchema

const router = app.Router()

router.get('/health', healthController)

// mail
router.post('/mail/send', joiMiddleware(sendEmailSchema), emailController.send)

module.exports = router

const app = require('express')

const joiMiddleware = require('../middleware/joi.middleware')
const healthController = require('../controllers').healthController
const emailController = require('../controllers').emailController
const sendEmailSchema = require('../schemas/email.schema')

const router = app.Router()

router.get('/health', healthController)

// mail
router.post('/email/send', joiMiddleware(sendEmailSchema.emailPost), emailController.send)

module.exports = router

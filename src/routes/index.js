const app = require('express')

const joiMiddleware = require('../middleware/joi.middleware')
const healthController = require('../controllers').healthController
const emailController = require('../controllers').emailController
const sendEmailSchema = require('../schema/email.schema').sendEmailSchema

const router = app.Router()

router.get('/health', healthController)

// mail
router.post('/email/send', joiMiddleware(sendEmailSchema), emailController.send)

module.exports = router

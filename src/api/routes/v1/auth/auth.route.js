const { join } = require('path')
const router = require('express').Router()
const Joi = require('joi')
const { authorise } = require('../../../middleware/authorise.middleware')
const auth = require(join(__dirname, '..', '..', '..', 'controllers', 'auth.controller'))
const validate = require(join(__dirname, '..', '..', '..', 'middleware', 'validate.middleware'))

const schema = {
    signup: Joi.object({
        name: Joi.string().required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmpass: Joi.string().required()
      }),
    login: Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    }),
    verify: Joi.object({
        id: Joi.string().required().length(24),
        hash: Joi.string().required()
    }),
}

router.post('/signup', validate(schema.signup, 'body'), auth.signup)
router.post('/login', validate(schema.login, 'body'), auth.login)


router.get('/verify/:id/:hash',validate(schema.verify, 'params', 'Invalid verification link'), auth.verifyEmail);
router.post('/refreshtoken', auth.refreshToken)
router.get('/', authorise, async (req, res) => {
    return res.status(200).json({
        message: 'Welcome to API! You are logged in.'
    })
})


module.exports = router
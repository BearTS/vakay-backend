const { join } = require('path')
const { getSuggestions, getCityData } = require('../../../controllers/search.controller')
const Joi = require('joi')
const router = require('express').Router()
const validate = require(join(__dirname, '..', '..', '..', 'middleware', 'validate.middleware'))
const schema = {
  getSuggestions: Joi.object({
    city: Joi.string().required()
  }),
  getCityData: Joi.object({
    city: Joi.string(),
    place: Joi.string()
  })
}

router.get('/suggest', validate(schema.getSuggestions, 'query'), getSuggestions)
router.get('/data', validate(schema.getCityData, 'query'), getCityData)

module.exports = router

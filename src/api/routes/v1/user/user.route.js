const {join} = require('path');
const { createPlanTrip, getAllTrip, inviteUser, acceptInvitation, getTrip, createReview } = require('../../../controllers/user.controller');
const { authorise } = require('../../../middleware/authorise.middleware');
const validate = require(join(__dirname, '..', '..', '..', 'middleware', 'validate.middleware'))
const Joi = require("joi");
const router = require('express').Router()


const schema = {
    createPlanTrip: Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        city: Joi.string().required(),
        startDate: Joi.date().required(),
        endDate: Joi.date().required(),
        package: Joi.string(),
        hotel: Joi.array().items(Joi.object({
            date: Joi.date().required(),
            hotel: Joi.string().required()
        })),
        planning: Joi.array().items(Joi.object({
            start_date: Joi.date().required(),
            end_date: Joi.date().required(),
            place: Joi.string().required()
        }))
    }),
    inviteUser: Joi.object({
        email: Joi.string().email().required(),
        id: Joi.string().required()
    }),
    acceptInvitation: Joi.object({
        hash: Joi.string().required()
    }),
    getTrip: Joi.object({
        id: Joi.string()
    }),
    createReview: Joi.object({
        id: Joi.string().required(),
        rating: Joi.number().required(),
        comment: Joi.string().required()
    }),
}

router.post('/trip',validate(schema.createPlanTrip, 'body'), authorise, createPlanTrip);

router.get('/trip/:id', validate(schema.getTrip, 'params'), authorise, getTrip);
router.get('/trip/', authorise, getAllTrip);

router.put('/invite', validate(schema.inviteUser, 'body'), authorise, inviteUser);
router.put('/accept/:hash', validate(schema.acceptInvitation, 'params'), authorise, acceptInvitation);

router.post('/review', validate(schema.createReview, 'body'), authorise, createReview);



module.exports = router;
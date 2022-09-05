const { join } = require('path')
const express = require('express')

const router = express.Router()

router.get('/', async (req, res) => {
    res.status(404).json({
        message: 'Welcome to Vakay API!',
        base_url: `${req.protocol}://${req.get('host')}/api/`,
        endpoints: [
            'GET: /all'
        ]
    })
})

// router.use('/user', userRoute)
module.exports = router

const { join } = require('path')
const express = require('express')

const router = express.Router()

const authRouter = require(join(__dirname, 'auth', 'auth.route'))

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
router.use('/auth', authRouter)
module.exports = router

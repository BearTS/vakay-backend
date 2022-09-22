const { join } = require('path')
const User = require(join(__dirname, '..', 'models', 'user.model'))
const RefreshToken = require(join(__dirname, '..', 'models', 'token.model'))
const jwt = require('jsonwebtoken')

const createToken = async (user) => {
    let token = await jwt.sign({ id: user._id }, process.env.SECRET_JWT, {
        expiresIn: 60 * 60 * 24
    })
    return token;
}

exports.signup = async (req, res) => {
    const { email, password, confirmpass, name } = req.body;
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists'
            });
        }
        if (password !== confirmpass) {
            return res.status(400).json({
                message: 'Passwords do not match'
            });
        }
        user = await User.create({
            name,
            email,
            password
        })
        return res.status(201).json({
            message: 'User created successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

exports.login = async (req, res) => {
    const { email, password } = req.body;
    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        // if (!user.isVerified) {
        //     return res.status(400).json({
        //         message: 'Please verify your email'
        //     });
        // }
        let isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({
                message: 'Invalid credentials'
            });
        }
        let token = await createToken(user);
        let refreshToken = await RefreshToken.createToken(user);

        return res.status(200).json({
            message: 'Login successful',
            token: {
                accessToken: token,
                refreshToken: refreshToken
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

exports.refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;
    try {
        if (requestToken == null) {
            return res.status(403).json({ message: "Refresh Token is required!" });
        }
        let refreshToken = await RefreshToken.findOne({ token: requestToken });
        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token is not in database!" });
        }
        if (RefreshToken.verifyExpiration(refreshToken)) {
            RefreshToken.findByIdAndRemove(refreshToken._id, { useFindAndModify: false }).exec();
            return res.status(403).json({ message: "Refresh token has expired!" });
        }
        let newAccessToken = await createToken(refreshToken.user);
        return res.status(200).json({
            message: 'Token refreshed successfully',
            token: {
                accessToken: newAccessToken,
                refreshToken: requestToken
            }
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: 'Internal server error'
        });
    }
}

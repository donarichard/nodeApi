const router = require('express').Router();

const User = require('../model/User');

const {
    registerValidation,
    loginValidation
} = require('../validation')

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    const {
        error
    } = registerValidation(req.body)

    if (error) return res.status(201).send({
        "error": error.details[0].message
    });

    const emailExit = await User.findOne({
        email: req.body.email
    })

    if (emailExit) return res.status(201).send({
        "error": 'Email already registered'
    })

    const salt = await bcrypt.genSalt(10);

    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashPassword,
        userType: req.body.userType
    })
    try {
        await user.save()
        res.send({
            user: user._id
        })

    } catch (err) {
        res.status(400).send(err);
    }
});
router.post('/login', async (req, res) => {
    const {
        error
    } = loginValidation(req.body)

    if (error) return res.status(201).json({
        "error": error.details[0].message
    });

    const user = await User.findOne({
        email: req.body.email
    })

    if (!user) return res.status(201).json({
        "error": "Email not found"
    })

    const validPass = await bcrypt.compare(req.body.password, user.password);

    if (!validPass) return res.status(201).json({
        "error": "Invalid user"
    })


    const token = jwt.sign({
        _id: user._id
    }, process.env.TOKEN_SECERT)

    res.header('auth-token', token).status(200).send({
        "auth_token": token,
        "user_type": user.userType
    })

});

module.exports = router;
const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { registerValidation, loginValidation } = require('../validation');


router.post('/register', async(req, res) => {

    const { error } = registerValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message);

    //Check existance of the user
    const emailExists = await User.findOne({ email: req.body.email });
    if (emailExists)
        return res.status(400).send('Email already exists');

    //Hashing password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);


    //Create new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    })
    try {
        const savedUser = await user.save();
        res.send({ user: user._id });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post('/login', async(req, res) => {
    const { error } = loginValidation(req.body);
    if (error)
        return res.status(400).send(error.details[0].message)

    //Check existance of the email
    const user = await User.findOne({ email: req.body.email });
    if (!user)
        return res.status(400).send('Email or password is invalid');

    //Check if password is correct
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword)
        return res.status(400).send('Invalid Password');

    //create jwt token. You can decrypt the token using the TOKEN_SECRET and the token that is signed at https://jwt.io/
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});

module.exports = router;
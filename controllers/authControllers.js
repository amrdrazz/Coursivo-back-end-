require('dotenv').config()
const User = require('../models/user');
const JWT = require('jsonwebtoken');


const handleErrors = (err) => {
    let errors = {name: '', email: '',password: '', code: ''};

    //==============  Signup Errors  ==============

    // validator errors
    if (err.message.includes('user validation failed')){
        if (err.message.includes('user validation failed')){
            Object.values(err.errors).forEach(({properties}) => {
                errors[properties.path] = properties.message;
            })
        }
        return errors;
    }

    // duplicate error
    if (err.code === 11000){
        errors.email = 'that email is already registered';
        return errors;
    }

    // ===========  Verification Errors  ==========

    // incorrect code
    if (err.message === 'incorrect code'){

        errors.code = 'that code is incorrect';
        return errors;
    }

    // ===========  Login Errors  =============
    
    // incorrect email
    if (err.message === 'incorrect email'){
        errors.email = 'that email is not registered';
        return errors;
    }
    
    // incorrect password
    if (err.message === 'incorrect password'){
        errors.email = 'that password is incorrect';
        return errors;
    }

    // unverified account
    if (err.message === 'this account is not verified'){
        errors.email = 'this account is not verified';
        return errors;
    }



}

const maxAge = 3 * 24 * 60 * 60;
const createToken = (id) => {
    return JWT.sign({id}, process.env.JWT_SECRET, { expiresIn: maxAge })
}

const { Resend } = require('resend');

const resend = new Resend(process.env.RESEND_API_KEY);
const sendEmail = async (email, code) => {
    const { data, error } = await resend.emails.send({
        from: 'Coursivo <onboarding@resend.dev>',
        to: email,
        subject: 'Verification Code',
        html: `
            <h3>Welcome to Coursivo</h3>
            <p>Enjoy learning in coursivo</p>
            <br>
            <p>Your verification code is: <strong>${code}</strong></p>
        `
    });

    if (error) {
        return console.log(error);
    }

    console.log(data);

}


module.exports.signup = async (req, res) => {
    const {name, email, password} = req.body;
    const code = Math.floor(1000 + Math.random() * 9000);

    try{
        const user = await User.create({name, email, password, code: String(code), verified: false});
        sendEmail(email, String(code));
        res.status(200).json({user: user._id});
    }catch(err){
        errors = handleErrors(err);
        res.status(400).json({ errors });
    }
};

module.exports.verify = async (req, res) => {
    const {email, code} = req.body;
    try{
        const user = await User.verify(email, Number(code));
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }catch(err){
        errors = handleErrors(err);
        res.status(400).json({ errors })
    }
};

module.exports.login = async (req, res) => {
    const {email, password} = req.body;
    try{
        const user = await User.login(email, password);
        const token = createToken(user._id);
        res.cookie('jwt', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: maxAge * 1000 });
        res.status(200).json({ user: user._id });
    }catch(err){
        errors = handleErrors(err);
        res.status(400).json({ errors })
    }
};
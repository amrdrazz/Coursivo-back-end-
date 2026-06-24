const JWT = require('jsonwebtoken');
const User = require('../models/user')

const checkUser = async (req, res, next) => {
    try{
        const token = req.cookies.jwt;
        if (!token){
            return res.status(401).json({ message: 'Not authenticated' });
        }

        const decoded = JWT.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ _id: decoded.id });
        if (user){
            req.user = user;
        }else{
            console.log(decoded)
        }

        next()
    }catch(err){
        return res.status(401).json({ message: 'Invalid token' })
    }
}

module.exports = checkUser;
const mongoose = require('mongoose');
const { isEmail } = require('validator');
const bcrypt = require('bcrypt');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Password is required'],
    },
    email: {
        type: String,
        required: [true, 'Password is required'],
        uniqe: true,
        validate: [isEmail , 'Please inter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Minimum password length is 6 characters']
    },
    enrolledCourses: {
        type: Array
    },
    code: {
        type: String
    },
    verified: {
        type: Boolean
    }
});

// hash the user password before creating the instance
userSchema.pre('save', async function () {
    const salt = await bcrypt.genSalt();
    this.password = await bcrypt.hash(this.password, salt)
});

// Verification method
userSchema.statics.verify = async function (email, code){
    const user = await this.findOne({ email });
    if (user){
        if (user.code === String(code)){
            user.verified = true;
            user.code = null;
            await user.save();
            return user;
        }
        throw Error('incorrect code');
    }
    throw Error('incorrect email');
}

// login method
userSchema.statics.login = async function (email, password){
    const user = await this.findOne({ email });

    if (user){
        if (user.verified){
            const auth = bcrypt.compare(password, user.password);
            if (auth){
                return user
            }
            throw Error('incorrect password')
        }
        throw Error('this account is not verified')
    }
    throw Error('incorrect email')
}

const User = mongoose.model('user', userSchema);

module.exports = User;
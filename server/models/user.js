const mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')

var UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            isAsync: false,
            validator: validator.isEmail,
            message: '{VALUE} is not a valid email'
        }
    },
    password: {
        type: String,
        require: true,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
})

UserSchema.methods.generateAuthToken = function() {
    var user = this
    var access = 'auth'
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString()

    user.tokens.push({access, token})

    user.save().then(() => {
        console.log(token)
        return token
    })
}
var User = mongoose.model('User', UserSchema)

module.exports = {User}
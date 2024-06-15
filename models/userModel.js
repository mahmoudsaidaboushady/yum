const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username :
    {
        type : String , 
        required : [true , 'user must have a name'],
    },
    email : 
    {
        type : String ,
        required : [true , 'user must have an email'],
        unique : true , 
        lowercase : true,
        validate : [validator.isEmail ,'please provide a valid email'],
    },
    address :
    {
        type : String
    },
    password : 
    {
        type : String,
        required : [true , 'user must have a password'],
        minlength : 8,
        select : false
    },
    passwordConfirm : 
    {
        type : String,
        required : [true , 'please confirm your password'],
        // validate works on save() , create() - doesn't work on findByIdAndUpdate
        validate : 
        {
            validator : function (el) {
                return el === this.password;
            },
            message : 'passwords match match'
        }
    },
    nationalID : 
    {
        type : Number
    } , 
    slogan :
    {
        type : String
    },
    aboutBrand :
    {
        type : String
    },
    passwordChangedAt : Date,
    passwordResetToken : String , 
    passwordResetExpires : Date,
    active : 
    {
        type : Boolean,
        default : true,
        select : false
    }
});

userSchema.pre('save', async function(next) {
    //only run if password field modified
    if(!this.isModified('password')) return next();
    //12 : no of rounds used for hashing
    this.password = await bcrypt.hash(this.password , 12);
    this.passwordConfirm = undefined;

    next();
});

userSchema.methods.correctPassword = async function (candidatePassword , userPassword){
    return await bcrypt.compare(candidatePassword , userPassword);
}

const User = mongoose.model('User' , userSchema);
module.exports = User;
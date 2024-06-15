const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');

const signToken = id => {
    return jwt.sign({ id : id } , 'my-super-secret' , {
        expiresIn : '30d'
    });
}

const createSendToken = (user , statusCode , res) => {
    const token = signToken(user._id);

    const cookieOptions =  {
        expires : new Date( Date.now() + 30 * 24 * 60 * 60 * 1000),
        httpOnly : true
    };
    
    res.status(statusCode).json({
        status : 'success', 
        token      
    })
}

exports.signup = async (req, res, next) => {
    try {
        const newUser = await User.create(req.body);
        // sign(payload , secret , options : {expiresIn})
        createSendToken(newUser, 201, res);
    } catch (error) {
        next(error);
    }
};


exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return next(new appError('Please provide email and password', 400));
        }

        const user = await User.findOne({ email: email }).select('+password');
        // correctPassword: instance method on all user documents -> userModel
        if (!user || !await user.correctPassword(password, user.password)) {
            return next(new appError('Incorrect email or password', 401));
        }

        createSendToken(user, 200, res);
        
        /*
        req.session.user = user
        console.log(req.session);
        // ON LOGOUT
        req.session.destroy 
        */
    } catch (error) {
        next(error);
    }
};

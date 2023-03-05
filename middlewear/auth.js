const jwt = require('jsonwebtoken');
const User = require('../models/user');

// router.get('/is-auth' ); we use this route to verify the given user is authenticated or not
exports.isAuth = async (req, res, next) => {
    const token = req.headers?.authorization

    const jwtToken = token.split('Bearer ')[1]

    if (!jwtToken) return sendError(res, 'Invalid token!')
    const decode = jwt.verify(jwtToken, process.env.JWT_SECRET);
    // we are getting this userId from signin method inside the decode if the jwtToken is valid it is coming from  controllers from signin method
    const { userId } = decode;

    const user = await User.findById(userId)
    if (!user) return sendError(res, 'Invalid token user not found!', 404)

// if evrything goes well then we are adding this user like req.user. we can access user inside req.user
    req.user = user;
    next()

};

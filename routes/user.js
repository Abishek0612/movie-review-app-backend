const express = require('express');
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword, sendResetPasswordTokenStatus, resetPassword, signIn }
      = require('../controllers/user');
const { isAuth } = require('../middlewear/auth');

const { isValidPassResetToken } = require('../middlewear/user');
const { userValidator, validate, validatePassword, signInValidator } = require('../middlewear/validator');
const { sendError } = require('../utils/helper');

const router = express.Router();

router.post('/create', userValidator, validate, create);
router.post('/sign-in', signInValidator, validate, signIn);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post('/forget-password', forgetPassword)
router.post('/verify-pass-reset-token', isValidPassResetToken, sendResetPasswordTokenStatus);
router.post('/reset-password', validatePassword, validate, isValidPassResetToken, resetPassword);



// coming from middlewear inside auth.js
router.get('/is-auth',isAuth, (req, res) => {
      const {user} =req;
      res.json({user: {id:user._id, name:user.name,
             email: user.email, 
             isVerified: user.isVerified}})
});

module.exports = router;    
const express = require('express');
const { create, verifyEmail, resendEmailVerificationToken, forgetPassword } = require('../controllers/user');
const { isValidPassResetToken } = require('../middlewear/user');
const { userValidator, validate } = require('../middlewear/validator');

const router = express.Router();

router.post('/create' ,userValidator, validate,  create);
router.post("/verify-email", verifyEmail);
router.post("/resend-email-verification-token", resendEmailVerificationToken);
router.post('/forget-password', forgetPassword)
router.post('/verify-pass-reset-token', isValidPassResetToken, (req, res) => {
      req.json({ valid: true })
})

module.exports = router;    
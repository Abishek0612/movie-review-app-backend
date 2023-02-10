const crypto = require('crypto')
const User = require('../models/user');
const EmailVerificationToken = require("../models/emailVerificationToken");
const { isValidObjectId } = require('mongoose');
const { generateOTP, generateMailTransporter } = require('../utils/mail');
const { sendError, generateRandomByte } = require('../utils/helper');
const passwordResetToken = require('../models/passwordResetToken');


exports.create = async (req, res) => {
    // console.log(req.body);
    const { name, email, password } = req.body

    const oldUser = await User.findOne({ email })
    if (oldUser) return sendError(res, "This email is already in use!")

    const newUser = new User({ name, email, password })
    await newUser.save();


    //generate 6 digit otp

    let OTP = generateOTP();

    //store otp inside our db
    const newEmailVerification = new EmailVerificationToken({
        owner: newUser._id,
        token: OTP,
    });

    await newEmailVerification.save();

    //send that otp to our user

    var transport = generateMailTransporter()

    transport.sendMail({
        from: "verification@reviewapp.com",
        to: newUser.email,
        subject: "Email Verification",
        html: `
        <p> Your verification OTP</p> 
        <h1>${OTP} </h1>`
    })

    res.status(201).json({
        message: "Please verify your email. OTP has been sent to your email! account",
    })
}


exports.verifyEmail = async (req, res) => {
    const { userId, OTP } = req.body;

    if (!isValidObjectId(userId)) return res.json({ error: "Invalid user!" });

    const user = await User.findById(userId)
    if (!user) return sendError(res, "user not found!", 404);

    if (user.isVerified) return sendError(res, "user is already verified!")

    const token = await EmailVerificationToken.findOne({ owner: userId });
    if (!token) return sendError(res, "token not found!")

    const isMatched = await token.compareToken(OTP)
    if (!isMatched) return sendError(res, "Please submit a Valid OTP")

    user.isVerified = true;
    await user.save();

    EmailVerificationToken.findByIdAndDelete(token.id)



    //send that otp to our user

    var transport = generateMailTransporter()

    transport.sendMail({
        from: "verification@reviewapp.com",
        to: user.email,
        subject: "Welcome Email",
        html: `
        <h1> Welcome to our app and thanks for choosing us.</h1> 
`
    })

    res.json({ message: 'Your email is verified.' })
}

exports.resendEmailVerificationToken = async (req, res) => {
    const { userId } = req.body;

    const user = await User.findById(userId);
    if (!user) return sendError(res, "user not found!")


    if (user.isVerified) return sendError(res, "This email id is already verified")

    const alreadyHaSToken = await EmailVerificationToken.findOne({
        owner: userId
    });
    if (alreadyHaSToken) return sendError(res, "Only after one hour you can request for another token!")


    //generate 6 digit Otp
    let OTP = generateOTP()

    //store otp inside our db
    const newEmailVerificationToken = new
        EmailVerificationToken({
            owner: user._id,
            token: OTP,
        })

    await newEmailVerificationToken.save()

    //send that otp to our user

    var transport = generateMailTransporter()

    transport.sendMail({
        from: "verification@reviewapp.com",
        to: user.email,
        subject: "Welcome Email",
        html: `
        <h1> Welcome to our app and thanks for choosing us.</h1> 
`
    })
    res.json({ message: "New OTP has been sent to your  registered email account" })
}



exports.forgetPassword = async (req, res) => {
    const { email } = req.body;

    if (!email) return sendError(res, 'email is missing!')

    const user = await User.findOne({ email })
    if (!user) return sendError(res, 'User not found!', 404);

    const alreadyHaSToken = await passwordResetToken.findOne({ owner: user._id })

    if (alreadyHaSToken) return sendError(res, "Only after one hour you can request for another token!")


    const token = await generateRandomByte();
    const newPasswordResetToken = await passwordResetToken({ owner: user._id, token })
    await newPasswordResetToken.save();

    const resetPasswordUrl = `http://localhost:3000/reset-password?token=${token}&id=${user._id}`;



    const transport = generateMailTransporter()

    transport.sendMail({
        from: "security@reviewapp.com",
        to: user.email,
        subject: "Reset Password Link",
        html: `
        <p>Click here to reset password </p>
        <a href= '${resetPasswordUrl}'>Change Password </a> 
`
    })
    res.json({ message: "Link  sent to your email!" })
}


exports.sendResetPasswordTokenStatus = (req, res) => {
    res.json({ valid: true })
}

exports.resetPassword = async (req, res) => {
    const { newPassword, userId } = req.body;

    const user = await User.findById( userId )
    const matched = await user.comparePassword(newPassword)
    if (matched) return sendError(res, 'The new password must be different from the old one!');
    user.password = newPassword
    await user.save()

    await passwordResetToken.findByIdAndDelete(req.resetToken._id)

    const transport = generateMailTransporter()

    transport.sendMail({
        from: "security@reviewapp.com",
        to: user.email,
        subject: "Password Reset Successfully",
        html: `
        <h1>Password Reset Successfully</h1>
        <p>Now you can use new passsword. </p> 
`
    })
    res.json({message: 'Password reset successfuly, now you can use  your new password'})
}



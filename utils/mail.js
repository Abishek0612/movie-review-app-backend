const nodemailer = require('nodemailer')

//generate 6 digit otp
exports.generateOTP = (otp_length = 6) => {
    let OTP = '';
    for (let i = 1; i <= otp_length; i++) {
        const randomVal = Math.round(Math.random() * 9)
        OTP += randomVal;
    }
    
    return OTP;
}


exports.generateMailTransporter = () => nodemailer.createTransport({
    host: "smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "56e3e876384c2a",
        pass: "cca72696e49362"
    }
});
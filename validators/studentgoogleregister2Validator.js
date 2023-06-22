import Joi from 'joi';

const googleRegister2Validator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    password: Joi.string().trim().required().min(3).label("Password").error(new Error('Please enter Valid Password!')),
    mobileNo: Joi.string().label("MobileNo").error(new Error('Please enter correct MobileNo')),
    // otp: Joi.string().required().label("OTP").error(new Error('Please enter correct OTP')),
    class: Joi.string().trim().error(new Error('Please enter class!')),
    referralCode: Joi.string().trim(),
}

const StudentGoogleRegister2ValidatorSchema = Joi.object(googleRegister2Validator);

export default StudentGoogleRegister2ValidatorSchema;
import Joi from 'joi';

const registerValidator = {
    email: Joi.string().trim().required().email().label("Email").error(new Error('Please enter correct email!')),
    password: Joi.string().trim().required().min(3).label("Password").error(new Error('Please enter Valid Password!')),
    mobileNo: Joi.string().label("MobileNo").error(new Error('Please enter correct Mobile number')),
    // otp: Joi.string().trim().required().label("OTP").error(new Error('Please enter correct OTP!')),
    class: Joi.string().trim(),
    referralCode: Joi.string().trim(),
}

const StudentRegisterValidatorSchema = Joi.object(registerValidator);

export {
    StudentRegisterValidatorSchema
}
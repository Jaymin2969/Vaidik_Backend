import Joi from 'joi';

const StudentregisterquestionValidator = { 
    // userId: Joi.string().required().label("userId").error(new Error('Please enter correct userId!')),
    email: Joi.string().trim().required().email().label("Email").error(new Error('Please enter correct email!')),
    password: Joi.string().trim().required().min(3).label("password").error(new Error('Please enter Valid password!')),
    mobileNo: Joi.string().label("MobileNo").error(new Error('Please enter correct MobileNo')),
    // otp: Joi.string().required().label("OTP").error(new Error('Please enter correct OTP')), 
    class: Joi.string().label("class").error(new Error('Please enter correct class!')),
    question: Joi.string().required().label("question").error(new Error('Please enter correct Question!')),
    questionType: Joi.string().required().label("questiontype").error(new Error('Please enter correct questiontype!')),
    questionSubject: Joi.string().required().label("questionsubject").error(new Error('Please enter correct questionsubject!')),
    questionPhoto: Joi.any().label("questionPhoto").error(new Error('Please enter correct questionPhoto!')),
    referralCode: Joi.string().trim(),
}

const StudentregisterquestionValidatorSchema = Joi.object(StudentregisterquestionValidator);

export default StudentregisterquestionValidatorSchema;

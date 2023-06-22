import Joi from 'joi';

const TutorOTPValidator = {
    mobileNo: Joi.string().required().label("MobileNo").error(new Error('Please enter correct MobileNo!')),
}

const TutorOTPValidatorSchema = Joi.object(TutorOTPValidator);

export default TutorOTPValidatorSchema;
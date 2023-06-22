import Joi from 'joi';

const StudentOTPValidator = {
    mobileNo: Joi.string().required().label("MobileNo").error(new Error('Please enter correct MobileNo!')),
}

const StudentOTPValidatorSchema = Joi.object(StudentOTPValidator);

export default StudentOTPValidatorSchema;
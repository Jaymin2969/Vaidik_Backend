import Joi from 'joi';

const StudentForgotPasswordValidator = {
    email: Joi.string().trim().required().email().label("email").error(new Error('Please enter Valid Email!'))
}

const StudentForgotPasswordValidatorSchema = Joi.object(StudentForgotPasswordValidator);

export default StudentForgotPasswordValidatorSchema;
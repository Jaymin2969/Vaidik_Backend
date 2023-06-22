import Joi from 'joi';

const TutorForgotPasswordValidator = {
    email: Joi.string().trim().required().email().label("email").error(new Error('Please enter Valid Email!'))
}

const TutorForgotPasswordValidatorSchema = Joi.object(TutorForgotPasswordValidator);

export default TutorForgotPasswordValidatorSchema;
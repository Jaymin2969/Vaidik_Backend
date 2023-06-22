import Joi from 'joi';

const AdminForgotPasswordValidator = {
    email: Joi.string().trim().required().email().label("email").error(new Error('Please enter Valid Email!'))
}

const AdminForgotPasswordValidatorSchema = Joi.object(AdminForgotPasswordValidator);

export default AdminForgotPasswordValidatorSchema;
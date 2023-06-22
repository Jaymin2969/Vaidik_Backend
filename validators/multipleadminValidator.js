import Joi from 'joi';

const MultipleAdminValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    username: Joi.string().trim().required().label("Username").error(new Error('Please enter Username!')),
    email: Joi.string().required().email().label("email").error(new Error('Please enter correct email!')),
    password: Joi.string().trim().min(6).label("Password").error(new Error('Please enter Valid password!')),
    mainpassword: Joi.string().trim().required().min(6).label("Mainpassword").error(new Error('Please enter Valid mainpassword!')),
    role: Joi.string().required().label("Role").error(new Error('Please enter Valid role!')),
    isactive: Joi.number().required().label("Isactive").error(new Error('Please enter Valid isactive!')),
    id: Joi.any()
}

const MultipleAdminValidatorSchema = Joi.object(MultipleAdminValidator);

export default MultipleAdminValidatorSchema;

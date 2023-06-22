import Joi from 'joi';

const AdminregisterValidator = {
    username: Joi.string().trim().required().min(3).label("Username").error(new Error('Please enter proper username!')),
    email: Joi.string().trim().required().email().label("Email").error(new Error('Please enter correct email!')),
    password: Joi.string().trim().required().min(6).label("Password").error(new Error('Please enter Valid Password!')),
}

const AdminRegisterValidatorSchema = Joi.object(AdminregisterValidator);

export default AdminRegisterValidatorSchema;

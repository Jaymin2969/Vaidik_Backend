import Joi from 'joi';

const AdminThoughtValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')), 
    thought: Joi.string().required().label("Thought").error(new Error('Please enter Thought!')),
    id: Joi.any(),
}

const AdminThoughtValidatorSchema = Joi.object(AdminThoughtValidator);

export default AdminThoughtValidatorSchema;
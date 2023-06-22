import Joi from 'joi';

const AdminSubscriptionValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    duration: Joi.string().required().label("Duration").error(new Error('Please enter correct Duration!')),
    price: Joi.number().required().label("Price").error(new Error('Please enter correct Price!')),
    isactive: Joi.boolean().required().label("isactive").error(new Error('Please enter correct Isactive!')),
    id: Joi.string().hex().length(24).label("Id").error(new Error('Please enter correct Id!'))
}

const AdminSubscriptionValidatorSchema = Joi.object(AdminSubscriptionValidator);

export default AdminSubscriptionValidatorSchema;

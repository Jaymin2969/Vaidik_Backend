import Joi from "joi";

const AdminChangeSubscriptionPriceValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    price: Joi.number().required().label("Price").error(new Error('Please enter correct Price!')),
    status: Joi.boolean().required().label("status").error(new Error('Please enter correct status!'))
}

const AdminChangeSubscriptionPriceValidatorSchema = Joi.object(AdminChangeSubscriptionPriceValidator);

export default AdminChangeSubscriptionPriceValidatorSchema;
import Joi from "joi";

const AdminSubscriptionStatusValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    status: Joi.boolean().required().label("status").error(new Error('Please enter correct status!'))
}

const AdminSubscriptionStatusValidatorSchema = Joi.object(AdminSubscriptionStatusValidator);

export default AdminSubscriptionStatusValidatorSchema;
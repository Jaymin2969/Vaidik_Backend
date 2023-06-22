import Joi from "joi";

const AdminPaymentGatewayStatusValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    status: Joi.boolean().label("status").error(new Error('Please enter correct status!'))
}

const AdminPaymentGatewayStatusValidatorSchema = Joi.object(AdminPaymentGatewayStatusValidator);

export default AdminPaymentGatewayStatusValidatorSchema;
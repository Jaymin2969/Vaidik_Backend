import Joi from 'joi';

const AdminPaymentGatewayValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')), 
    paymentMethod: Joi.string().required().label("PaymentMethod").error(new Error('Please enter correct PaymentMethod!')),
    status: Joi.boolean().required().label("Status").error(new Error('Please enter correct status')),
    publicKey: Joi.string().when('paymentMethod', {
      is: 'Stripe',
      then: Joi.required()
    }),
    privateKey: Joi.string().when('paymentMethod', {
      is: 'Stripe',
      then: Joi.required()
    }),
    merchantId: Joi.string().when('paymentMethod', {
      is: 'Ccavenue',
      then: Joi.required()
    }),
    accessCode: Joi.string().when('paymentMethod', {
      is: 'Ccavenue',
      then: Joi.required()
    }),
    workingKey: Joi.string().when('paymentMethod', {
      is: 'Ccavenue',
      then: Joi.required()
    }),
    id: Joi.any()
}

const AdminPaymentGatewayValidatorSchema = Joi.object(AdminPaymentGatewayValidator);

export default AdminPaymentGatewayValidatorSchema;

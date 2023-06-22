import Joi from 'joi';

const StudentStripePaymentValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    price: Joi.number().required().label("srno").error(new Error('Please enter correct price!')),
    stripeId: Joi.any(),
}

const StudentStripePaymentValidatorSchema = Joi.object(StudentStripePaymentValidator);

export default StudentStripePaymentValidatorSchema;
            
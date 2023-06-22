import Joi from 'joi';

const StudentSubscriptionValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    subscription: Joi.string().required().label("Subscription").error(new Error('Please enter Valid Subscription!')),
    price: Joi.number().required().label("Price").error(new Error('Please enter Valid Price!'))
}

const StudentSubscriptionValidatorSchema = Joi.object(StudentSubscriptionValidator);

export default StudentSubscriptionValidatorSchema;

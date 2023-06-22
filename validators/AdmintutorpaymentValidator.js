import Joi from 'joi';

const AdmintutorpaymentValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')), 
    paymentId: Joi.any().required(),
    balance: Joi.number().required().label("balance").error(new Error('Please enter balance!'))
}

const AdmintutorpaymentValidatorSchema = Joi.object(AdmintutorpaymentValidator);

export default AdmintutorpaymentValidatorSchema;

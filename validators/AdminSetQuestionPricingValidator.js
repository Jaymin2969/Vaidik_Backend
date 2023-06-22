import Joi from 'joi';

const AdminSetQuestionPricingValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    Type: Joi.string().trim().required().label("Type").error(new Error('Please enter proper Type!')),
    question_price: Joi.number().required().label("question_price").error(new Error('Please enter correct question_price!')),
    tutor_price: Joi.number().required().label("tutor_price").error(new Error('Please enter Valid tutor_price!')),
    admin_price: Joi.number().required().label("admin_price").error(new Error('Please enter Valid admin_price!')),
    id: Joi.any()
}

const AdminSetQuestionPricingValidatorSchema = Joi.object(AdminSetQuestionPricingValidator);

export default AdminSetQuestionPricingValidatorSchema;

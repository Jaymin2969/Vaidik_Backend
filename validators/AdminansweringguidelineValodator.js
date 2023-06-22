import Joi from 'joi';

const AdminAnsweringGuidelineValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    answeringguideline: Joi.any(),
    
}

const AdminAnsweringGuidelineValidatorSchema = Joi.object(AdminAnsweringGuidelineValidator);

export default AdminAnsweringGuidelineValidatorSchema;

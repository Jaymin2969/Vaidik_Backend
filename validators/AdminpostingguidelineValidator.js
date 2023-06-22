import Joi from 'joi';

const AdminPostingGuidelineValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    postingguideline: Joi.any(),
    
}

const AdminPostingGuidelineValidatorSchema = Joi.object(AdminPostingGuidelineValidator);

export default AdminPostingGuidelineValidatorSchema;

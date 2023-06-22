import Joi from 'joi';

const AdminSetReAnswerValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    choice: Joi.boolean().label("choice").error(new Error('Please enter Valid choice!')),
    reanswer_time: Joi.number().label("reanswer_time").error(new Error('Please enter Valid reanswer_time!'))
}

const AdminSetReAnswerValidatorSchema = Joi.object(AdminSetReAnswerValidator);

export default AdminSetReAnswerValidatorSchema;

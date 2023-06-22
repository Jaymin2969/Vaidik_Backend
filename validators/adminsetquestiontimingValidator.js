import Joi from 'joi';

const AdminSetQuestionTimingValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    Type: Joi.string().trim().required().label("Type").error(new Error('Please enter proper Type!')),
    first_time: Joi.number().required().label("first_time").error(new Error('Please enter correct first_time!')),
    second_time: Joi.number().required().label("second_time").error(new Error('Please enter Valid second_time!')),
    skip_time: Joi.number().required().label("skip_time").error(new Error('Please enter Valid skip_time!')),
    total_time: Joi.number().required().label("total_time").error(new Error('Please enter Valid total_time!')),
    tutor_time: Joi.number().required().label("tutor_time").error(new Error('Please enter Valid tutor_time!')),
    admin_time: Joi.number().required().label("admin_time").error(new Error('Please enter Valid admin_time!')),
    unsolved_time: Joi.number().required().label("unsolved_time").error(new Error('Please enter Valid unsolved_time!')),
    id: Joi.any()
}

const AdminSetQuestionTimingValidatorSchema = Joi.object(AdminSetQuestionTimingValidator);

export default AdminSetQuestionTimingValidatorSchema;

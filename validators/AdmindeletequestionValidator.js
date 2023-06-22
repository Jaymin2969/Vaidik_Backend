import Joi from 'joi';

const AdminDeleteQuestionValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    tutorId: Joi.string().hex().length(24).required().label("TutorId").error(new Error('Please enter correct tutorId!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!')),
}

const AdminDeleteQuestionValidatorSchema = Joi.object(AdminDeleteQuestionValidator);

export default AdminDeleteQuestionValidatorSchema;

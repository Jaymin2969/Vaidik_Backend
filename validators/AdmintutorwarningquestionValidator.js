import Joi from 'joi';

const AdmintutorwarningquestionValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')), 
    // userId: Joi.string().required().label("userId").error(new Error('Please enter correct userId!')),
    tutorId: Joi.string().hex().length(24).required().label("TutorId").error(new Error('Please enter correct TutorId!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!'))
}

const AdmintutorwarningquestionValidatorSchema = Joi.object(AdmintutorwarningquestionValidator);

export default AdmintutorwarningquestionValidatorSchema;

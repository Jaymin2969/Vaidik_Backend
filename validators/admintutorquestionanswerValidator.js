import Joi from 'joi';

const AdmintutorquestionanswerValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')), 
    // userId: Joi.string().required().label("userId").error(new Error('Please enter correct userId!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter QuestionId!')),
    question: Joi.string().required().label("Question").error(new Error('Please enter correct Question!')),
    answer: Joi.string().required().label("Answer").error(new Error('Please enter correct Answer!')),
    explanation: Joi.string().label("Expalnation").error(new Error('Please correct Explanation!'))
}

const AdmintutorquestionanswerValidatorSchema = Joi.object(AdmintutorquestionanswerValidator);

export default AdmintutorquestionanswerValidatorSchema;

import Joi from 'joi';

const UpdateQuestionValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!')),
    questionSubject: Joi.string().label("questionSubject").error(new Error('Please enter correct questionSubject!')),
    questionType: Joi.string().label("questionType").error(new Error('Please enter correct questionType!')),
    priceChange: Joi.number().label("priceChange").error(new Error('Please enter correct priceChange!')),
    questionPhoto: Joi.any().label("questionPhoto").error(new Error('Please enter correct questionPhoto!')),
    question_1: Joi.string().label("question").error(new Error('Please enter correct question!'))
};
const UpdateQuestionValidatorSchema = Joi.object(UpdateQuestionValidator);

export default UpdateQuestionValidatorSchema;
import Joi from 'joi';

const QuestionPostValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    question: Joi.string().required().label("question").error(new Error('Please enter correct Question!')),
    questionType: Joi.string().required().label("questiontype").error(new Error('Please enter correct questiontype!')),
    questionSubject: Joi.string().required().label("questionsubject").error(new Error('Please enter correct questionsubject!')),
    questionPhoto: Joi.any().label("questionPhoto").error(new Error('Please enter correct questionPhoto!')),
};
const QuestionPostValidatorSchema = Joi.object(QuestionPostValidator);

export default QuestionPostValidatorSchema;
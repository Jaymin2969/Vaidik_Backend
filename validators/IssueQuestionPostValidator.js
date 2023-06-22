import Joi from 'joi';

const IssueQuestionPostValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    question: Joi.string().required().label("question").error(new Error('Please enter correct Question!')),
    questionType: Joi.string().required().label("questiontype").error(new Error('Please enter correct questiontype!')),
    questionSubject: Joi.string().required().label("questionsubject").error(new Error('Please enter correct questionsubject!')),
    questionPhoto: Joi.any().label("questionPhoto").error(new Error('Please enter correct questionPhoto!')),
    newReason: Joi.number().required().label("newReason").error(new Error('Please enter correct newReason!')),
    newReasonText: Joi.string().required().label("newReasonText").error(new Error('Please enter correct newReasonText!'))
};
const IssueQuestionPostValidatorSchema = Joi.object(IssueQuestionPostValidator);

export default IssueQuestionPostValidatorSchema;
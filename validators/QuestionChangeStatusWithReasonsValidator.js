import Joi from 'joi';

const QuestionChangeStatusWithReasonsValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!')),
    internalStatus: Joi.string().required().label("InternalStatus").error(new Error('Please enter correct InternalStatus!')),
    newReason: Joi.number().required().label("newReason").error(new Error('Please enter correct newReason!')),
    newReasonText: Joi.string().required().label("newReasonText").error(new Error('Please enter correct newReasonText!'))
};
const QuestionChangeStatusWithReasonsValidatorSchema = Joi.object(QuestionChangeStatusWithReasonsValidator);

export default QuestionChangeStatusWithReasonsValidatorSchema;
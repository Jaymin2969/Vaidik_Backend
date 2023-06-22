import Joi from 'joi';

const QuestionChangeStatusValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    // questionId: Joi.any(),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!')),
    internalStatus: Joi.string().required().label("InternalStatus").error(new Error('Please enter correct InternalStatus!'))
};
const QuestionChangeStatusValidatorSchema = Joi.object(QuestionChangeStatusValidator);

export default QuestionChangeStatusValidatorSchema;
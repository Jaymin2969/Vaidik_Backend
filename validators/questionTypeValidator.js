import Joi from 'joi';

const QuestionTypeValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')), 
    // userId: Joi.string().required().label("userId").error(new Error('Please enter correct userId!')),
    questionType: Joi.string().required().label("questionType").error(new Error('Please enter questionType!')),
    id: Joi.any(),
}

const QuestionTypeValidatorSchema = Joi.object(QuestionTypeValidator);

export default QuestionTypeValidatorSchema;

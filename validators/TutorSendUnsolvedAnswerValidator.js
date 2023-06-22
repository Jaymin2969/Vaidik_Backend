import Joi from 'joi';

const TutorSendUnsolvedAnswerValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!')),
    answer: Joi.string().trim().required().label("answer").error(new Error('Please enter correct answer!')),
    explanation: Joi.any().label("explanation").error(new Error('Please enter explanation!'))
}

const TutorSendUnsolvedAnswerValidatorSchema = Joi.object(TutorSendUnsolvedAnswerValidator);

export default TutorSendUnsolvedAnswerValidatorSchema;
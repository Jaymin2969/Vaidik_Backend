import Joi from 'joi';

const QuestionSubjectValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')), 
    // userId: Joi.string().required().label("userId").error(new Error('Please enter correct userId!')),
    questionSubject: Joi.string().required().label("questionSubject").error(new Error('Please enter questionSubject!')),
    id: Joi.any(),
}

const QuestionSubjectValidatorSchema = Joi.object(QuestionSubjectValidator);

export default QuestionSubjectValidatorSchema;

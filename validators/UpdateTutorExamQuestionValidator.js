import Joi from 'joi';

const UpdateTutorExamQuestionValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    question: Joi.string().required().label("question").error(new Error('Please enter correct Question!')),
    mcqoptions: Joi.any(),
    questionSubject: Joi.string().required().label("questionsubject").error(new Error('Please enter correct questionsubject!')),
    answer: Joi.string().label("answer").required().error(new Error('Please enter correct answer'))
};
const UpdateTutorExamQuestionValidatorSchema = Joi.object(UpdateTutorExamQuestionValidator);

export default UpdateTutorExamQuestionValidatorSchema;
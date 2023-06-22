import Joi from 'joi';

const TutorExamQuestionValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    question: Joi.string().required().label("question").error(new Error('Please enter correct Question!')),
    mcqoptions: Joi.any(),
    questionType: Joi.string().required().label("questiontype").error(new Error('Please enter correct questiontype!')),
    questionSubject: Joi.string().required().label("questionsubject").error(new Error('Please enter correct questionsubject!')),
    answer: Joi.string().label("answer").required().error(new Error('Please enter correct answer'))
};
const TutorExamQuestionValidatorSchema = Joi.object(TutorExamQuestionValidator);

export default TutorExamQuestionValidatorSchema;
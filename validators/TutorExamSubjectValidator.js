import Joi from 'joi';

const TutorExamSubjectValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')), 
    subject: Joi.string().required().label("questionSubject").error(new Error('Please enter subject!')),
    subSubjects: Joi.array().items(Joi.string()).required().label("subSubjects").error(new Error('Please enter subSubjects!')),
}

const TutorExamSubjectValidatorSchema = Joi.object(TutorExamSubjectValidator);

export default TutorExamSubjectValidatorSchema;

import Joi from 'joi';

const AddSubjectsValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    subjects: Joi.array().items(Joi.string().required()).required().error(new Error('Please enter correct Subjects!')),
    subjectsWithCooldown: Joi.array().items(Joi.object({
        subjectName: Joi.string().required(),
        cooldownPeriod: Joi.number().required(),
    })).error(new Error('Please enter correct Subjects With Cooldown!'))
};

const TutorAddSubjectValidatorSchema = Joi.object(AddSubjectsValidator);

export default TutorAddSubjectValidatorSchema;
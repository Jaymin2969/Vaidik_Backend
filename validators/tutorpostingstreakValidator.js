import Joi from 'joi';

const TutorPostStreakValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    initial: Joi.number().required().label("Initial").error(new Error('Please enter correct Initial!')),
    extrasum: Joi.number().required().label("Extrasum").error(new Error('Please enter correct Extrasum!')),

}

const TutorPostStreakValidatorSchema = Joi.object(TutorPostStreakValidator);

export default TutorPostStreakValidatorSchema;
            
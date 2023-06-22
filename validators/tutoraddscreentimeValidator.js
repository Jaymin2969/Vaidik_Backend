import Joi from 'joi';

const screenTimeValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    screenTime: Joi.number().required().label("ScreenTime").error(new Error('Please enter Valid Screen Time!')),
}

const TutorAddScreenTimeValidatorSchema = Joi.object(screenTimeValidator);

export default TutorAddScreenTimeValidatorSchema;

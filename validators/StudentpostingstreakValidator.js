import Joi from 'joi';

const StudentPostStreakValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    initial: Joi.number().required().label("Initial").error(new Error('Please enter correct Initial!')),
    extrasum: Joi.number().required().label("Extrasum").error(new Error('Please enter correct Extrasum!')),

}

const StudentPostStreakValidatorSchema = Joi.object(StudentPostStreakValidator);

export default StudentPostStreakValidatorSchema;
            
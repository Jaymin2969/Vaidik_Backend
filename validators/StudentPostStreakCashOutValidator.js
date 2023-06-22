import Joi from 'joi';

const StudentPostStreakCashOutValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    srno: Joi.number().required().label("srno").error(new Error('Please enter correct srno!'))
}

const StudentPostStreakCashOutValidatorSchema = Joi.object(StudentPostStreakCashOutValidator);

export default StudentPostStreakCashOutValidatorSchema;
            
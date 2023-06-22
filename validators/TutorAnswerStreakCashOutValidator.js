import Joi from 'joi';

const TutorAnswerStreakCashOutValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    srno: Joi.number().required().label("srno").error(new Error('Please enter correct srno!'))
}

const TutorAnswerStreakCashOutValidatorSchema = Joi.object(TutorAnswerStreakCashOutValidator);

export default TutorAnswerStreakCashOutValidatorSchema;
            
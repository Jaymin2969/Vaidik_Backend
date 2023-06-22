import Joi from 'joi';

const TutorminbalanceValidator  = {
    token: Joi.string().required().label("Token").error(new Error('please enter correct Token!')),
    minBalance: Joi.number().required().label("MinBalance").error(new Error('Please enter minbalance!')),
};
const TutorminbalanceValidatorSchema = Joi.object(TutorminbalanceValidator);

export default TutorminbalanceValidatorSchema;
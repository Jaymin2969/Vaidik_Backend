import Joi from 'joi';

const TutorReferralCompleteValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    userId: Joi.string().hex().length(24).required().label("UserId").error(new Error('Please enter correct userId!'))
    // email: Joi.string().email().required().label("email").error(new Error('Please enter correct email!'))
    
};
const TutorReferralCompleteValidatorSchema = Joi.object(TutorReferralCompleteValidator);

export default TutorReferralCompleteValidatorSchema;
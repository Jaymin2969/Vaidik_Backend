import Joi from 'joi';

const refreshTokenValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
};
const refreshTokenValidatorSchema = Joi.object(refreshTokenValidator);

export default refreshTokenValidatorSchema;
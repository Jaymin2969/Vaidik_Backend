import Joi from 'joi';

const setInfoValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    name: Joi.string().required().min(3).label("Name").error(new Error('Please enter Valid Name!')),
    email: Joi.string().trim().required().email().label("Email").error(new Error('Please enter Valid Email!')),
    board: Joi.string().required().min(3).label("Board").error(new Error('Please enter Valid Board Name!')),
    city: Joi.string().required().min(3).label("City").error(new Error('Please enter Valid City Name!')),
    school: Joi.string().required().min(3).label("School").error(new Error('Please enter Valid School Name!')),
}

const StudentSetInfoValidatorSchema = Joi.object(setInfoValidator);

export default StudentSetInfoValidatorSchema;

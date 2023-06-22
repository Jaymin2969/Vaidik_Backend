import Joi from 'joi';

const changePasswordValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    password: Joi.string().trim().required().min(3).label("Password").error(new Error('Please enter Valid Password!')),
    new_password: Joi.string().trim().required().min(3).label("New_Password").error(new Error('Please enter New Valid Password!')),
}

const TutorChangePasswordValidatorSchema = Joi.object(changePasswordValidator);

export default TutorChangePasswordValidatorSchema;
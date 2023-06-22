import Joi from 'joi';

const StudentcontactValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')), 
    // userId: Joi.string().required().label("userId").error(new Error('Please enter correct userId!')),
    fullname: Joi.string().required().label("fullname").error(new Error('Please enter fullname!')),
    mobileNo: Joi.number().required().label("mobileNo").error(new Error('Please enter Valid mobileNo!')),
    email: Joi.string().trim().required().email().label("Email").error(new Error('Please enter correct email!')),
    Message: Joi.string().trim().required().label("Message").error(new Error('Please enter Message!'))
}

const StudentcontactValidatorSchema = Joi.object(StudentcontactValidator);

export default StudentcontactValidatorSchema;

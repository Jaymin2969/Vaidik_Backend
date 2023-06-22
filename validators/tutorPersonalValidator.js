import Joi from 'joi';

const personalValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    profilephoto: Joi.string().label("Profilephoto").error(new Error('Please enter profilephoto')),
    name: Joi.string().required().min(3).label("Name").error(new Error('Please enter Valid Name!')),
    country: Joi.string().trim().required().label("Country").error(new Error('Please enter Valid Country!')),
    mobileNo: Joi.string().trim().required().min(10).label("Mobile No.").error(new Error('Please enter Valid Mobile Number!')),
    gender: Joi.string().required().label("Gender").error(new Error('Please enter Valid Gender!')),
    dob: Joi.string().required().label("DOB").error(new Error('Please enter Valid DOB!')),
    experience: Joi.string().required().label("Experience").error(new Error('Please enter Valid Experience!')),
}

const StudentPersonalValidatorSchema = Joi.object(personalValidator);

export default StudentPersonalValidatorSchema;
            
import Joi from "joi";

const StudentLoginValidator = {
    email: Joi.string().trim().required().email().label("Email").error(new Error('Please enter correct email!')),
    password: Joi.string().trim().required().label("Password").error(new Error('Please enter Valid Password!')),
}
const StudentLoginValidatorSchema = Joi.object(StudentLoginValidator);

export default StudentLoginValidatorSchema;
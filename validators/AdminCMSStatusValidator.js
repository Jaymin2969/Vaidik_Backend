import Joi from "joi";

const AdminCMSStatusValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    status: Joi.boolean().required().label("status").error(new Error('Please enter correct status!'))
}

const AdminCMSStatusValidatorSchema = Joi.object(AdminCMSStatusValidator);

export default AdminCMSStatusValidatorSchema;
import Joi from "joi";

const AdminTutorStatusValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    status: Joi.number().required().label("Status").error(new Error('Please enter correct Status!'))
}

const AdminTutorStatusValidatorSchema = Joi.object(AdminTutorStatusValidator);

export default AdminTutorStatusValidatorSchema;
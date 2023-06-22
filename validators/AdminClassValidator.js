import Joi from 'joi';

const AdminClassValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    studentClass: Joi.string().trim().required().label("StudentClass").error(new Error('Please enter Student Class Name!')),
    id: Joi.any()
}

const AdminClassValidatorSchema = Joi.object(AdminClassValidator);

export default AdminClassValidatorSchema;

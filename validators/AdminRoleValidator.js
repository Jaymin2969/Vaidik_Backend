import Joi from 'joi';

const AdminRoleValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    rolename: Joi.string().trim().required().label("Rolename").error(new Error('Please enter rolename!')),
    action: Joi.array().required().label("action").error(new Error('Please enter correct action!')),
    mainpassword: Joi.string().trim().required().min(6).label("Mainpassword").error(new Error('Please enter Valid mainpassword!')),
    id: Joi.any()
}

const AdminRoleValidatorSchema = Joi.object(AdminRoleValidator);

export default AdminRoleValidatorSchema;

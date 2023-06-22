import Joi from 'joi';

const AdminPagesValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    pagename: Joi.string().required().label("PageName").error(new Error('Please enter correct PageName!')),
    subpages: Joi.array().items(Joi.string()).label("Subpages").error(new Error('Please enter correct Subpages!')),
    id: Joi.any()

}

const AdminPagesValidatorSchema = Joi.object(AdminPagesValidator);

export default AdminPagesValidatorSchema;
            
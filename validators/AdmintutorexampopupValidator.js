import Joi from 'joi';

const AdminTutorPopUpValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    content: Joi.string().required().label("Content").error(new Error('Please enter Valid Content!')),
    id: Joi.any()
}

const AdminTutorPopUpValidatorSchema = Joi.object(AdminTutorPopUpValidator);

export default AdminTutorPopUpValidatorSchema;

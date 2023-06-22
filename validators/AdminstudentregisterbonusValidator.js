import Joi from 'joi';

const AdminStudentRegisterBonusValidator = {
    token: Joi.string().required().label("Token").error( new Error('Please enter correct Token!')),
    price: Joi.number().required().label("Price").error(new Error('Please enter correct Price!'))
}

const AdminStudentRegisterBonusValidatorSchema = Joi.object(AdminStudentRegisterBonusValidator);

export default AdminStudentRegisterBonusValidatorSchema;
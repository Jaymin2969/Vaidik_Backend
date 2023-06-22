import Joi from 'joi';

const AdminExamValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    MCQ: Joi.number().required().label("MCQ").error(new Error('Please enter Valid number!')),
    theory: Joi.number().required().label("Theory").error(new Error('Please enter Valid number!'))
}

const AdminExamValidatorValidatorSchema = Joi.object(AdminExamValidator);

export default AdminExamValidatorValidatorSchema;

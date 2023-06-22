import Joi from 'joi';

const AdminInAppropriateQuestionValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!')),
    choice: Joi.number().required().label("choice").error(new Error('Please enter correct choice!')),
};
const AdminInAppropriateQuestionValidatorSchema = Joi.object(AdminInAppropriateQuestionValidator);

export default AdminInAppropriateQuestionValidatorSchema;
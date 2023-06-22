import Joi from "joi";

const AdminRandomTutorExamQuestionsValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    subject: Joi.string().required().label("subject").error(new Error('Please enter correct subject!'))
};
const AdminRandomTutorExamQuestionsValidatorSchema = Joi.object(AdminRandomTutorExamQuestionsValidator);

export default AdminRandomTutorExamQuestionsValidatorSchema;
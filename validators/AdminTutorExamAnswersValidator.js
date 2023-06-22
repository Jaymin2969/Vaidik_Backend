import Joi from "joi";

const AdminTutorExamAnswersValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    subject: Joi.string().required().label("Subject").error(new Error('Please enter correct Subject!')),
    questions: Joi.any().label("subject").error(new Error('Please enter correct subject!'))
};
const AdminTutorExamAnswersValidatorSchema = Joi.object(AdminTutorExamAnswersValidator);

export default AdminTutorExamAnswersValidatorSchema;
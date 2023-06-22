import Joi from 'joi';

const AdminUpdateIssueSubjectValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!')),
    questionSubject: Joi.string().label("questionSubject").error(new Error('Please enter correct questionSubject!'))
};
const AdminUpdateIssueSubjectValidatorSchema = Joi.object(AdminUpdateIssueSubjectValidator);

export default AdminUpdateIssueSubjectValidatorSchema;
import Joi from "joi";

const AdminIssueSolvedValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!'))
}

const AdminIssueSolvedValidatorSchema = Joi.object(AdminIssueSolvedValidator);

export default AdminIssueSolvedValidatorSchema;
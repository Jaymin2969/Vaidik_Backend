import Joi from "joi";

const StudentReAnswerValidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!')),
    studentResponce: Joi.string().trim().required().label("studentResponse").error(new Error('Please enter correct studentResponse!')),
    remarks: Joi.string().trim().label("remarks").error(new Error('Please enter Valid remarks!'))
}
const StudentReAnswerValidatorSchema = Joi.object(StudentReAnswerValidator);

export default StudentReAnswerValidatorSchema;
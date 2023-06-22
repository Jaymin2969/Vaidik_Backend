import Joi from "joi";

const TutorCheckUnsolvedQuestionvalidator = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    questionId: Joi.string().hex().length(24).required().label("QuestionId").error(new Error('Please enter correct QuestionId!'))
}
const TutorCheckUnsolvedQuestionvalidatorSchema = Joi.object(TutorCheckUnsolvedQuestionvalidator);

export default TutorCheckUnsolvedQuestionvalidatorSchema;
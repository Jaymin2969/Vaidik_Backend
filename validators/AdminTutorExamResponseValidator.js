import Joi from "joi";

const AdminTutorExamResponseValidator  = {
    token: Joi.string().required().label("Token").error(new Error('Please enter correct Token!')),
    examId: Joi.string().hex().length(24).required().label("ExamId").error(new Error('Please enter correct ExamId!')),
    tutorId: Joi.string().hex().length(24).required().label("tutorId").error(new Error('Please enter correct tutorId!')),
    veridict: Joi.number().required().label("veridict").error(new Error('Please enter correct veridict!')),
    finalScore: Joi.number().required().label("finalScore").error(new Error('Please enter correct finalScore!')),
    mcqScore: Joi.number().required().label("mcqScore").error(new Error('Please enter correct mcqScore!')),
    theoryScore: Joi.number().required().label("theoryScore").error(new Error('Please enter correct theoryScore!')),
    theoryQA: Joi.any().required().label("theoryQA").error(new Error('Please enter correct theoryQA!'))
};
const AdminTutorExamResponseValidatorSchema = Joi.object(AdminTutorExamResponseValidator);

export default AdminTutorExamResponseValidatorSchema;
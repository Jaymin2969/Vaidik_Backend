import mongoose from "mongoose";

const TutorExamQuestionsSchema = new mongoose.Schema({
    question: { type: String, required: true },
    mcqoptions: [{ type: String }],
    answer: { type: String, required: true },
    questionType: { type: String, required: true },
    questionSubject: { type: String, required: true }
});
export default mongoose.model('TutorExamQuestions', TutorExamQuestionsSchema, 'TutorExamQuestions');

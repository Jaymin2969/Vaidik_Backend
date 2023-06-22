import mongoose from "mongoose";

const StudentQuestionsSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegister', required: true },
    postquestions: { type: Number, required: true, default: 0 },
    refer1cashedout: { type: Boolean, required: true, default: false },
    refer2cashedout: { type: Boolean, required: true, default: false },
    refer3cashedout: {type: Boolean, required: true, default: false },
    refer4cashedout: { type: Boolean, required: true, default: false },
    allQuestions: [{
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MainQuestions', required: true },
        question: { type: String, required: true },
        questionPhoto: [{
            type: String,
            required: true
        }],
        questionType: { type: String, required: true },
        questionSubject: { type: String, required: true },
        questionPrice: { type: Number, required: true },
        dateOfPosted: { type: Date, required: true },
        status: { type: String, required: true }
    }]
});
export default mongoose.model('StudentQuestions', StudentQuestionsSchema, 'StudentQuestions');

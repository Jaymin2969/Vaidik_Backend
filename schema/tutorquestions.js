import mongoose from "mongoose";

const TutorQuestionsSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: true },
    answeredquestions: { type: Number, required: true, default: 0 },
    refer1cashedout: { type: Boolean, required: true, default: false },
    refer2cashedout: { type: Boolean, required: true, default: false },
    refer3cashedout: { type: Boolean, required: true, default: false },
    refer4cashedout: { type: Boolean, required: true, default: false },
    allQuestions: [{
        _id: false,
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MainQuestions', required: true },
        question: { type: String, required: true },
        questionType: { type: String, required: true },
        questionSubject: { type: String, required: true },
        questionPhoto: [{
            type: String,
            required: true
        }],
        tutorPrice: { type: Number, required: true },
        answer: { type: String, required: false },
        explanation: { type: String, required: false },
        status: { type: String, required: true },
        // timeRemaining: { type: Number, required: true },
        isWarning : { type: Boolean, required: false, default: false }
    }],
    pendingQuestions: [{
        _id: false,
        questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'MainQuestions', required: true },
        question: { type: String, required: true },
        questionType: { type: String, required: true },
        questionSubject: { type: String, required: true },
        questionPhoto: [{
            type: String,
            required: true
        }],
        tutorPrice: { type: Number, required: true },
        status: { type: String, required: true },
    }],
        warningquestionId : [{ type: mongoose.Schema.Types.ObjectId, ref: 'MainQuestions', required: false }],
    stats: {
        upvoteQuestions: { type: Number, required: true, default: 0 },
        downvoteQuestions: { type: Number, required: true, default: 0 }
        // Add more fields as needed
    }
});
export default mongoose.model('TutorQuestions', TutorQuestionsSchema, 'TutorQuestions');


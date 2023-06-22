import mongoose from "mongoose";

const TutorSubjectsSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: true },
    examGiven: [{
        subject: { type: String, required: true },
        examId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminTutorExamAnswers', required: true },
        date: { type: Date, required: true },
        result: { type: Number, required: true }, // result 2 - not check, 1 - pass, 0 - fail
    }],
    subjects: [{
        type: String,
        required: true
    }],
    subjectsWithoutCooldown: [{
        type: String,
        required: true
    }],
    subjectsWithCooldown: [{
        _id: false,
        subjectName: { type: String, required: true },
        cooldownPeriod: { type: Date, required: true }
    }]
});
export default mongoose.model('TutorSubjects', TutorSubjectsSchema, 'TutorSubjects');

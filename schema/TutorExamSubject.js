import mongoose from 'mongoose';

const TutorExamSubjectSchema = new mongoose.Schema({
    subject : { type: String , required: true },
    subSubjects: [{ type: String, required: true }]
});

export default mongoose.model('TutorExamSubject', TutorExamSubjectSchema, 'TutorExamSubject');

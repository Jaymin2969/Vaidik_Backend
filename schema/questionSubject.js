import mongoose from 'mongoose';

const QuestionSubjectSchema = new mongoose.Schema({
    questionSubject : { type: String , required: true }
});

export default mongoose.model('QuestionSubject', QuestionSubjectSchema, 'QuestionSubject');

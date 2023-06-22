import mongoose from 'mongoose';

const QuestionTypeSchema = new mongoose.Schema({
    questionType : { type: String , required: true }
});

export default mongoose.model('QuestionType', QuestionTypeSchema, 'QuestionType');

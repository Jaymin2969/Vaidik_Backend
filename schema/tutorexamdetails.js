import mongoose from 'mongoose';

const TutorExamDetailsSchema = new mongoose.Schema({
    MCQ : { type: Number , required: true },
    theory : { type: Number, required: true }
},{ timestamps: true });

export default mongoose.model('TutorexamDetails', TutorExamDetailsSchema, 'TutorexamDetails');

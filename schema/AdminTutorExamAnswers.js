import mongoose from 'mongoose';

const AdminTutorExamAnswersSchema = new mongoose.Schema({
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister' },
    isDone: { type: Number, required: true },
    examSubject: { type: String, required: true },
    veridict: { type: Number, required: true },
    examDate: { type: Date, default: Date.now },
    finalScore: { type: Number, required: true },
    mcqScore: { type: Number, required: true },
    mcqTotal: { type: Number, required: true },
    theoryScore: { type: Number, required: true },
    theoryTotal: { type: Number, required: true },
    theoryQA: [{
        _id: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister' },
        question: { type: String, required: true },
        questionType: { type: String, required: true },
        questionSubject: { type: String, required: true },
        tutorAnswer: { type: String, required: true },
        realAnswer: { type: String, required: true },
        adminmarks: { type: Number, required: true }
    }]

  });
  

export default mongoose.model('AdminTutorExamAnswers', AdminTutorExamAnswersSchema, 'AdminTutorExamAnswers');


/*
veridict 

2 - for new entry not check by admin
1 - Tutor Pass
0 - Tutor Fail

*/
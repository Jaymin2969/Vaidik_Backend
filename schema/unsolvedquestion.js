import mongoose from "mongoose";

const UnsolvedQuestionsSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Mainquestions', required: true },
  question: { type: String, required: true },
    questionPhoto: [{
        type: String,
        required: true
      }],  
    questionType: { type: String, required: true },
    questionSubject: { type: String, required: true },
    tutorPrice: { type: Number, required: true },
    status: { type: String, required: true },
    internalStatus: { type: String, required: false },
    tutorId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: false },
    que_timer_end: { type: Date, required: false }
});
export default mongoose.model('UnsolvedQuestions', UnsolvedQuestionsSchema, 'UnsolvedQuestions');

/*

internalStatus - we have different status
                  
                  AssignedWithFindResponse

                  for new question asssigned to tutor - AssignedWithFindResponse
                  if tutor from no activity status is same but assigned to new tutor, using cron
                  if tutor has some activity then change status - AssignedWithResponse

                  AssignedWithResponse

                  if tutor from no activity status or skips or exits then status - AssignedWithFindResponse and find new tutor, using cron
                  if tutor has choose answer now then change status - AssignedAnswer

                  AssignedAnswer

                  if tutor skips before skipping time then change status to - AssignedWithFindResponse and find new tutor, using cron
                  if tutor don't skip - then change status to - FixedAnswer

                  FixedAnswer

                  if tutor gives answer then - Answered
                  if tutor don't give answer hen change status to - AssignedWithFindResponse and find new tutor, using cron and add one downvote to tutor for not answering the question



que_timer_end - for storing the warning time of the internalStatus to be checked by cron

createdAt - question creation time which will be use by cron
               if 1 day not passed then whomto_ask = tutor
               if 1 day to 2 day not passed then whomto_ask = admin
               if 2 day to 3 day not passed then whomto_ask = unsolved
               if 3 day passed then whomto_ask = null => no answer than refund





*/

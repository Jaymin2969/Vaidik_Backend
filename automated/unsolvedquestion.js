import { MainQuestionsSchema, QuestionTimingSchema, TutorQuestionsSchema, UnsolvedQuestionsSchema } from "../schema/index.js";
import cron from "cron";
import { findTutorAndAssignQuestion } from "../controller/findTutorAndAssignQuestion.js";
import { connectDB } from "../database/index.js";
import { changestatus } from "./question_flow.js";

connectDB();


const updateInternalStatusJob = new cron.CronJob("*/40 * * * * *", async function () {
  // Your code here
  // const now = new Date();
  const questions = await UnsolvedQuestionsSchema.find({ internalStatus: { $in: [ "AssignedAnswer", "FixedAnswer"]}});
  var question;
  console.log("questions - ", questions);
  if (questions.length !== 0) {
    for (var i = 0; i < questions.length; i++) {
      await updateInternalStatus(questions[i]);
    }
  }

  // for(question in questions) {
  //   await updateInternalStatus(question);
  // }
});

updateInternalStatusJob.start();

async function updateInternalStatus(question) {
    
const now = new Date();
    if (question.que_timer_end) {
  
  
      const timeLeft = question.que_timer_end.getTime() - now.getTime();
      console.log("timeleft = ", timeLeft);
  
      // Get the question timing
      const questionTiming = await QuestionTimingSchema.findOne({ Type: question.questionType });
  
      // Default new status
      let newStatus = question.internalStatus;
  
      // Check the current status and elapsed time
      switch (question.internalStatus) {
        case 'AssignedAnswer':
          if (timeLeft <= 0) {
  
            // Set the new status to FixedAnswer
            newStatus = 'FixedAnswer';
            var rem_time = questionTiming.total_time;
            var skip_time = questionTiming.skip_time;
            var new_time = rem_time - skip_time;
            console.log("isint = ",Number.isInteger(new_time));
            console.log("new_time = ", new_time);
            var currentTimePlusExtra = new Date();
            currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + new_time);
            question.que_timer_end = currentTimePlusExtra;
            question.internalStatus = newStatus;
            await question.save();
          }
          break;
        case 'FixedAnswer':
            if (timeLeft <= 0) {
  
                var change = await changestatus(question, "Expired");
      
                if (!change) {
                  console.log("error - null");
                }
      
                const updatedQuestion = await TutorQuestionsSchema.findOneAndUpdate(
                  {
                    tutorId: question.tutorId,
                    'allQuestions.questionId': question._id
                  },
                  {
                    $inc: {
                      'stats.downvoteQuestions': 1
                    }
                  },{
                    new: true // return the updated document
                  });
      
                  console.log("updated - ", updatedQuestion);
      
                // Set the new status to Expired
                newStatus = '';
                // findTutorAndAssignQuestion(question);
                question.internalStatus = newStatus;
                await question.save();
            }
  
          break;
        default:
          break;
      }
    }
} 
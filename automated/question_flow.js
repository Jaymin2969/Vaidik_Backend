import { MainQuestionsSchema, QuestionTimingSchema, TutorQuestionsSchema, TutorRegisterSchema } from "../schema/index.js";
import cron from "cron";
import { findTutorAndAssignQuestion } from "../controller/findTutorAndAssignQuestion.js";
import { connectDB } from "../database/index.js";
import { AwsInstance } from "twilio/lib/rest/accounts/v1/credential/aws.js";

connectDB();


const updateInternalStatusJob = new cron.CronJob("*/40 * * * * *", async function () {
  // Your code here
  // const now = new Date();
  const questions = await MainQuestionsSchema.find({ internalStatus: { $in: ["AssignedWithFindResponse", "AssignedWithResponse", "AssignedAnswer", "FixedAnswer", "ReAnswerAssignedWithFindResponse", "ReAnswerAssignedWithResponse", "ReAnswerAssignedAnswer", "ReAnswerFixedAnswer"] }, whomto_ask: { $in : ["tutor", "unsolved", "reanswer"] } });
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
  console.log("question - ", question);

  if(question.whomto_ask === 'tutor') {
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
        case 'AssignedWithFindResponse':
          if (timeLeft <= 0) {
            var change = await changestatus1(question, "No Response");
  
            if (!change) {
              console.log("error - null");
            }
            // Set the new status to 
            newStatus = 'AssignedWithFindResponse';
            findTutorAndAssignQuestion(question);
            // question.internalStatus = newStatus;
            // await question.save();
          }
          break;
        case 'AssignedWithResponse':
          if (timeLeft <= 0) {
  
            var change = await changestatus(question, "No Response");
  
            if (!change) {
              console.log("error - null");
            }
  
            // Set the new status to Expired
            newStatus = 'AssignedWithFindResponse';
            findTutorAndAssignQuestion(question);
            // question.internalStatus = newStatus;
            // await question.save();
          }
          break;
        case 'AssignedAnswer':
          if (timeLeft <= 0) {
  
            // var change = await changestatus(question, "No Response");
  
            // if (!change) {
            //   console.log("error - null");
            // }
  
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
          if (question.answer) {
  
  
            // Set the new status to Answered
            newStatus = 'Answered';
            question.internalStatus = newStatus;
            await question.save();
          } else if (timeLeft <= 0) {
  
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
            newStatus = 'AssignedWithFindResponse';
            findTutorAndAssignQuestion(question);
            // question.internalStatus = newStatus;
  
          }
  
          break;
        default:
          break;
      }
    }
  } else if(question.whomto_ask === 'admin') {

  } else if(question.whomto_ask === 'unsolved') {
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
          if (question.answer) {
  
  
            // Set the new status to Answered
            newStatus = 'Answered';
            question.internalStatus = newStatus;
            await question.save();
          } else if (timeLeft <= 0) {
  
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
  } else if(question.whomto_ask === 'reanswer') {
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
        case 'ReAnswerAssignedWithFindResponse':
          if (timeLeft <= 0) {
            var change = await changestatus(question, "No Response");
  
            if (!change) {
              console.log("error - null");
            }
            // Set the new status to 
            newStatus = 'ReAnswerAssignedWithFindResponse';
            findTutorAndAssignQuestion(question);
            // question.internalStatus = newStatus;
            // await question.save();
          }
          break;
        case 'ReAnswerAssignedWithResponse':
          if (timeLeft <= 0) {
  
            var change = await changestatus(question, "No Response");
  
            if (!change) {
              console.log("error - null");
            }
  
            // Set the new status to Expired
            newStatus = 'ReAnswerAssignedWithFindResponse';
            findTutorAndAssignQuestion(question);
            // question.internalStatus = newStatus;
            // await question.save();
          }
          break;
        case 'ReAnswerAssignedAnswer':
          if (timeLeft <= 0) {
  
            // var change = await changestatus(question, "No Response");
  
            // if (!change) {
            //   console.log("error - null");
            // }
  
            // Set the new status to FixedAnswer
            newStatus = 'ReAnswerFixedAnswer';
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
        case 'ReAnswerFixedAnswer':
          if (question.answer) {
  
  
            // Set the new status to Answered
            newStatus = 'Answered';
            question.internalStatus = newStatus;
            await question.save();
          } else if (timeLeft <= 0) {
  
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
            newStatus = 'ReAnswerAssignedWithFindResponse';
            findTutorAndAssignQuestion(question);
            // question.internalStatus = newStatus;
  
          }
  
          break;
        default:
          break;
      }
    }
  }



  // Update the question status

}



const changestatus = async (question, update) => {
  console.log("question in - ", question);
  const updatedQuestion = await TutorQuestionsSchema.findOneAndUpdate(
    {
      tutorId: question.tutorId,
      'allQuestions.questionId': question._id
    },
    {
      $set: {
        'allQuestions.$.status': update
      }
    },{
      new: true // return the updated document
    });

  console.log(updatedQuestion);


  var tut_que = await TutorQuestionsSchema.findOne({ tutorId: question.tutorId });

  if(tut_que.pendingQuestions.length === 0) {
    var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(question.tutorId, {
      $set: {
        assignquestionId: "",
        questionassigned: false
      }
    }, {new: true});
  } else {

    var id = tut_que.pendingQuestions[tut_que.pendingQuestions.length - 1].questionId;
    var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(question.tutorId, {
      $set: {
        assignquestionId: id,
        questionassigned: true
      }
    }, {new: true});
  }

  if (updatedQuestion) {
    return true;
  } else {
    return false;
  }
}

const changestatus1 = async (question, update) => {
  console.log("question in - ", question);

  const updatedQuestion = await TutorQuestionsSchema.updateOne(
    { tutorId: question.tutorId,
      'pendingQuestions.questionId': question._id 
    },
    { $pull: { pendingQuestions: { questionId: question._id } } },
    { multi: true });

    var tut_que = await TutorQuestionsSchema.findOne({ tutorId: question.tutorId });

    if(tut_que.pendingQuestions.length === 0) {
      var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(question.tutorId, {
        $set: {
          assignquestionId: "",
          questionassigned: false
        }
      }, {new: true});
    } else {
  
      var id = tut_que.pendingQuestions[tut_que.pendingQuestions.length - 1].questionId;
      var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(question.tutorId, {
        $set: {
          assignquestionId: id,
          questionassigned: true
        }
      }, {new: true});
    }
  

  // const updatedQuestion = await TutorQuestionsSchema.findOneAndUpdate(
  //   {
  //     tutorId: question.tutorId,
  //     'pendingQuestions.questionId': question._id
  //   },
  //   {
  //     $set: {
  //       'pendingQuestions.$.status': update
  //     }
  //   },{
  //     new: true // return the updated document
  //   });

  console.log(updatedQuestion);

  if (updatedQuestion) {
    return true;
  } else {
    return false;
  }
}
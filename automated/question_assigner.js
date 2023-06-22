import { CentralTransactionsSchema, MainQuestionsSchema, QuestionTimingSchema, ReAnswerChoiceSchema, StudentInformationSchema, StudentWalletSchema, TutorQuestionsSchema } from "../schema/index.js";
import cron from "cron";
import { findTutorAndAssignQuestion } from "../controller/findTutorAndAssignQuestion.js";
import { connectDB } from "../database/index.js";
import generateTransactionId from '../controller/generateTransactionId.js';

connectDB();


var all_timing;

const questionAssignerJob = new cron.CronJob("*/45 * * * * *", async function () {
  // Your code here

  all_timing = await QuestionTimingSchema.find();

  const now = new Date();
  const questions = await MainQuestionsSchema.find({ internalStatus: { $in: ["AssignedWithFindResponse", "AssignedWithResponse", "admin", "", "ReAnswerAssignedWithFindResponse", "ReAnswerAssignedWithResponse", "ReAnswerAssignedAnswer", "ReAnswerFixedAnswer"] } });
  var question;
  console.log("questions in assign - ", questions);
  if (questions.length !== 0) {
    for (var i = 0; i < questions.length; i++) {
      await questionassign(questions[i]);
    }
  }

});

questionAssignerJob.start();

async function questionassign(question) {
  console.log("assigned question - ", question);
  const now = new Date();
  if (question.whomto_ask === 'tutor') {

    if (question.internalStatus === 'AssignedWithFindResponse' || question.internalStatus === 'AssignedWithResponse') {

      const newdoc = all_timing.find(doc => doc.Type === question.questionType);
      const tutor_time = newdoc.tutor_time;

      var currentTimePlusExtra = new Date(question.createdAt);
      currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + tutor_time);

      const timeLeft = currentTimePlusExtra.getTime() - now.getTime();
      console.log("timeleft = ", timeLeft);

      if (timeLeft <= 0) {

        console.log("changed to admin");

        var change = await changestatus(question, "No Response");

        if (!change) {
          console.log("error - null");
        }

        question.internalStatus = "admin";
        question.whomto_ask = "admin";
        await question.save();
        console.log("updated question - ", question);
      }

    }
  } else if (question.whomto_ask === 'admin') {

    // if (question.internalStatus === 'admin') {

    const newdoc = all_timing.find(doc => doc.Type === question.questionType);
    const tutor_time = newdoc.tutor_time;
    const admin_time = newdoc.admin_time;

    const new_time = tutor_time + admin_time;

    var currentTimePlusExtra = new Date(question.createdAt);
    currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + new_time);

    const timeLeft = currentTimePlusExtra.getTime() - now.getTime();
    console.log("timeleft = ", timeLeft);

    if (timeLeft <= 0) {
      question.internalStatus = "";
      question.whomto_ask = "unsolved";
      await question.save();
      console.log("admin to unsolved - ", question);
    }

    // }

  } else if (question.whomto_ask === 'unsolved') {
    if (question.internalStatus === '') {

      const newdoc = all_timing.find(doc => doc.Type === question.questionType);
      const tutor_time = newdoc.tutor_time;
      const admin_time = newdoc.admin_time;
      const unsolved_time = newdoc.unsolved_time;

      const new_time = tutor_time + admin_time + unsolved_time;

      var currentTimePlusExtra = new Date(question.createdAt);
      currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + new_time);

      const timeLeft = currentTimePlusExtra.getTime() - now.getTime();
      console.log("timeleft = ", timeLeft);

      if (timeLeft <= 0) {
        question.internalStatus = "refund initiated";

        // student refund to be done later

        await question.save();

        var typename = questionTypeName(question.questionType);

        var st_wal = await StudentWalletSchema.findOne({studentId: question.studentId});

        st_wal.availableAmount += parseFloat(question.questionPrice);
        st_wal.totalAmount = parseFloat(st_wal.availableAmount) + parseFloat(st_wal.redeemableAmount);

        const transaction = {
          transactionId: await generateTransactionId(),
          date: new Date(),
          type: "Refund",
          amount: parseFloat(question.questionPrice),
          description: `Refund for ${typename} question`,
          status: "Success",
          balance: st_wal.availableAmount
        };
        let name;
        let studentname = await StudentInformationSchema.findOne({ userId: st_wal.studentId });
        name = "student";
        if(studentname){
          name = studentname.name
        }


        const centraltransaction = {
          category: "Student",
          walletId: st_wal._id,
          transactionId: transaction.transactionId,
          name: name,
          date: transaction.date,
          type: transaction.type,
          questionId:question._id,
          amount: transaction.amount,
          description: transaction.description,
          status: transaction.status,
          balance: transaction.balance 
        }

        const centaltransactiondetails = await CentralTransactionsSchema.create({
          category: "Student",
          walletId: st_wal._id,
          transactionId: transaction.transactionId,
          name: name,
          date: transaction.date,
          type: transaction.type,
          questionId:question._id,
          amount: transaction.amount,
          description: transaction.description,
          status: transaction.status,
          balance: transaction.balance
        })
        if(!centaltransactiondetails) {
          console.log("central transaction not found");
        }
        await centaltransactiondetails.save();
        
        st_wal.walletHistory.unshift(transaction);
        await st_wal.save();


        console.log("unsolved to refund - ", question);
      }

    }
  } else if (question.whomto_ask === 'reanswer') {
    // const newdoc = all_timing.find(doc => doc.Type === question.questionType);
    // const tutor_time = newdoc.tutor_time;1

    var reans_time = await ReAnswerChoiceSchema.findOne();
    reans_time = reans_time.reanswer_time;
    console.log(reans_time);

    var currentTimePlusExtra = new Date(question.createdAt);
    currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + reans_time);

    const timeLeft = question.answerClosingAt.getTime() - now.getTime();
    console.log("timeleft = ", timeLeft);

    if (timeLeft <= 0) {

      console.log("changed to reanswer unsolved");

      var change = await changestatus(question, "No Response");

      if (!change) {
        console.log("error - null");
      }

      question.internalStatus = "Answered";
      question.whomto_ask = "reanswer";
      question.status = "Closed";
      await question.save();
      console.log("updated question - ", question);
    }

  }
}



// Update the question status



const changestatus = async (question, update) => {
  console.log("question in assigner - ", question);
  const updatedQuestion = await TutorQuestionsSchema.findOneAndUpdate(
    {
      tutorId: question.tutorId,
      'allQuestions.questionId': question._id
    },
    {
      $set: {
        'allQuestions.$.status': update
      }
    }, {
    new: true // return the updated document
  });

  console.log("After updatedQuestion assigner - ", updatedQuestion);

  if (updatedQuestion) {
    return true;
  } else {
    return false;
  }
}

function questionTypeName(Type) {
  var ans;
  if(Type === 'MCQ') {
      ans = "MCQ";
  } else if (Type === 'MCQ-exp') {
      ans = "MCQ With Explanation";
  } else if (Type === 'TrueFalse') {
      ans = "True-False";
  } else if (Type === 'TrueFalse-exp') {
      ans = "True-False With Explanation";
  } else if (Type === 'FillInBlanks') {
      ans = "Fill In Blanks";
  } else if (Type === 'FillInBlanks-exp') {
      ans = "Fill In Blanks With Explanation";
  } else if (Type === 'ShortAnswer') {
      ans = "Short Answer";
  } else if (Type === 'ShortAnswer-exp') {
      ans = "Short Answer With Explanation";
  } else if (Type === 'MatchTheFollowing-less5') {
      ans = "Match The Following(Only till 5 questions)";
  } else if (Type === 'MatchTheFollowing-more5') {
      ans = "Match The Following(Above 5 - 10 questions)";
  } else if (Type === 'Definations') {
      ans = "Define the following";
  } else if (Type === 'CaseStudy-less3') {
      ans = "Case Study Till 3 Sub Type";
  } else if (Type === 'CaseStudy-more3') {
      ans = "Case Study More Than 3 Sub Type";
  } else if (Type === 'Writing') {
      ans = "Writing Based";
  } else if (Type === 'LongAnswer') {
      ans = "Long Answer";
  } else if (Type === 'ProblemSolving') {
      ans = "Problem Solving";
  } else  {
      ans = " ";
  }

  return ans;
}

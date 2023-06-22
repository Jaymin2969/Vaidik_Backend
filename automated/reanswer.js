import cron from "cron"
import { connectDB } from "../database/index.js";
import moment from 'moment-timezone';
import { CentralTransactionsSchema, MainQuestionsSchema, ReAnswerChoiceSchema, StudentQuestionsSchema, TutorBankDetailsSchema, TutorPersonalSchema, TutorRegisterSchema, TutorWalletSchema, TutorsPaymentSchema } from "../schema/index.js";
import e from "express";

connectDB();

// Set the date/time when the timer ends
// const endTime = new Date('2023-06-15T12:00:00Z');

// Schedule a cron job to run every minute to check if 12 hours have passed
const reanswer = new cron.CronJob('* * * * *', async () => {
    try {
      
        const now = new Date();
        const timeDiff = now.getTime() - endTime.getTime();
        const hoursDiff = Math.floor(timeDiff / (1000 * 60 * 60));


        // If 12 hours have passed since the end time, log the time
        if (hoursDiff >= 12) {

          var reanswerchoice = await ReAnswerChoiceSchema.findOne();
          // console.log(reanswerchoice);
          reanswerchoice = reanswerchoice.choice;

          if(reanswerchoice === true) {

       const question = await MainQuestionsSchema.findOneAndUpdate(
          { status: 'NotOpened', que_timer_end: { $lt: now } },
          { $set: { status: 'Closed' } }
        );
        if (question) {

            var tutorId = question.tutorId;

            var tut_wal = await TutorWalletSchema.findOne({ tutorId: tutorId });
            if(tut_wal){

              const tutorstatus = await TutorRegisterSchema.findOne({_id: tutorId});
                      if(!tutorstatus){
                        return res.status(400).json({ status: 0, error: "tutor status not found" });
                      }
                // console.log("tutor wallet not found");

                if(tutorstatus === 1){

                }else{
                  
            tut_wal.pendingAmount -= parseFloat(question.tutorPrice);
            tut_wal.availableAmount += parseFloat(question.tutorPrice);
            tut_wal.earningAmount += parseFloat(question.tutorPrice);

            tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);

            await TutorWalletSchema.findOneAndUpdate(
                { tutorId, 'walletHistory.questionId': question._id },
                { $set: { 'walletHistory.$.date': new Date(),
                        'walletHistory.$.status': "Success",
                        'walletHistory.$.balance': tut_wal.availableAmount
                } },
                { arrayFilters: [{ 'elem.questionId': question._id }], new: true }
              )
                .then(async result => {
                  if (result) {
                    console.log(`TutorWallet document updated for questionId ${question._id}`);

                    result.map((value)=>{
                        // console.log(value.walletHistory)
                        value.walletHistory.map(async (value)=>{
                            // console.log(value)
                            let transactionId = value.transactionId;
                            console.log(transactionId);
                            await CentralTransactionsSchema.findOneAndUpdate(
                                        { transactionId, questionId : question._id },
                                        { $set: { "date": new Date(),
                                                "status": "Success",
                                                "balance": tut_wal.availableAmount
                                        } }
                                      )
                                        .then(result => {
                                          if (result) {
                                            console.log(`Transaction details document updated for questionId ${question._id}`);
                                            // console.log(result);
                                          } else {
                                            console.log(`No Transaction details document found for questionId ${question._id}`);
                                            return false;
                                          }
                                        })
                                        .catch((err) => {
                                            console.error(err)
                                        });
                        })

                      })

                      await tut_wal.save();
                    // console.log(result);
                  } else {
                    console.log(`No TutorWallet document found for questionId ${question._id}`);
                  }
                  
                })
                .catch((err) => {
                    console.error(err);
                });
              } 
              }
             await StudentQuestionsSchema.findOneAndUpdate(
                { "allQuestions.questionId": question._id },
                {
                    $set: {
                        "allQuestions.$.status": "Closed",
                    }
                },
                (err, result) => {
                    if (err) {
                        console.log('Error:', err);
                        return res.status(400).json({ status: 0, error: "Question Not Found" });
                    } else {
                        console.log('Result:', result);
                    }
                }
            ); 
            console.log(`Question updated successfully`);
          } else {
            console.log('No questions updated');
          }
        }else{
          console.log("reanswer not available");
        }    
      }else{
        return false;
      }  

    } catch (error) {
      console.error('Error updating closed questions:', error);
    }
  });

  reanswer.start();
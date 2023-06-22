import cron from "cron";
import { connectDB } from "../database/index.js";
import { StudentInformationSchema, StudentRegisterSchema, StudentWalletSchema } from "../schema/index.js";
import emailSender from "../controller/emailsender.js";
import studentsubscriptionexpiredTemplate from "../emailtemplates/studentsubscriptionexpired.js";


connectDB();

// Run the task every day at midnight (00:00)
const subscription = new cron.CronJob('0 0 * * *', async () => {
  const now = new Date();
  const expiredStudents = await StudentWalletSchema.find({ planEndingDate: { $lt: now }, isSubscribed: true });

  for (const student of expiredStudents) {
    const result = await StudentWalletSchema.findOneAndUpdate(
      { _id: student._id },
      { $set: {
          "isSubscribed": false,
          "planType": "",
          "planStartingDate": null,
          "planEndingDate": null,
          "planPrice": 0
        }
      }
    );

    if(!result){
      console.log("student wallet not update");
      return false;
    }
    console.log(`Updated ${result.nModified} documents for student ${student._id}`);
    
    const stu_infor = await StudentRegisterSchema.findOne({ _id: expiredStudents.studentId });

    if(!stu_infor){
      console.log("student information not found");
      return false
    }

            const stu_name = await StudentInformationSchema.findOne({userId: expiredStudents.studentId});
            

            const emailContent = studentsubscriptionexpiredTemplate(stu_name.name);

            const subject = "DoubtQ - subscription has expired";

            let emailsent = await emailSender(subject, emailContent, stu_infor.email);
            if (emailsent === "Email sent") {
              // const message = "Register verified link Sent to Mail Successfully.";
              console.log(emailsent);
              // return res.status(200).json({ status: 1, message });
            } else {
              const error = "Mail Sending was Unsuccessful.";
              console.log(error);
              // return res.status(401).json({ status: 0, error });
            }
  }
});

subscription.start();
// import AWS from "aws-sdk";
// import { AWS_ACCESS_KEY, AWS_SECRET_KEY, SENDER_EMAIL } from "../config/index.js";
import nodemailer from 'nodemailer';
import { GOOGLE_MAIL, GOOGLE_PASSWORD } from '../config/index.js';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  // logger: true,
  // debug: true,
  secureConnection: false,
  auth: {
    user: GOOGLE_MAIL,
    pass: GOOGLE_PASSWORD,
  },
  tls: {
    rejectUnAuthorized: true
  }
});

export default async function emailSender(subject,content,toaddress){
  try {
    const mailOptions = {
      from: GOOGLE_MAIL,
      to: toaddress,
      subject: subject,
      html: content,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
        // const message = "Mail Sending was Unsuccessful.";
        // return res.status(401).json({ status: 0, message });
        return 'Error sending email';
      } else {
        console.log("Email sent: " + info.response);

        // const message = "New Password Sent to Mail Successfully.";
        // return res.status(200).json({ status: 1, message });
        return 'Email sent';
      }
    });
  } catch (error) {
      console.log(err);
      return "Error sending email";
  }
}





// AWS.config.update({
//     accessKeyId: AWS_ACCESS_KEY,
//     secretAccessKey: AWS_SECRET_KEY,
//     region: 'us-east-1'
//   });
//   const ses =new AWS.SES();

// export default async function emailSender(subject,content,toaddress){
//     try{
//         console.log(subject,toaddress)
//         const params = {
//             Destination: {
//               ToAddresses: [toaddress]
//             },
//             Message: {
//               Body: {
//                 Html: {
//                   Data: content
//                 }
//               },
//               Subject: {
//                 Data: subject
//               }
//             },
//             Source: SENDER_EMAIL
//           };
          
        
//         try{
//             const result = await ses.sendEmail(params).promise();
//             if(result){
//                 return 'Email sent';
//             }
//         } catch(error){
//             console.log("resulterror",error)
//             return 'Error sending email';
//         }
        
//     }catch(err){
//         console.log(err);
//         return "Error sending email";
//     }
// }
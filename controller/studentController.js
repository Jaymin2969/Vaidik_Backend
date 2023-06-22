import {
  Student,
  StudentInformation,
  TokenStudent,
  StudentWallet,
  StudentQuestions,
} from "../model/index.js";
import {
  StudentInformationSchema,
  StudentRegisterSchema,
  StudentWalletSchema,
  StudentQuestionsSchema,
  MainQuestionsSchema,
  TutorQuestionsSchema,
  ReAnswerChoiceSchema,
  QuestionPricingSchema,
  ImageSchema,
  StudentContactSchema,
  StudentCouponSchema,
  CentralTransactionsSchema,
  StudentOTPSchema,
  TutorPersonalSchema,
  TutorRegisterSchema,
  AdminMobileNoSchema,
  StudentPostingStreakSchema,
  CurrencyConversionSchema,
  SubscriptionSchema,
  AdminThoughtSchema,
  TutorWalletSchema,
} from "../schema/index.js";
import {
  StudentRegisterValidatorSchema,
  refreshTokenValidatorSchema,
  StudentLoginValidatorSchema,
  StudentSetInfoValidatorSchema,
  StudentChangePasswordValidatorSchema,
  StudentGoogleRegister2ValidatorSchema,
  StudentReAnswerValidatorSchema,
  StudentContactValidatorSchema,
  chageStatusFromNotOpenedToOpenedValidatorSchema,
  StudentReferralCompleteValidatorSchema,
  StudentCouponValidatorSchema,
  StudentPostStreakCashoutValidatorSchema,
  StudentForgotPasswordValidatorSchema,
  StudentOTPValidatorSchema,
  StudentSubscriptionValidatorSchema,
  StudentStripePaymentValidatorSchema,
} from "../validators/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../service/JwtService.js";
import { TokenStudentSchema } from "../schema/index.js";
import {
  APP_URL,
  SALT_FACTOR,
  CLIENT_ID,
  FAST2SMS,
  TWILIO_ACCOUNT_SID,
  TWILIO_AUTH_TOKEN,
  GOOGLE_MAIL,
  GOOGLE_PASSWORD,
  STRIPE_SECRETE_KEY,
} from "../config/index.js";
import studentregister from "../schema/studentregister.js";
import crypto from "crypto";
import { ObjectId } from "mongodb";
import { findTutorAndAssignQuestion } from "../controller/findTutorAndAssignQuestion.js";
import { QuestionPriceInUsd } from "./QuestionPriceInUsd.js";
import StudentregisterquestionValidatorSchema from "../validators/StudentregisterquestionValidator.js";
import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import fs, { rmSync } from "fs";
import generateTransactionId from "./generateTransactionId.js";
import { questionTypeName } from "../routes/question.js";
import { OAuth2Client } from "google-auth-library";
import moment from "moment";
import centralTransactions from "../schema/centralTransactions.js";
import fast2sms from "fast-two-sms";
import twilio from "twilio";
import forgotpasswordTemplate from "../emailtemplates/forgotpassword.js";
import nodemailer from "nodemailer";
import upvoteTemplate from "../emailtemplates/upvote.js";
import downvoteTemplate from "../emailtemplates/downvote.js";
import registerVerifyTemplate from "../emailtemplates/registerverify.js";
import emailSender from "./emailsender.js";
import registrartionTemplate from "../emailtemplates/registration.js";
import studentpostingstreak from "../schema/studentpostingstreak.js";
import studentWallet from "../model/studentwallet.js";
import { SubscriptionPriceInUsd } from "./SubscriptionPriceInUsd.js";
import stripe from 'stripe';
import studentsubscriptionTemplate from "../emailtemplates/studentsubscription.js";
import studentdepositeTemplate from "../emailtemplates/studentdeposite.js";
const stripeSecretKey = STRIPE_SECRETE_KEY;
const stripeInstance = stripe(stripeSecretKey);


const accountSid = TWILIO_ACCOUNT_SID;
const authToken = TWILIO_AUTH_TOKEN;
const client1 = twilio(accountSid, authToken);

const client = new OAuth2Client(CLIENT_ID);

// const transporter = nodemailer.createTransport({
//   service: 'gmail',
//   host: 'smtp.gmail.com',
//   port: 465,
//   secure: true,
//   // logger: true,
//   // debug: true,
//   secureConnection: false,
//   auth: {
//     user: GOOGLE_MAIL,
//     pass: GOOGLE_PASSWORD,
//   },
//   tls: {
//     rejectUnAuthorized: true
//   }
// });

const validateGoogleToken = async (idToken) => {
  const ticket = await client.verifyIdToken({
    idToken,
    audience: CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload.sub;
  return payload;
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDirectory = path.join(__dirname, "..", "upload");
    console.log(uploadDirectory);

    // Create the upload directory if it doesn't exist
    fs.mkdir(uploadDirectory, { recursive: true }, function (err) {
      if (err) return cb(err);
      cb(null, uploadDirectory);
    });
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${Math.round(
      Math.random() * 1e9
    )}${path.extname(file.originalname)}`;
    cb(null, uniqueName);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1000000, // 1000000 Bytes = 1 MB
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(png|jpg|jpeg|tif|tiff|bmp|gif|ico)$/)) {
      // upload only png and jpg format
      return cb(new Error("Please upload a Image"));
    }
    cb(undefined, true);
  },
}).array("questionPhoto", 5);

function generateReferralCode(userId) {
  const hash = crypto.createHash("sha256");
  hash.update(userId + Date.now().toString());
  return hash.digest("hex").substring(0, 12);
}

const studentController = {
  async googleregister(req, res, next) {
    const { idToken } = req.body;

    try {
      const payload = await validateGoogleToken(idToken);

      try {
        const user = new StudentRegisterSchema({
          email: payload.email,
          googleId: payload.sub,
          registerType: "google",
          googleverified: 0,
          emailverified: 0,
        });
        var aa = await Student.create(user);

        if (!aa.error) {
          // console.log(aa);
          let refresh_token;
          // access_token = await JwtService.sign({_id:document._id});
          refresh_token = await JwtService.sign({ _id: aa._id });
          var tt = await TokenStudentSchema.create({
            _id: aa._id,
            token: refresh_token,
            expiresAt: new Date(),
          });
          let token = refresh_token;
          var info = aa;
          var message =
            "User Registered Successfully. now redirect to password, class, reffral page.";
          return res.status(200).json({ status: 1, info, token, message });
          // res.redirect("/student/home");
        } else {
          return res.status(400).json({ status: 0, error: aa.error });
          // res.redirect("/student/register");
        }
      } catch (error) {
        // originally
        // res.json({"message": "Error in registration"});
        console.log(error);
        return res.status(400).json({ status: 0, error: error });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 0, error: error });
    }
  },
  async googleregister2(req, res, next) {
    try {
      const { error } = StudentGoogleRegister2ValidatorSchema.validate(
        req.body
      );
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }

      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }

      var st_id = rec_token._id;

      let { password } = req.body;
      const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;
      var user;
      const StuId = await StudentRegisterSchema.findById(st_id);
      if (!StuId) {
        return res.status(400).json({ status: 0, error: "Student Invalid!" });
      }
      let otpverify;
      if (req.body.referralCode) {
        // otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);

        // if (otpverify !== "OTP verified successfully") {
        //   return res.status(400).json({ status: 0, error: otpverify });
        // }
        const student = await StudentInformationSchema.findOne({
          ownReferral: req.body.referralCode,
        });
        console.log(student);
        var stt_id;
        if (student) {

          var currency = await CurrencyConversionSchema.findOne();

          let pri = await StudentPostingStreakSchema.findOne();
          if(!pri){
            return res.status(400).json({ status: 0, error: "student postingstreak not found" });
          }

          var referralpersonal = parseFloat(pri.referralpersonalreward) / parseFloat(currency.ConversionToInr);
          referralpersonal = parseFloat(referralpersonal.toFixed(2));

          stt_id = student.userId;
          let data = {
            userId: st_id,
            email: StuId.email,
            referdate: Date.now(),
            amount: referralpersonal,
            redeemed: false,
          };
          student.referralHistory.unshift(data);
          await student.save();

          var stt_wallet = await StudentWalletSchema.findOne({
            studentId: stt_id,
          });

          if (stt_wallet) {
            stt_wallet.redeemableAmount =
              parseFloat(stt_wallet.redeemableAmount) + referralpersonal;
            stt_wallet.totalAmount =
              stt_wallet.redeemableAmount + stt_wallet.availableAmount;

            await stt_wallet.save();
          }

          StuId.password = req.body.password;
          if (req.body.class) {
            StuId.class = req.body.class;
          }if(req.body.mobileNo){
            StuId.mobileNo = req.body.mobileNo;
          }
          StuId.referralCode = req.body.referralCode;
          StuId.googleverified = 1;
          await StuId.save();

          let post = [
            {
              range: 50,
              redeemed: 0,
            },
            {
              range: 100,
              redeemed: 0,
            },
            {
              range: 150,
              redeemed: 0,
            },
            {
              range: 200,
              redeemed: 0,
            },
            {
              range: 250,
              redeemed: 0,
            },
            {
              range: 300,
              redeemed: 0,
            },
            {
              range: 350,
              redeemed: 0,
            },
            {
              range: 400,
              redeemed: 0,
            },
            {
              range: 450,
              redeemed: 0,
            },
            {
              range: 500,
              redeemed: 0,
            },
          ];

          const studentinfo = await StudentInformationSchema.create({
            userId: StuId._id,
            email: StuId.email,
            ownReferral: generateReferralCode(st_id),
            postingStreak: post
          });
          await studentinfo.save();

          var wal = await StudentWallet.create({ studentId: StuId._id });

          if (wal) {
            let price = 0;
            wal.availableAmount += parseFloat(price);
            wal.depositAmount += parseFloat(price);
            wal.totalAmount =
              parseFloat(wal.availableAmount) +
              parseFloat(wal.redeemableAmount);

            const transaction = {
              transactionId: await generateTransactionId(),
              date: new Date(),
              type: "Deposit",
              amount: price,
              description: `Registration Bonus`,
              status: "Success",
              balance: wal.availableAmount,
            };
            let name;
            // let studentname = await StudentInformationSchema.findOne({ userId: wal.studentId });
            name = "student";
            // if(studentname){
            //     name = studentname.name;
            // }

            // const centraltransaction = {
            //     category: "Student",
            //     walletId: wal._id,
            //     transactionId: transaction.transactionId,
            //     name: name,
            //     date: transaction.date,
            //     type: transaction.type,
            //     amount: transaction.amount,
            //     description: transaction.description,
            //     status: transaction.status,
            //     balance: transaction.balance
            //   }

            const centaltransactiondetails =
              await CentralTransactionsSchema.create({
                category: "Student",
                walletId: wal._id,
                transactionId: transaction.transactionId,
                name: name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                status: transaction.status,
                balance: transaction.balance,
              });
            if (!centaltransactiondetails) {
              return res
                .status(400)
                .json({ status: 0, error: "central transaction not created!" });
            }
            await centaltransactiondetails.save();

            wal.walletHistory.unshift(transaction);
            await wal.save();
          }

          // if (wal) {
          //     let price = 1;
          //     wal.availableAmount += parseFloat(price);
          //     wal.ReferralAmount += parseFloat(price);
          //     wal.totalAmount = parseFloat(wal.availableAmount) + parseFloat(wal.redeemableAmount);

          //     const transaction = {
          //         transactionId: await generateTransactionId(),
          //         date: new Date(),
          //         type: "Deposit",
          //         amount: price,
          //         description: `Registration Bonus`,
          //         status: "Success",
          //         balance: wal.availableAmount
          //     };
          //     wal.walletHistory.unshift(transaction);
          //     await wal.save();
          // }

          var st_qu = await StudentQuestions.create({
            studentId: StuId._id,
            postquestions: 0,
            refer1cashedout: false,
            refer2cashedout: false,
            refer3cashedout: false,
            refer4cashedout: false,
          });

          var info = StuId;
          var message = "User Registered Successfully.";
          return res
            .status(200)
            .json({ status: 1, info, token: req.body.token, message });
        } else {
          // var message = "Invalid Referral code!";
          return res
            .status(400)
            .json({ status: 0, error: "Invalid Referral code!" });
        }
      } else {
        // otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);

        // if (otpverify !== "OTP verified successfully") {
        //   return res.status(400).json({ status: 0, error: otpverify });
        // }

        StuId.password = req.body.password;
        if (req.body.class) {
          StuId.class = req.body.class;
        }
        if(req.body.mobileNo) {
          StuId.mobileNo = req.body.mobileNo;
        }
        StuId.googleverified = 1;
        await StuId.save();

        let post = [
          {
            range: 50,
            redeemed: 0,
          },
          {
            range: 100,
            redeemed: 0,
          },
          {
            range: 150,
            redeemed: 0,
          },
          {
            range: 200,
            redeemed: 0,
          },
          {
            range: 250,
            redeemed: 0,
          },
          {
            range: 300,
            redeemed: 0,
          },
          {
            range: 350,
            redeemed: 0,
          },
          {
            range: 400,
            redeemed: 0,
          },
          {
            range: 450,
            redeemed: 0,
          },
          {
            range: 500,
            redeemed: 0,
          },
        ];

        const studentinfo = await StudentInformationSchema.create({
          userId: StuId._id,
          email: StuId.email,
          ownReferral: generateReferralCode(st_id),
          postingStreak: post
        });
        await studentinfo.save();

        var wal = await StudentWallet.create({ studentId: StuId._id });

        if (wal) {
          let price = 0;
          wal.availableAmount += parseFloat(price);
          wal.depositAmount += parseFloat(price);
          wal.totalAmount =
            parseFloat(wal.availableAmount) + parseFloat(wal.redeemableAmount);

          const transaction = {
            transactionId: await generateTransactionId(),
            date: new Date(),
            type: "Deposit",
            amount: price,
            description: `Registration Bonus`,
            status: "Success",
            balance: wal.availableAmount,
          };
          let name;
          // let studentname = await StudentInformationSchema.findOne({ userId: wal.studentId });
          name = "student";
          // if(studentname){
          //      name = studentname.name;
          // }

          // const centraltransaction = {
          //     category: "Student",
          //     walletId: wal._id,
          //     transactionId: transaction.transactionId,
          //     name: name,
          //     date: transaction.date,
          //     type: transaction.type,
          //     amount: transaction.amount,
          //     description: transaction.description,
          //     status: transaction.status,
          //     balance: transaction.balance
          //   }

          const centaltransactiondetails =
            await CentralTransactionsSchema.create({
              category: "Student",
              walletId: wal._id,
              transactionId: transaction.transactionId,
              name: name,
              date: transaction.date,
              type: transaction.type,
              amount: transaction.amount,
              description: transaction.description,
              status: transaction.status,
              balance: transaction.balance,
            });
          if (!centaltransactiondetails) {
            return res
              .status(400)
              .json({ status: 0, error: "central transaction not created!" });
          }

          await centaltransactiondetails.save();
          wal.walletHistory.unshift(transaction);
          await wal.save();
        }

        var st_qu = await StudentQuestions.create({
          studentId: StuId._id,
          postquestions: 0,
          refer1cashedout: false,
          refer2cashedout: false,
          refer3cashedout: false,
          refer4cashedout: false,
        });
        let studentname = "Student";

        const emailContent = registrartionTemplate(studentname);

        const subject = "DoubtQ - Verification Email";

            let emailsent = await emailSender(subject, emailContent, aa.email);
            if (emailsent === "Email sent") {
              // const message = "Register verified link Sent to Mail Successfully.";
              console.log(emailsent);
              // return res.status(200).json({ status: 1, message });
            } else {
              const error = "Mail Sending was Unsuccessful.";
              console.log(error);
              // return res.status(401).json({ status: 0, error });
            }
        var info = StuId;
        var message = "User Registered Successfully.";
        return res
          .status(200)
          .json({ status: 1, info, token: req.body.token, message });
      }
    } catch (error) {
      console.log(error);
      return res.status(400).json({ status: 0, error: error });
    }
  },
  async emailregister(req, res, next) {
    try {
      const { error } = StudentRegisterValidatorSchema.validate(req.body);
      if (error) {
        return res.json({ status: 0, error: error.message });
      }
      const { password } = req.body;
      const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
      const hashedPassword = await bcrypt.hash(password, salt);
      req.body.password = hashedPassword;

      var user;
      

      var aa;
      let otpverify;
      if (req.body.referralCode) {
        console.log(req.body.referralCode)
        const student = await StudentInformationSchema.findOne({
          ownReferral: req.body.referralCode,
        });
        console.log("student", student);

        if (student) {

          user = new StudentRegisterSchema({
            email: req.body.email,
            password: req.body.password,
            registerType: "email",
            referralCode: req.body.referralCode,
            googleverified: 1,
            emailverified: 0,
          });

          if (req.body.class) {
            user.class = req.body.class;
        }
        
        if (req.body.mobileNo) {
            user.mobileNo = req.body.mobileNo;
        }

          // if (req.body.class) {
          //   user = new StudentRegisterSchema({
          //     email: req.body.email,
          //     password: req.body.password,
          //     mobileNo: req.body.mobileNo,
          //     registerType: "email",
          //     class: req.body.class,
          //     referralCode: req.body.referralCode,
          //     googleverified: 1,
          //     emailverified: 0,
          //   });
          //   // otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);
          // } else {
          //   user = new StudentRegisterSchema({
          //     email: req.body.email,
          //     password: req.body.password,
          //     mobileNo: req.body.mobileNo,
          //     registerType: "email",
          //     referralCode: req.body.referralCode,
          //     googleverified: 1,
          //     emailverified: 0,
          //   });
          //   // otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);
          // }
          // if (otpverify !== "OTP verified successfully") {
          //   return res.status(400).json({ status: 0, error: otpverify });
          // }
          aa = await Student.create(user);
          console.log("aa", aa);

          if (!aa.error) {
            // console.log(aa);
            var stt_id;
            try {
              var currency = await CurrencyConversionSchema.findOne();

              let pri = await StudentPostingStreakSchema.findOne();
              if(!pri){
                return res.status(400).json({ status: 0, error: "student postingstreak not found" });
              }

              var referralpersonal = parseFloat(pri.referralpersonalreward) / parseFloat(currency.ConversionToInr);
              referralpersonal = parseFloat(referralpersonal.toFixed(2));

              stt_id = student.userId;
              let data = {
                userId: aa._id,
                email: aa.email,
                referdate: Date.now(),
                amount: referralpersonal,
                redeemed: false,
              };
              console.log("data1", data);
              student.referralHistory.unshift(data);
              await student.save();

              var stt_wallet = await StudentWalletSchema.findOne({
                studentId: stt_id,
              });

              if (stt_wallet) {
                stt_wallet.redeemableAmount =
                  parseFloat(stt_wallet.redeemableAmount) + referralpersonal;
                stt_wallet.totalAmount =
                  stt_wallet.redeemableAmount + stt_wallet.availableAmount;

                await stt_wallet.save();
              }
              let post = [
                {
                  range: 50,
                  redeemed: 0,
                },
                {
                  range: 100,
                  redeemed: 0,
                },
                {
                  range: 150,
                  redeemed: 0,
                },
                {
                  range: 200,
                  redeemed: 0,
                },
                {
                  range: 250,
                  redeemed: 0,
                },
                {
                  range: 300,
                  redeemed: 0,
                },
                {
                  range: 350,
                  redeemed: 0,
                },
                {
                  range: 400,
                  redeemed: 0,
                },
                {
                  range: 450,
                  redeemed: 0,
                },
                {
                  range: 500,
                  redeemed: 0,
                },
              ];

              const studentinfo = await StudentInformationSchema.create({
                userId: aa._id,
                email: aa.email,
                ownReferral: generateReferralCode(aa._id),
                postingStreak: post
              });
              await studentinfo.save();
            } catch (error) {
              console.log(error);
              return res.status(400).json({ status: 0, error: error });
            }
            let refresh_token;
            // access_token = await JwtService.sign({_id:document._id});
            refresh_token = await JwtService.sign({ _id: aa._id });
            var tt = await TokenStudentSchema.create({
              _id: aa._id,
              token: refresh_token,
              expiresAt: new Date(),
            });
            let token = refresh_token;
            var wal = await StudentWallet.create({ studentId: aa._id });

            if (wal) {
              let price = 0;
              wal.availableAmount += parseFloat(price);
              wal.depositAmount += parseFloat(price);
              wal.totalAmount =
                parseFloat(wal.availableAmount) +
                parseFloat(wal.redeemableAmount);

              const transaction = {
                transactionId: await generateTransactionId(),
                date: new Date(),
                type: "Deposit",
                amount: price,
                description: `Registration Bonus`,
                status: "Success",
                balance: wal.availableAmount,
              };
              let name;
              // let studentname = await StudentInformationSchema.findOne({ userId: wal.studentId });
              name = "student";
              // if(studentname){
              //      name = studentname.name;
              // }

              const centraltransaction = {
                category: "Student",
                walletId: wal._id,
                transactionId: transaction.transactionId,
                name: name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                status: transaction.status,
                balance: transaction.balance,
              };

              const centaltransactiondetails =
                await CentralTransactionsSchema.create({
                  category: "Student",
                  walletId: wal._id,
                  transactionId: transaction.transactionId,
                  name: name,
                  date: transaction.date,
                  type: transaction.type,
                  amount: transaction.amount,
                  description: transaction.description,
                  status: transaction.status,
                  balance: transaction.balance,
                });
              if (!centaltransactiondetails) {
                return res.status(400).json({
                  status: 0,
                  error: "central transaction not created!",
                });
              }
              await centaltransactiondetails.save();
              wal.walletHistory.unshift(transaction);
              await wal.save();
            }
            var st_qu = await StudentQuestions.create({
              studentId: aa._id,
              postquestions: 0,
              refer1cashedout: false,
              refer2cashedout: false,
              refer3cashedout: false,
              refer4cashedout: false,
            });
            let studentname = "Student";

            const emailContent = registrartionTemplate(studentname);
            // const emailContent = registerVerifyTemplate(aa._id, refresh_token);
            console.log(
              `https://vaidik-backend.onrender.com/api/v1/student/${aa._id}/${refresh_token}`
            );

            const subject = "DoubtQ - Verification Email";

            let emailsent = await emailSender(subject, emailContent, aa.email);
            if (emailsent === "Email sent") {
              // const message = "Register verified link Sent to Mail Successfully.";
              console.log(emailsent);
              // return res.status(200).json({ status: 1, message });
            } else {
              const error = "Mail Sending was Unsuccessful.";
              console.log(error);
              // return res.status(401).json({ status: 0, error });
            }
            // const mailOptions = {
            //   from: GOOGLE_MAIL,
            //   to: email,
            //   subject: "DoubtQ - Verified Account",
            //   html: emailContent,
            // };

            // transporter.sendMail(mailOptions, function (error, info) {
            //   if (error) {
            //     console.log(error);
            //     const message = "Mail Sending was Unsuccessful.";
            //     return res.status(401).json({ status: 0, error });
            //   } else {
            //     console.log("Email sent: " + info.response);

            //     const message = "Verified link Sent to Mail Successfully.";
            //     return res.status(200).json({ status: 1, message });
            //   }
            // });

            var info = aa;
            var message = "User Registered Successfully.";
            return res.status(200).json({ status: 1, info, token, message });
            // res.json(aa);
            // res.redirect("/student/home");
          } else {
            return res.status(400).json({ status: 0, error: aa.error });
            // res.redirect("/student/register");
          }
        } else {
          // var message = "Invalid Referral code!";
          return res
            .status(400)
            .json({ status: 0, error: "Invalid Referral code!" });
        }
      } else {

        user = new StudentRegisterSchema({
          email: req.body.email,
          password: req.body.password,
          registerType: "email",
          referralCode: req.body.referralCode,
          googleverified: 1,
          emailverified: 0,
        });

        if (req.body.class) {
          user.class = req.body.class;
      }
      
      if (req.body.mobileNo) {
          user.mobileNo = req.body.mobileNo;
      }
        // if (req.body.class) {
        //   user = new StudentRegisterSchema({
        //     email: req.body.email,
        //     password: req.body.password,
        //     mobileNo: req.body.mobileNo,
        //     registerType: "email",
        //     class: req.body.class,
        //     googleverified: 1,
        //     emailverified: 0,
        //   });
        //   // otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);
        // } else {
        //   user = new StudentRegisterSchema({
        //     email: req.body.email,
        //     password: req.body.password,
        //     mobileNo: req.body.mobileNo,
        //     registerType: "email",
        //     googleverified: 1,
        //     emailverified: 0,
        //   });

        //   // otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);
        // }
        // console.log(otpverify);
        // if (otpverify !== "OTP verified successfully") {
        //   return res.status(400).json({ status: 0, error: otpverify });
        // }

        aa = await Student.create(user);
        console.log("aa", aa);

        let post = [
          {
            range: 50,
            redeemed: 0,
          },
          {
            range: 100,
            redeemed: 0,
          },
          {
            range: 150,
            redeemed: 0,
          },
          {
            range: 200,
            redeemed: 0,
          },
          {
            range: 250,
            redeemed: 0,
          },
          {
            range: 300,
            redeemed: 0,
          },
          {
            range: 350,
            redeemed: 0,
          },
          {
            range: 400,
            redeemed: 0,
          },
          {
            range: 450,
            redeemed: 0,
          },
          {
            range: 500,
            redeemed: 0,
          },
        ];

        if (!aa.error) {
          // console.log(aa);
          const studentinfo = await StudentInformationSchema.create({
            userId: aa._id,
            email: aa.email,
            ownReferral: generateReferralCode(aa._id),
            postingStreak: post
          });

          await studentinfo.save();
          let refresh_token;
          // access_token = await JwtService.sign({_id:document._id});
          refresh_token = await JwtService.sign({ _id: aa._id });
          var tt = await TokenStudentSchema.create({
            _id: aa._id,
            token: refresh_token,
            expiresAt: new Date(),
          });
          let token = refresh_token;
          var wal = await StudentWallet.create({ studentId: aa._id });

          if (wal) {
            let price = 0;
            wal.availableAmount += parseFloat(price);
            wal.depositAmount += parseFloat(price);
            wal.totalAmount =
              parseFloat(wal.availableAmount) +
              parseFloat(wal.redeemableAmount);

            const transaction = {
              transactionId: await generateTransactionId(),
              date: new Date(),
              type: "Deposit",
              amount: price,
              description: `Registration Bonus`,
              status: "Success",
              balance: wal.availableAmount,
            };
            let name;
            // let studentname = await StudentInformationSchema.findOne({ userId: wal.studentId });
            name = "student";
            // if(studentname){
            //      name = studentname.name
            // }

            // const centraltransaction = {
            //     category: "Student",
            //     walletId:wal._id,
            //     transactionId: transaction.transactionId,
            //     name: name,
            //     date: transaction.date,
            //     type: transaction.type,
            //     amount: transaction.amount,
            //     description: transaction.description,
            //     status: transaction.status,
            //     balance: transaction.balance
            //   }

            const centaltransactiondetails =
              await CentralTransactionsSchema.create({
                category: "Student",
                walletId: wal._id,
                transactionId: transaction.transactionId,
                name: name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                status: transaction.status,
                balance: transaction.balance,
              });
            if (!centaltransactiondetails) {
              return res
                .status(400)
                .json({ status: 0, error: "central transaction not created!" });
            }
            await centaltransactiondetails.save();

            wal.walletHistory.unshift(transaction);
            await wal.save();
            console.log(wal);
          }

          var st_qu = await StudentQuestions.create({
            studentId: aa._id,
            postquestions: 0,
            refer1cashedout: false,
            refer2cashedout: false,
            refer3cashedout: false,
            refer4cashedout: false,
          });
          let studentname = "Student";

        const emailContent = registrartionTemplate(studentname);

          // const emailContent = registerVerifyTemplate(aa._id, refresh_token);

          const subject = "DoubtQ - Verification Email";

          let emailsent = await emailSender(subject, emailContent, aa.email);
          if (emailsent === "Email sent") {
            // const message = "Register verified link Sent to Mail Successfully.";
            console.log(emailsent);
            // return res.status(200).json({ status: 1, message });
          } else {
            const error = "Mail Sending was Unsuccessful.";
            console.log(error);
            // return res.status(401).json({ status: 0, error });
          }

          var info = aa;
          var message = "User Registered Successfully.";
          return res.status(200).json({ status: 1, info, token, message });
          // res.json(aa);
          // res.redirect("/student/home");
        } else {
          return res.status(400).json({ status: 0, error: aa.error });
          // res.redirect("/student/register");
        }
      }

      //   var aa = await Student.create(user);
      // console.log(aa);

      //   if (!aa.error) {
      //     // console.log(aa);
      //     let refresh_token;
      //     // access_token = await JwtService.sign({_id:document._id});
      //     refresh_token = await JwtService.sign({ _id: aa._id });
      //     var tt = await TokenStudentSchema.create({
      //       _id: aa._id,
      //       token: refresh_token,
      //       expiresAt: new Date(),
      //     });
      //     let token = refresh_token;
      //     var wal = await StudentWallet.create({ studentId: aa._id });
      //     var st_qu = await StudentQuestions.create({ studentId: aa._id });
      //     var info = aa;
      //     var message = "User Registered Successfully.";
      //     res.status(200).json({ info, token, message });
      //     // res.json(aa);
      //     // res.redirect("/student/home");
      //   } else {
      //     res.status(400).json({ error: aa.error });
      //     // res.redirect("/student/register");
      //   }
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 0, error });
    }
  },
  async googlelogin(req, res, next) {
    console.log(req.body);
    const { idToken } = req.body;

    try {
      const payload = await validateGoogleToken(idToken);

      try {
        // const user = new StudentRegisterSchema({
        //     email: req.user.email,
        //     googleId: req.user.googleId,
        //     registerType: "google"
        // });
        // var aa = await Student.create(user);
        let email = payload.email;
        let googleId = payload.sub;

        const user = await Student.fetchById({ email: email });
        // if(!user) return next(CustomErrorHandler.wrongCredential());
        if (!user) {
          return res
            .status(400)
            .json({ status: 0, error: "Email is not Registered!" });
        }

        if (user.googleId !== googleId) {
          return res.status(400).json({
            status: 0,
            error: "This Email is not Registered with Google!",
          });
        }

        if (user.emailverified === 0) {
          return res.status(400).json({
            status: 0,
            error:
              "Your email address has not been verified. Please check your email and click on the verification link to activate your account",
          });
        }

        var refresh_token;
        try {
          var r_t = await TokenStudent.fetchById({ _id: user._id });
          // console.log(`r_t = ${r_t}`);
          if (r_t === "al") {
            refresh_token = await JwtService.sign({ _id: user._id });
            // user.token = refresh_token;
            console.log("New Generated");

            await TokenStudentSchema.create({
              _id: user._id,
              token: refresh_token,
              expiresAt: new Date(),
            });
          } else {
            refresh_token = r_t.token;
            // console.log("already exist");
          }
        } catch (error) {
          console.log("error generated");
        }
        var message = "User Login Successfully.";
        var info = user;
        return res
          .status(200)
          .json({ status: 1, info, token: refresh_token, message });
      } catch (error) {
        console.log("error - ", error);
        return res.status(400).json({ status: 0, error });
      }
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async emaillogin(req, res, next) {
    try {
      const { error } = StudentLoginValidatorSchema.validate(req.body);
      if (error) {
        return res.json({ status: 0, error: error.message });
      }
      let { email, password } = req.body;
      const user = await Student.fetchById({ email: email });
      // if(!user) return next(CustomErrorHandler.wrongCredential());
      if (!user) {
        return res
          .status(400)
          .json({ status: 0, error: "Email is not Registered!" });
      }

      const match = await bcrypt.compare(password, user.password);
      // if(!match) return next(CustomErrorHandler.wrongCredential());
      if (!match) {
        return res
          .status(400)
          .json({ status: 0, error: "Please Write correct password!" });
      }

      var refresh_token;
      try {
        var r_t = await TokenStudent.fetchById({ _id: user._id });
        // console.log(`r_t = ${r_t}`);
        if (r_t === "al") {
          refresh_token = await JwtService.sign({ _id: user._id });
          // user.token = refresh_token;
          console.log("New Generated");

          await TokenStudentSchema.create({
            _id: user._id,
            token: refresh_token,
            expiresAt: new Date(),
          });
        } else {
          refresh_token = r_t.token;
          // console.log("already exist");
        }
      } catch (error) {
        console.log("error - ", error);
        return res.status(400).json({ status: 0, error });
      }
      var message = "User Login Successfully.";
      var info = user;
      return res
        .status(200)
        .json({ status: 1, info, token: refresh_token, message });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async logout(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }

      const del = await TokenStudent.delete({ token: rec_token.token });
      // console.log(del);
      if (del.acknowledged === true) {
        return res
          .status(200)
          .json({ status: 1, message: "Logged out successful" });
      } else {
        return res
          .status(400)
          .json({ status: 0, error: "Error in Logging out Student!" });
      }
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async getinfo(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }

      var st_id = rec_token._id;

      var info = await StudentInformation.fetchById({ userId: st_id });
      var message = "User details Fetched Successfully.";
      return res.status(200).json({ status: 1, info, message });
    } catch (err) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async setinfo(req, res, next) {
    try {
      const { error } = StudentSetInfoValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }

      var st_id = rec_token._id;
      const { name, email, board, city, school } = req.body;
      let st_info = await StudentInformation.fetchById({ userId: st_id });
      if (st_info) {
        var updated_st = await StudentInformationSchema.findByIdAndUpdate(
          st_info._id,
          {
            name,
            email,
            board,
            city,
            school,
          },
          { new: true }
        );
        const message = "Student Information Created Successfully.";
        return res.status(200).json({ status: 1, updated_st, message });
      } else {
        const ownReferral = generateReferralCode(st_id);
        var new_st = new StudentInformationSchema({
          userId: st_id,
          name,
          email,
          board,
          city,
          school,
          ownReferral,
        });

        var info = await StudentInformation.create(new_st);
        const message = "Student Information Created Successfully.";
        return res.status(200).json({ status: 1, info, message });
      }
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async changepassword(req, res, next) {
    try {
      const { error } = StudentChangePasswordValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const { password, new_password } = req.body;

      const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
      const hashedPassword = await bcrypt.hash(new_password, salt);
      // new_password = hashedPassword;
      var st_id = rec_token._id;

      var data = await Student.fetchById({ _id: st_id });

      const match = await bcrypt.compare(password, data.password);
      // if(!match) return next(CustomErrorHandler.wrongCredential());
      if (!match) {
        return res
          .status(400)
          .json({ status: 0, error: "Please Enter correct current password!" });
      }

      var new_data = await StudentRegisterSchema.findByIdAndUpdate(
        st_id,
        { password: hashedPassword },
        { new: true }
      );

      const message = "Student Password Changed Successfully.";
      return res.status(200).json({ status: 1, message });
    } catch (err) {
      console.log("error - ", err);
      return res.status(400).json({ status: 0, err });
    }
  },
  async reanswer(req, res, next) {
    try {
      const { error } = StudentReAnswerValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const { studentResponce } = req.body;

      var questionId = new ObjectId(req.body.questionId);

      var st_id = rec_token._id;

      var que = await MainQuestionsSchema.findById(questionId);

      if (que.status === "NotOpened") {
        console.log("start new que - ", que);
        if (studentResponce === "upvote") {
          que.studentresponded = true;
          que.studentResponce = studentResponce;
          que.status = "Closed";

          await que.save();
          // complete tutorpayment from paymentgoesto
          const updatedQuestion = await TutorQuestionsSchema.findOneAndUpdate(
            {
              tutorId: que.tutorId,
              "allQuestions.questionId": que._id,
            },
            {
              $inc: {
                "stats.upvoteQuestions": 1,
              },
            },
            {
              new: true, // return the updated document
            }
          );

          if(!updatedQuestion) {
            return res.status(400).json({ status: 0, error: "Question Not Found" });
          }


         await StudentQuestionsSchema.updateOne(
            { "allQuestions.questionId": que._id },
            {
              $set: {
                "allQuestions.$.status": "Closed",
              },
            },
            async (err, result) => {
              if (err) {
                console.log("Error:", err);
                return res
                  .status(400)
                  .json({ status: 0, error: "Question Not Found" });
              } else {

                var tutorId = que.tutorId;

                var reanswerchoice = await ReAnswerChoiceSchema.findOne();
                    // console.log(reanswerchoice);
                reanswerchoice = reanswerchoice.choice;

            var tut_wal = await TutorWalletSchema.findOne({ tutorId: tutorId });
            if(tut_wal){

                const tutorstatus = await TutorRegisterSchema.findOne({_id: tutorId});
                    if(!tutorstatus){
                      return res.status(400).json({ status: 0, error: "tutor status not found" });
                    }

                    if(tutorstatus === 1){

                    }else{

              if(reanswerchoice === true){
                // console.log("tutor wallet not found");
            tut_wal.pendingAmount -= parseFloat(que.tutorPrice);
            tut_wal.availableAmount += parseFloat(que.tutorPrice);
            tut_wal.earningAmount += parseFloat(que.tutorPrice);

            tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);

            await TutorWalletSchema.findOneAndUpdate(
                { tutorId, 'walletHistory.questionId': que._id },
                { $set: { 'walletHistory.$.date': new Date(),
                        'walletHistory.$.status': "Success",
                        'walletHistory.$.balance': tut_wal.availableAmount
                } },
                { arrayFilters: [{ 'elem.questionId': que._id }], new: true }
              )
                .then(async result => {
                  if (result) {
                    console.log(`TutorWallet document updated for questionId ${que._id}`);

                    result.map((value)=>{
                        // console.log(value.walletHistory)
                        value.walletHistory.map(async (value)=>{
                            // console.log(value)
                            let transactionId = value.transactionId;
                            console.log(transactionId);
                            await CentralTransactionsSchema.findOneAndUpdate(
                                        { transactionId, questionId : que._id },
                                        { $set: { "date": new Date(),
                                                "status": "Success",
                                                "balance": tut_wal.availableAmount
                                        } }
                                      )
                                        .then(result => {
                                          if (result) {
                                            console.log(`Transaction details document updated for questionId ${que._id}`);
                                            // console.log(result);
                                          } else {
                                            console.log(`No Transaction details document found for questionId ${que._id}`);
                                            return res.status(400).json({ status: 0, error: "central transaction not found" });
                                          }
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                            return res.status(400).json({ status: 0, error: "Internal Server Error" });
                                        });
                        })

                      })
                    // console.log(result);
                    await tut_wal.save();
                  } 
                  
                })
                .catch((err) => {
                    console.error(err);
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                });
              }
            }
            }

                const tutor = await TutorPersonalSchema.findById(que.tutorId);
                if (!tutor) {
                  return res
                    .status(400)
                    .json({ status: 0, error: "tutor not found" });
                }
                const tutorname = await TutorRegisterSchema.findById(
                  que.tutorId
                );
                if (!tutorname) {
                  return res
                    .status(400)
                    .json({ status: 0, error: "tutor email not found" });
                }
                const question = que.question.slice(0, 60);
                const answer = que.answer.slice(0, 60);

                const emailContent = upvoteTemplate(
                  tutor.name,
                  question,
                  answer
                );

                const subject =
                  "DoubtQ - Congrats!! student liked your answer!";

                let emailsent = await emailSender(
                  subject,
                  emailContent,
                  tutorname.email
                );

                console.log("emailsent", emailsent);
                if (emailsent === "Email sent") {
                  // const message = "New Password Sent to Mail Successfully.";
                  console.log(emailsent);
                  // return res.status(200).json({ status: 1, message });
                } else {
                  const error = "Mail Sending was Unsuccessful.";
                  console.log(error);
                  // return res.status(401).json({ status: 0, error });
                }

                // const mailOptions = {
                //   from: GOOGLE_MAIL,
                //   to: email,
                //   subject: "DoubtQ - Account New Password",
                //   html: emailContent,
                // };

                // transporter.sendMail(mailOptions, function (error, info) {
                //   if (error) {
                //     console.log(error);
                //     const message = "Mail Sending was Unsuccessful.";
                //     return res.status(401).json({ status: 0, message });
                //   } else {
                //     console.log("Email sent: " + info.response);

                //     const message = "New Password Sent to Mail Successfully.";
                //     return res.status(200).json({ status: 1, message });
                //   }
                // });
                console.log("Result:", result);
              }
            }
          );
        } else if (studentResponce === "downvote") {
          if (req.body.remarks) {
            que.studentremarks = req.body.remarks;
            que.studentresponded = true;
            que.studentResponce = studentResponce;
            const updatedQuestion = await TutorQuestionsSchema.findOneAndUpdate(
              {
                tutorId: que.tutorId,
                "allQuestions.questionId": que._id,
              },
              {
                $inc: {
                  "stats.downvoteQuestions": 1,
                },
              },
              {
                new: true, // return the updated document
              }
            );

            if(!updatedQuestion) {
              return res.status(400).json({ status: 0, error: "Question Not Found" });
            }

            var tut_list = [];
            tut_list.push(que.tutorId);

            que.tutorlist = tut_list;
            que.whomto_ask = "reanswer";
            que.status = "Opened";

            var reans_time = await ReAnswerChoiceSchema.findOne();
            reans_time = reans_time.reanswer_time;
            var currentTimePlusExtra = new Date();
            currentTimePlusExtra.setMinutes(
              currentTimePlusExtra.getMinutes() + reans_time
            );
            que.answerClosingAt = currentTimePlusExtra;
            // que.internalStatus = "initiated";
            console.log("new que - ", que);

            await que.save();

            StudentQuestionsSchema.updateOne(
              { "allQuestions.questionId": que._id },
              {
                $set: {
                  "allQuestions.$.status": "Opened",
                },
              },
              async (err, result) => {
                if (err) {
                  console.log("Error:", err);
                  return res
                    .status(400)
                    .json({ status: 0, error: "Question Not Found" });
                } else {

                  var tut_wal = await TutorWalletSchema.findOne({ tutorId: que.tutorId });

                  if(tut_wal){
                      // console.log("tutor wallet not found");
                      var reanswerchoice = await ReAnswerChoiceSchema.findOne();
                      // console.log(reanswerchoice);
                      reanswerchoice = reanswerchoice.choice;

                      var tutorId = que.tutorId;

                      const tutorstatus = await TutorRegisterSchema.findOne({_id: que.tutorId});
                      if(!tutorstatus){
                        return res.status(400).json({ status: 0, error: "tutor status not found" });
                      }
                      if(tutorstatus === 1) {
                        
                      }else{

                    if (reanswerchoice === true) {
                            tut_wal.pendingAmount -= parseFloat(tutorPrice);
                        } else {
                            tut_wal.availableAmount -= parseFloat(que.tutorPrice);
                            tut_wal.earningAmount -= parseFloat(que.tutorPrice);
                        }
                        tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);
      
                  await TutorWalletSchema.findOneAndUpdate(
                      { tutorId, 'walletHistory.questionId': que._id },
                      { $set: { 'walletHistory.$.date': new Date(),
                              'walletHistory.$.status': "Failed",
                              'walletHistory.$.balance': tut_wal.availableAmount
                      } },
                      { arrayFilters: [{ 'elem.questionId': que._id }], new: true }
                    )
                      .then(async result => {
                        if (result) {
                          console.log(`TutorWallet document updated for questionId ${que._id}`);
      
                          result.map((value)=>{
                              // console.log(value.walletHistory)
                              value.walletHistory.map(async (value)=>{
                                  // console.log(value)
                                  let transactionId = value.transactionId;
                                  console.log(transactionId);
                                  await CentralTransactionsSchema.findOneAndUpdate(
                                              { transactionId, questionId : que._id },
                                              { $set: { "date": new Date(),
                                                      "status": "Failed",
                                                      "balance": tut_wal.availableAmount
                                              } }
                                            )
                                              .then(result => {
                                                if (result) {
                                                  console.log(`Transaction details document updated for questionId ${que._id}`);
                                                  // console.log(result);
                                                } else {
                                                  console.log(`No Transaction details document found for questionId ${que._id}`);
                                                  return res.status(400).json({ status: 0, error: "central transaction not found" });
                                                }
                                              })
                                              .catch((err) => {
                                                  console.error(err);
                                                  return res.status(400).json({ status: 0, error: "Internal Server Error" });
                                              });
                              })
      
                            })
                          // console.log(result);
                          await tut_wal.save();
                        } 
                        
                      })
                      .catch((err) => {
                          console.error(err);
                          return res.status(400).json({ status: 0, error: "Internal Server Error" });
                      });

                    }
      
                  }
                  
                  const tutor = await TutorPersonalSchema.findById(que.tutorId);
                  if (!tutor) {
                    return res
                      .status(400)
                      .json({ status: 0, error: "tutor not found" });
                  }

                  const tutorname = await TutorRegisterSchema.findById(
                    que.tutorId
                  );
                  if (!tutorname) {
                    return res
                      .status(400)
                      .json({ status: 0, error: "tutor email not found" });
                  }

                  const question = que.question.slice(0, 60);
                  const answer = que.answer.slice(0, 60);
                  const emailContent = downvoteTemplate(
                    tutor.name,
                    question,
                    answer
                  );

                  const subject =
                    "DoubtQ - Sorry!! student not liked your answer!";

                  let emailsent = await emailSender(
                    subject,
                    emailContent,
                    tutorname.email
                  );

                  console.log("emailsent", emailsent);
                  if (emailsent === "Email sent") {
                    // const message = "New Password Sent to Mail Successfully.";
                    console.log(emailsent);
                    // return res.status(200).json({ status: 1, message });
                  } else {
                    const error = "Mail Sending was Unsuccessful.";
                    console.log(error);
                    // return res.status(401).json({ status: 0, error });
                  }

                  // const mailOptions = {
                  //   from: GOOGLE_MAIL,
                  //   to: email,
                  //   subject: "DoubtQ - Account New Password",
                  //   html: emailContent,
                  // };

                  // transporter.sendMail(mailOptions, function (error, info) {
                  //   if (error) {
                  //     console.log(error);
                  //     const message = "Mail Sending was Unsuccessful.";
                  //     return res.status(401).json({ status: 0, message });
                  //   } else {
                  //     console.log("Email sent: " + info.response);

                  //     const message = "New Password Sent to Mail Successfully.";
                  //     return res.status(200).json({ status: 1, message });
                  //   }
                  // });
                  console.log("Result:", result);
                }
              }
            );
            findTutorAndAssignQuestion(que);
          } else {
            que.studentresponded = true;
            que.studentResponce = studentResponce;
            const updatedQuestion = await TutorQuestionsSchema.findOneAndUpdate(
              {
                tutorId: que.tutorId,
                "allQuestions.questionId": que._id,
              },
              {
                $inc: {
                  "stats.downvoteQuestions": 1,
                },
              },
              {
                new: true, // return the updated document
              }
            );

            if(!updatedQuestion) {
              return res.status(400).json({ status: 0, error: "Question Not Found" });
            }
            que.status = "Closed";

            await que.save();
            // change paymentgoesto to admin(alias entry) and then proceed

            StudentQuestionsSchema.updateOne(
              { "allQuestions.questionId": que._id },
              {
                $set: {
                  "allQuestions.$.status": "Closed",
                },
              },
              async (err, result) => {
                if (err) {
                  console.log("Error:", err);
                  return res
                    .status(400)
                    .json({ status: 0, error: "Question Not Found" });
                } else {
                  
                  var tut_wal = await TutorWalletSchema.findOne({ tutorId: que.tutorId });

                  if(tut_wal){
                    // console.log("tutor wallet not found");

                    var tutorId = que.tutorId;

                    const tutorstatus = await TutorRegisterSchema.findOne({_id: que.tutorId});
                    if(!tutorstatus){
                      return res.status(400).json({ status: 0, error: "tutor status not found" });
                    }
                    if(tutorstatus === 1) {
                      
                    }else{

                          tut_wal.availableAmount -= parseFloat(que.tutorPrice);
                          tut_wal.earningAmount -= parseFloat(que.tutorPrice);
                      
                      tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);
    
                await TutorWalletSchema.findOneAndUpdate(
                    { tutorId, 'walletHistory.questionId': que._id },
                    { $set: { 'walletHistory.$.date': new Date(),
                            'walletHistory.$.status': "Failed",
                            'walletHistory.$.balance': tut_wal.availableAmount
                    } },
                    { arrayFilters: [{ 'elem.questionId': que._id }], new: true }
                  )
                    .then(async result => {
                      if (result) {
                        console.log(`TutorWallet document updated for questionId ${que._id}`);
    
                        result.map((value)=>{
                            // console.log(value.walletHistory)
                            value.walletHistory.map(async (value)=>{
                                // console.log(value)
                                let transactionId = value.transactionId;
                                console.log(transactionId);
                                await CentralTransactionsSchema.findOneAndUpdate(
                                            { transactionId, questionId : que._id },
                                            { $set: { "date": new Date(),
                                                    "status": "Failed",
                                                    "balance": tut_wal.availableAmount
                                            } }
                                          )
                                            .then(result => {
                                              if (result) {
                                                console.log(`Transaction details document updated for questionId ${que._id}`);
                                                // console.log(result);
                                              } else {
                                                console.log(`No Transaction details document found for questionId ${que._id}`);
                                                return res.status(400).json({ status: 0, error: "central transaction not found" });
                                              }
                                            })
                                            .catch((err) => {
                                                console.error(err);
                                                return res.status(400).json({ status: 0, error: "Internal Server Error" });
                                            });
                            })
    
                          })
                        // console.log(result);
                        await tut_wal.save();
                      } 
                      
                    })
                    .catch((err) => {
                        console.error(err);
                        return res.status(400).json({ status: 0, error: "Internal Server Error" });
                    });

                  }
    
                }

                const tutorname = await TutorRegisterSchema.findById(
                  que.tutorId
                );
                if (!tutorname) {
                  return res
                    .status(400)
                    .json({ status: 0, error: "tutor email not found" });
                }
                  const tutor = await TutorPersonalSchema.findById(que.tutorId);
                  if (!tutor) {
                    return res
                      .status(400)
                      .json({ status: 0, error: "tutor not found" });
                  }
                 
                  const question = que.question.slice(0, 60);
                  const answer = que.answer.slice(0, 60);

                  const emailContent = downvoteTemplate(
                    tutor.name,
                    question,
                    answer
                  );

                  const subject =
                    "DoubtQ - Sorry!! student not liked your answer!";

                  let emailsent = await emailSender(
                    subject,
                    emailContent,
                    tutorname.email
                  );

                  console.log("emailsent", emailsent);
                  if (emailsent === "Email sent") {
                    // const message = "New Password Sent to Mail Successfully.";
                    console.log(emailsent);
                    // return res.status(200).json({ status: 1, message });
                  } else {
                    const error = "Mail Sending was Unsuccessful.";
                    console.log(error);
                    // return res.status(401).json({ status: 0, error });
                  }

                  // const mailOptions = {
                  //   from: GOOGLE_MAIL,
                  //   to: email,
                  //   subject: "DoubtQ - Account New Password",
                  //   html: emailContent,
                  // };

                  // transporter.sendMail(mailOptions, function (error, info) {
                  //   if (error) {
                  //     console.log(error);
                  //     const message = "Mail Sending was Unsuccessful.";
                  //     return res.status(401).json({ status: 0, message });
                  //   } else {
                  //     console.log("Email sent: " + info.response);

                  //     const message = "New Password Sent to Mail Successfully.";
                  //     return res.status(200).json({ status: 1, message });
                  //   }
                  // });
                  console.log("Result:", result);
                }
              }
            );
          }
        }
      } else {
        console.log("else que - ", que);
        return res.status(400).json({ status: 0 });
      }

      const message = "Student Reanswer Request Successfully.";
      return res.status(200).json({ status: 1, message });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async getquestionprice(req, res, next) {
    try {
      var que_pri = await QuestionPricingSchema.find();
      var pr;
      var data = [];
      for (var i = 0; i < que_pri.length; i++) {
        var pr = await QuestionPriceInUsd(que_pri[i].Type);
        var obj = { type: que_pri[i].Type, price: pr };
        data.push(obj);
      }
      return res.status(200).json({ status: 1, data });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async openstatus(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      // console.log(rec_token._id);
      const st_id = rec_token._id;
      const limit = parseInt(req.query.limit);
      const skip = parseInt(req.query.skip);
      const questionType = req.query.questionType;

      const que = await StudentQuestionsSchema.findOne({
        studentId: st_id,
      }).exec();

      // console.log(que);
      if (!que) {
        return res.status(400).json({ status: 0, error: "Question not found" });
      }
      let aa = [];

      const quefilter = questionType
        ? que.allQuestions.filter(
            (q) =>
              (q.status === "Opened" || q.status === "NotOpened") &&
              q.questionType === questionType
          )
        : que.allQuestions
            .filter((q) => q.status === "Opened" || q.status === "NotOpened")
            .sort((a, b) => b.dateOfPosted - a.dateOfPosted) // sort by date in descending order
            .slice(skip, skip + limit);
      // console.log(questions);
      const questions = quefilter
        .sort((a, b) => b.dateOfPosted - a.dateOfPosted)
        .slice(skip, skip + limit);
      for (var i = 0; i < questions.length; i++) {
        if (questions[i].status === "Opened") {
          // console.log(que.allQuestions[i].questionId)
          const mainque = await MainQuestionsSchema.findOne({
            _id: questions[i].questionId,
          });

          if (!mainque) {
            continue;
            // return res.status(400).json({ status: 0, error: "Quesstion not found" });
          }
          const images = await ImageSchema.find({
            _id: { $in: questions[i].questionPhoto },
          });
          const imageUrls = images.map((image) => {
            return `data:${image.contentType};base64,${image.data.toString(
              "base64"
            )}`;
          });

          questions[i].questionPhoto = imageUrls;
          var question = {
            questionId: questions[i].questionId,
            question: questions[i].question,
            questionPhoto: questions[i].questionPhoto,
            questionType: questions[i].questionType,
            questionSubject: questions[i].questionSubject,
            questionPrice: questions[i].questionPrice,
            status: questions[i].status,
            answer: mainque.answer,
            explanation: mainque.explanation && mainque.explanation,
          };
          aa.push(question);
        } else {
          const images = await ImageSchema.find({
            _id: { $in: questions[i].questionPhoto },
          });
          // console.log(images);
          const imageUrls = images.map((image) => {
            return `data:${image.contentType};base64,${image.data.toString(
              "base64"
            )}`;
          });
          // console.log(imageUrls)
          questions[i].questionPhoto = imageUrls;

          var question = {
            questionId: questions[i].questionId,
            question: questions[i].question,
            questionPhoto: questions[i].questionPhoto,
            questionType: questions[i].questionType,
            questionSubject: questions[i].questionSubject,
            questionPrice: questions[i].questionPrice,
            status: questions[i].status,
          };
          aa.push(question);
        }
      }
      return res.status(200).json({ status: 1, info: aa });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  // async chagestatusfromnotopenedtoopened(req, res, next) {
  //     try {
  //         const { error } = chageStatusFromNotOpenedToOpenedValidatorSchema.validate(req.body);
  //         if (error) {
  //             return res.status(400).json({ status: 0, error: error.message });
  //         }
  //         // console.log({ token: req.body.token });
  //         let rec_token = await TokenStudent.fetchByToken({
  //             token: req.body.token,
  //         });
  //         if (rec_token === null || !rec_token.token) {
  //             return res.status(400).json({ status: 0, error: "Invalid refresh token!" });
  //         }
  //         // console.log(rec_token._id);
  //         const st_id = rec_token._id;

  //         var { questionId } = req.body;

  //         questionId = new ObjectId(questionId);

  //         var mainque = await MainQuestionsSchema.findById(questionId);

  //         if(!mainque) {
  //             return res.status(401).json({ status: 0, error: "Question Not Found!" });
  //         }

  //         if(mainque.status === 'NotOpened') {
  //             if(st_id.equals(mainque.studentId)) {
  //                 mainque.status = 'Opened';

  //                 mainque.answerClosingAt =
  //             }
  //         }

  //     } catch (error) {
  //         console.log("error: ", error);
  //         return res.status(400).json({ status: 0, error });
  //     }
  // },
  async closedstatus(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      const limit = parseInt(req.query.limit);
      const skip = parseInt(req.query.skip);
      const questionType = req.query.questionType;

      const que = await StudentQuestionsSchema.findOne({
        studentId: st_id,
      }).exec();
      if (!que) {
        return res.status(400).json({ status: 0, error: "Question not found" });
      }
      let aa = [];

      const questionfilter = questionType
        ? que.allQuestions.filter(
            (q) => q.status === "Closed" && q.questionType === questionType
          )
        : que.allQuestions.filter((q) => q.status === "Closed");
      // .sort((a, b) => b.dateOfPosted - a.dateOfPosted) // sort by date in descending order
      // .slice(skip, skip + limit);

      const questions = questionfilter
        .sort((a, b) => b.dateOfPosted - a.dateOfPosted)
        .slice(skip, skip + limit);

      for (var i = 0; i < questions.length; i++) {
        const mainque = await MainQuestionsSchema.findOne({
          _id: questions[i].questionId,
        });
        if (!mainque) {
          continue;
          // return res.status(400).json({ status: 0, error: "Question not found" });
        }

        const images = await ImageSchema.find({
          _id: { $in: questions[i].questionPhoto },
        });

        const imageUrls = images.map((image) => {
          return `data:${image.contentType};base64,${image.data.toString(
            "base64"
          )}`;
        });

        questions[i].questionPhoto = imageUrls;
        var closeque = {
          questionId: questions[i].questionId,
          question: questions[i].question,
          questionPhoto: questions[i].questionPhoto,
          questionType: questions[i].questionType,
          questionSubject: questions[i].questionSubject,
          questionPrice: questions[i].questionPrice,
          status: questions[i].status,
          answer: !mainque.reAnswer && mainque.answer,
          explanation: !mainque.reAnswer && mainque.explanation,
          reanswer: mainque.reAnswer && mainque.reAnswer,
          reexplanation: mainque.reExplanation && mainque.reExplanation,
          studentResponce: mainque.studentresponded && mainque.studentResponce,
        };
        aa.push(closeque);
        // console.log(mainque)
      }

      return res.status(200).json({ status: 1, info: aa });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async pendingstatus(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;
      const limit = parseInt(req.query.limit);
      const skip = parseInt(req.query.skip);
      const questionType = req.query.questionType;

      const que = await StudentQuestionsSchema.findOne({
        studentId: st_id,
      }).exec();
      if (!que) {
        return res.status(400).json({ status: 0, error: "Question not found" });
      }
      let aa = [];

      const questionfilter = questionType
        ? que.allQuestions.filter(
            (q) => q.status === "PENDING" && q.questionType === questionType
          )
        : que.allQuestions.filter((q) => q.status === "PENDING");
      // .sort((a, b) => b.dateOfPosted - a.dateOfPosted) // sort by date in descending order
      // .slice(skip, skip + limit);

      const questions = questionfilter
        .sort((a, b) => b.dateOfPosted - a.dateOfPosted)
        .slice(skip, skip + limit);
      for (var i = 0; i < questions.length; i++) {
        const mainque = await MainQuestionsSchema.findOne({
          _id: questions[i].questionId,
        });
        console.log(mainque);
        if (!mainque) {
          continue;
          // return res.status(400).json({ error: "Question not found" });
        }
        const images = await ImageSchema.find({
          _id: { $in: questions[i].questionPhoto },
        });

        const imageUrls = images.map((image) => {
          return `data:${image.contentType};base64,${image.data.toString(
            "base64"
          )}`;
        });

        questions[i].questionPhoto = imageUrls;

        aa.push(questions[i]);
      }
      return res.status(200).json({ status: 1, info: aa });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async issuequestion(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;
      const limit = parseInt(req.query.limit);
      const skip = parseInt(req.query.skip);
      const questionType = req.query.questionType;

      const que = await StudentQuestionsSchema.findOne({
        studentId: st_id,
      }).exec();
      // console.log(que);
      if (!que) {
        return res.status(400).json({ status: 0, error: "Question not found" });
      }
      let aa = [];
      const questionfilter = questionType
        ? que.allQuestions.filter(
            (q) => q.status === "Issue" && q.questionType === questionType
          )
        : que.allQuestions
            .filter((q) => q.status === "Issue")
            .sort((a, b) => b.dateOfPosted - a.dateOfPosted) // sort by date in descending order
            .slice(skip, skip + limit);
      // console.log(questions);
      // console.log(questions);
      const questions = questionfilter
        .sort((a, b) => b.dateOfPosted - a.dateOfPosted)
        .slice(skip, skip + limit);

      for (var i = 0; i < questions.length; i++) {
        const mainque = await MainQuestionsSchema.findOne({
          _id: questions[i].questionId,
        });
        console.log(mainque);
        if (!mainque) {
          continue;
          // return res.status(400).json({ error: "Question not found" });
        }
        // console.log(mainque);
        const images = await ImageSchema.find({
          _id: { $in: questions[i].questionPhoto },
        });
        //    console.log(images)
        const imageUrls = images.map((image) => {
          return `data:${image.contentType};base64,${image.data.toString(
            "base64"
          )}`;
        });

        questions[i].questionPhoto = imageUrls;
        const question = {
          questionId: questions[i].questionId,
          question: questions[i].question,
          questionPhoto: questions[i].questionPhoto,
          questionType: questions[i].questionType,
          questionSubject: questions[i].questionSubject,
          questionPrice: questions[i].questionPrice,
          status: questions[i].status,
          newReason: mainque.newReason,
          newReasonText: mainque.newReasonText,
          isNewReasonExecuted: mainque.isNewReasonExecuted,
        };
        aa.push(question);
      }
      return res.status(200).json({ status: 1, info: aa });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async questions(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      const limit = parseInt(req.query.limit);
      const skip = parseInt(req.query.skip);
      console.log(req.query.questionType);
      const que = await StudentQuestionsSchema.findOne({ studentId: st_id })
        .select("allQuestions")
        .exec();

      if (!que) {
        return res
          .status(400)
          .json({ status: 0, error: "Questions not found" });
      }

      // Apply the questionType filter to the questions array
      const questionType = req.query.questionType;
      const filteredQuestions = questionType
        ? que.allQuestions.filter((q) => q.questionType === questionType)
        : que.allQuestions;

      const questions = filteredQuestions.slice(skip, skip + limit);
      // .select("allQuestions")
      // .slice("allQuestions", [+skip, +limit])
      // .exec();

      // return res.status(200).json({ status: 1, questions });

      if (!questions) {
        return res
          .status(400)
          .json({ status: 0, error: "Questions not found" });
      }
      let aa = [];
      for (var i = 0; i < questions.length; i++) {
        if (
          questions[i].status === "Opened" ||
          questions[i].status === "Closed"
        ) {
          console.log(questions[i].questionId);
          const mainque = await MainQuestionsSchema.findOne({
            _id: questions[i].questionId,
          });
          if (!mainque) {
            continue;
            // return res.status(400).json({ status: 0, error: "Quesstion not found" });
          }
          const images = await ImageSchema.find({
            _id: { $in: questions[i].questionPhoto },
          });

          const imageUrls = images.map((image) => {
            return `data:${image.contentType};base64,${image.data.toString(
              "base64"
            )}`;
          });

          questions[i].questionPhoto = imageUrls;
          var question = {
            questionId: questions[i].questionId,
            question: questions[i].question,
            questionPhoto: questions[i].questionPhoto,
            questionType: questions[i].questionType,
            questionSubject: questions[i].questionSubject,
            questionPrice: questions[i].questionPrice,
            status: questions[i].status,
            answer: mainque.answer,
            explanation: mainque.explanation && mainque.explanation,
            reanswer: mainque.reAnswer && mainque.reAnswer,
            reexplanation: mainque.reExplanation && mainque.reExplanation,
            studentResponce:
              mainque.studentresponded && mainque.studentResponce,
          };
          aa.push(question);
        } else if (
          questions[i].status === "NotOpened" ||
          questions[i].status === "PENDING"
        ) {
          const images = await ImageSchema.find({
            _id: { $in: questions[i].questionPhoto },
          });

          const imageUrls = images.map((image) => {
            return `data:${image.contentType};base64,${image.data.toString(
              "base64"
            )}`;
          });

          questions[i].questionPhoto = imageUrls;
          var question = {
            questionId: questions[i].questionId,
            question: questions[i].question,
            questionPhoto: questions[i].questionPhoto,
            questionType: questions[i].questionType,
            questionSubject: questions[i].questionSubject,
            questionPrice: questions[i].questionPrice,
            status: questions[i].status,
          };
          aa.push(question);
        } else {
          const mainque = await MainQuestionsSchema.findOne({
            _id: questions[i].questionId,
          });
          if (!mainque) {
            return res.status(400).json({ error: "Question not found" });
          }
          const images = await ImageSchema.find({
            _id: { $in: questions[i].questionPhoto },
          });

          const imageUrls = images.map((image) => {
            return `data:${image.contentType};base64,${image.data.toString(
              "base64"
            )}`;
          });

          questions[i].questionPhoto = imageUrls;
          const question = {
            questionId: questions[i].questionId,
            question: questions[i].question,
            questionPhoto: questions[i].questionPhoto,
            questionType: questions[i].questionType,
            questionSubject: questions[i].questionSubject,
            questionPrice: questions[i].questionPrice,
            status: questions[i].status,
            newReason: mainque.newReason,
            newReasonText: mainque.newReasonText,
            isNewReasonExecuted: mainque.isNewReasonExecuted,
          };
          aa.push(question);
        }
      }
      return res.status(200).json({ status: 1, info: aa });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async studentcontact(req, res, next) {
    try {
      const { error } = StudentContactValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      const { fullname, mobileNo, email, Message } = req.body;
      const document = await StudentContactSchema.create({
        userId: st_id,
        fullname,
        mobileNo,
        email,
        Message,
      });
      document.save();
      return res.status(200).json({ status: 1, document });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async wallethistory(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      const student = await StudentRegisterSchema.findOne({ _id: st_id });
      let document;

      if (!student) {
        console.log("error - ", error);
        return res.status(400).json({ status: 0, error: error });
      }

      if (student) {
        document = await StudentWalletSchema.findOne({ studentId: st_id });

        if (!document) {
          console.log("error - ");
          return res
            .status(400)
            .json({ status: 0, error: "Please complete yoyr Registration" });
        }
      }
      return res.status(200).json({ status: 1, document });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async poststreak(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      const document = await StudentQuestionsSchema.findOne({
        studentId: st_id,
      });
      if (!document) {
        return res
          .status(400)
          .json({ status: 0, error: "Question not found!" });
      } else {
        var questionCount = parseInt(document.postquestions);
        console.log(questionCount);
        // questionCount = 50;
        var poststreak = [];
        var data = {};
        var currency = await CurrencyConversionSchema.findOne();

        var pri = await StudentPostingStreakSchema.findOne();

        var ini = parseFloat(pri.initial) / parseFloat(currency.ConversionToInr);
        ini = parseFloat(ini.toFixed(2));
        var incr = parseFloat(pri.extrasum) / parseFloat(currency.ConversionToInr);
        incr = parseFloat(incr.toFixed(2));
        
        // console.log(ini, incr);

        var stu_infor = await StudentInformationSchema.findOne({ userId: st_id });

        var post_data = stu_infor.postingStreak;


        for (var i = 0; i < 10; i++) {
          data.srno = i + 1;
          if (questionCount <= parseInt(50) * parseInt(i + 1)) {
            data.filldata = questionCount;
          } else {
            data.filldata = parseInt(50) * parseInt(i + 1);
          }
          data.totaldata = parseInt(50) * parseInt(i + 1);
          if (i === 0) {
            data.price = parseFloat(ini.toFixed(2));
          } else {
            data.price = parseFloat((ini + incr).toFixed(2));
            ini = data.price;
          }

          if(data.filldata === data.totaldata) {
            if(post_data[i].redeemed === 0) {
              data.iscashedout = 1;
            } else {
              data.iscashedout = 2;
            }
          } else {
            data.iscashedout = 0;
          }
          poststreak.push(data);
          data = {};
        }
      }

      return res.status(200).json({ status: 1, poststreak });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async poststreakcashout(req, res, next) {
    try {
      const { error } = StudentPostStreakCashoutValidatorSchema.validate(
        req.body
      );
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      var stu_que = await StudentQuestionsSchema.findOne({ studentId: st_id });

      var currency = await CurrencyConversionSchema.findOne();

      var pri = await StudentPostingStreakSchema.findOne();

        var ini = parseFloat(pri.initial) / parseFloat(currency.ConversionToInr);
        ini = parseFloat(ini.toFixed(2));
        var incr = parseFloat(pri.extrasum) / parseFloat(currency.ConversionToInr);
        incr = parseFloat(incr.toFixed(2));
      // console.log(tut_que);

      if (!stu_que) {
        return res.status(400).json({ status: 0, error: "No Student Found" });
      } else {
        var questionCount = parseInt(stu_que.postquestions);

        var { srno } = req.body;

        srno = parseInt(srno);

        var price = 0;

        var stu_infor = await StudentInformationSchema.findOne({ userId: st_id });



        price = parseFloat((ini + (srno - 1)*incr).toFixed(2));

        console.log(price);

        if(srno < 11 && srno >= 1){
          var que = parseInt(50 * srno);
          
          if(questionCount >= que) {
            
            // console.log("que", que, questionCount);

            if(stu_infor.postingStreak[srno - 1].redeemed === 0) {
              
              stu_infor.postingStreak[srno - 1].redeemed = 1;

              await stu_infor.save();


              price = parseFloat((ini + (srno - 1)*incr).toFixed(2));

              if (price !== 0) {
                var stu_wal = await StudentWalletSchema.findOne({ studentId: st_id });
                // console.log(tut_wal);
                if (stu_wal) {
                  // let price = 1;
                  stu_wal.availableAmount += parseFloat(price);
                  stu_wal.redeemableAmount -= parseFloat(price);
                  stu_wal.totalAmount =
                    parseFloat(stu_wal.availableAmount) +
                    parseFloat(stu_wal.redeemableAmount);
      
                  const transaction = {
                    transactionId: await generateTransactionId(),
                    date: new Date(),
                    type: "Referral",
                    amount: price,
                    description: `Referral Bonus`,
                    status: "Success",
                    balance: stu_wal.availableAmount,
                  };
                  let name;
                  let studentname = await StudentInformationSchema.findOne({
                    userId: stu_wal.studentId,
                  });
                  name = "student";
                  if (studentname) {
                    name = studentname.name;
                  }
      
                  const centaltransactiondetails =
                    await CentralTransactionsSchema.create({
                      category: "Student",
                      walletId: stu_wal._id,
                      transactionId: transaction.transactionId,
                      name: name,
                      date: transaction.date,
                      type: transaction.type,
                      amount: transaction.amount,
                      description: transaction.description,
                      status: transaction.status,
                      balance: transaction.balance,
                    });
                  if (!centaltransactiondetails) {
                    return res.status(400).json({ status: 0, error: "central transaction not created!" });
                  }
                  await centaltransactiondetails.save();
                  stu_wal.walletHistory.unshift(transaction);
                  await stu_wal.save();
                } else {
                  return res.status(400).json({ status: 0, error: "Student Wallet Not Found!" });
                }
              }
              return res.status(200).json({ status: 1, message: "Cash Out Successfully" });
            } else {
              return res.status(400).json({ status: 0, error: "Already Bonus Redeedmed!" });
            }
          } else {
            return res.status(400).json({ status: 0, error: "Not Enough Questions" });
          }
        }



        // if (
        //   srno === 1 &&
        //   questionCount >= 50 &&
        //   stu_que.refer1cashedout === false
        // ) {
        //   stu_que.refer1cashedout = true;
        //   await stu_que.save();
        //   price = parseInt(1) * srno;
        // } else if (
        //   srno === 2 &&
        //   questionCount >= 100 &&
        //   stu_que.refer2cashedout === false
        // ) {
        //   stu_que.refer2cashedout = true;
        //   await stu_que.save();
        //   price = parseInt(1) * srno;
        // } else if (
        //   srno === 3 &&
        //   questionCount >= 150 &&
        //   stu_que.refer3cashedout === false
        // ) {
        //   stu_que.refer3cashedout = true;
        //   await stu_que.save();
        //   price = parseInt(1) * srno;
        // } else if (
        //   srno === 4 &&
        //   questionCount >= 200 &&
        //   stu_que.refer4cashedout === false
        // ) {
        //   stu_que.refer4cashedout = true;
        //   await stu_que.save();
        //   price = parseInt(1) * srno;
        // } else {
        //   return res
        //     .status(400)
        //     .json({ status: 0, error: "Not Enough Questions" });
        // }

        
      }
    } catch (err) {
      console.log(err);
      return res.status(500).json({ status: 0, error: "Internal Server Error" });
    }
  },
  async referraldashboard(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      const stu = await StudentRegisterSchema.findOne({ _id: st_id });
      if (!stu) {
        return res.status(400).json({ status: 0, error: "student not found" });
      }
      const document = await StudentInformationSchema.findOne({
        email: stu.email,
      });
      if (!document) {
        return res
          .status(400)
          .json({ status: 0, error: "student information not found" });
      }
      
      const referaldetail = document.referralHistory;

      let pri = await StudentPostingStreakSchema.findOne();

      if(!pri){
        return res.status(400).json({ status: 0, error: "student postingstreak not found" });
      }
      for( var i = 0; i < referaldetail.length; i++ ){
        
      const studentwallet = await StudentWalletSchema.findOne({ studentId: referaldetail[i].userId });
      
      if(!studentwallet){
        return res.status(400).json({ status: 0, error: "student wallet not found" });
      }

      if(studentwallet.depositAmount >= pri.paymentcondition){
        
        const student = await StudentInformationSchema.findOne({ email: stu.email, 'referralHistory.userId': studentwallet.studentId });
            
                if(!student){
                    return res.status(400).json({ status: 0, error: "student not found" });
                }
                console.log(student);
                const verifiedReferrals = student.referralHistory.filter(referral => referral.userId.equals(studentwallet.studentId));

                return res.status(200).json({ status: 1, info: verifiedReferrals });
        
      }else{
        return res.status(400).json({ status: 0, error: "student referral not found" });
      }
    }

      // return res.status(200).json({ status: 1, info: referaldetail });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async registerquestion(req, res, next) {
    try {
      upload(req, res, async (err) => {
        if (err) {
          console.log("error - ", err);
          return res.status(400).json({ status: 0, err });
        }

        const { error } = StudentregisterquestionValidatorSchema.validate(
          req.body
        );
        if (error) {
          return res.status(400).json({ status: 0, error: error.message });
        }
        const { password } = req.body;
        const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;

        var user;

        var aa;
        let token;
        let otpverify;
        if (req.body.referralCode) {
          const student = await StudentInformationSchema.findOne({
            ownReferral: req.body.referralCode,
          });

          // otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);

          // if (otpverify !== "OTP verified successfully") {
          //   return res.status(400).json({ status: 0, error: otpverify });
          // }
          if (student) {
            user = new StudentRegisterSchema({
              email: req.body.email,
              password: req.body.password,
              registerType: "email",
              referralCode: req.body.referralCode,
              googleverified: 1,
              emailverified: 0,
            });

            if (req.body.class) {
              user.class = req.body.class;
          }
          
          if (req.body.mobileNo) {
              user.mobileNo = req.body.mobileNo;
          }
            // if (req.body.class) {
            //   user = new StudentRegisterSchema({
            //     email: req.body.email,
            //     password: req.body.password,
            //     mobileNo: req.body.mobileNo,
            //     registerType: "email",
            //     class: req.body.class,
            //     referralCode: req.body.referralCode,
            //   });
            // } else {
            //   user = new StudentRegisterSchema({
            //     email: req.body.email,
            //     password: req.body.password,
            //     mobileNo: req.body.mobileNo,
            //     registerType: "email",
            //     referralCode: req.body.referralCode,
            //   });
            // }

            aa = await Student.create(user);

            if (!aa.error) {
              let data = {
                userId: aa._id,
                email: aa.email,
                referdate: Date.now(),
                amount: 1,
                redeemed: false,
              };
              student.referralHistory.unshift(data);
              await student.save();

              const studentinfo = await StudentInformationSchema.create({
                userId: aa._id,
                email: aa.email,
                ownReferral: generateReferralCode(aa._id),
              });
              await studentinfo.save();
              // console.log(aa);
              let refresh_token;
              // access_token = await JwtService.sign({_id:document._id});
              refresh_token = await JwtService.sign({ _id: aa._id });
              var tt = await TokenStudentSchema.create({
                _id: aa._id,
                token: refresh_token,
                expiresAt: new Date(),
              });
              token = refresh_token;
              var wal = await StudentWallet.create({ studentId: aa._id });

              if (wal) {
                let price = 1;
                wal.availableAmount += parseFloat(price);
                wal.totalAmount =
                  parseFloat(wal.availableAmount) +
                  parseFloat(wal.redeemableAmount);

                const transaction = {
                  transactionId: await generateTransactionId(),
                  date: new Date(),
                  type: "Deposit",
                  amount: price,
                  description: `Registration Bonus`,
                  status: "Success",
                  balance: wal.availableAmount,
                };
                let name;

                name = "student";

                var centaltransactiondetails;
                try {
                  console.log("name - ", name);
                  centaltransactiondetails =
                    await CentralTransactionsSchema.create({
                      category: "Student",
                      walletId: wal._id,
                      transactionId: transaction.transactionId,
                      name,
                      date: transaction.date,
                      type: transaction.type,
                      amount: transaction.amount,
                      description: transaction.description,
                      status: transaction.status,
                      balance: transaction.balance,
                    });
                  console.log("transacation - ", centaltransactiondetails);
                } catch (error) {
                  console.log("error - ", error);
                }

                if (!centaltransactiondetails) {
                  return res.status(400).json({
                    status: 0,
                    error: "central transaction not created!",
                  });
                }
                try {
                  await centaltransactiondetails.save();
                } catch (error) {
                  console.log("error at save, ", error);
                }

                wal.walletHistory.unshift(transaction);
                await wal.save();
              }

              var st_qu = await StudentQuestions.create({ studentId: aa._id });
              var info = aa;
              var message = "User Registered Successfully.";
              // return res.status(200).json({ info, token, message });
              // res.json(aa);
              // res.redirect("/student/home");
            } else {
              return res.status(400).json({ status: 0, error: aa.error });
              // res.redirect("/student/register");
            }
          } else {
            var message = "Invalid Referral code!";
            return res.status(400).json({ status: 0, error: message });
          }
        } else {
          console.log("data", req.body);

          otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);

          if (otpverify !== "OTP verified successfully") {
            return res.status(400).json({ status: 0, error: otpverify });
          }

          user = new StudentRegisterSchema({
            email: req.body.email,
            password: req.body.password,
            registerType: "email",
            referralCode: req.body.referralCode,
            googleverified: 1,
            emailverified: 0,
          });

          if (req.body.class) {
            user.class = req.body.class;
        }
        
        if (req.body.mobileNo) {
            user.mobileNo = req.body.mobileNo;
        }

          // if (req.body.class) {
          //   user = new StudentRegisterSchema({
          //     email: req.body.email,
          //     password: req.body.password,
          //     mobileNo: req.body.mobileNo,
          //     registerType: "email",
          //     class: req.body.class,
          //   });
          // } else {
          //   user = new StudentRegisterSchema({
          //     email: req.body.email,
          //     password: req.body.password,
          //     mobileNo: req.body.mobileNo,
          //     registerType: "email",
          //   });
          // }

          aa = await Student.create(user);

          if (!aa.error) {
            const studentinfo = await StudentInformationSchema.create({
              userId: aa._id,
              email: aa.email,
              ownReferral: generateReferralCode(aa._id),
            });
            await studentinfo.save();
            // console.log(aa);
            let refresh_token;
            // access_token = await JwtService.sign({_id:document._id});
            refresh_token = await JwtService.sign({ _id: aa._id });
            var tt = await TokenStudentSchema.create({
              _id: aa._id,
              token: refresh_token,
              expiresAt: new Date(),
            });
            token = refresh_token;
            var wal = await StudentWallet.create({ studentId: aa._id });

            if (wal) {
              let price = 1;
              wal.availableAmount += parseFloat(price);
              wal.totalAmount =
                parseFloat(wal.availableAmount) +
                parseFloat(wal.redeemableAmount);

              const transaction = {
                transactionId: await generateTransactionId(),
                date: new Date(),
                type: "Deposit",
                amount: price,
                description: `Registration Bonus`,
                status: "Success",
                balance: wal.availableAmount,
              };
              let name;

              name = "student";

              const centaltransactiondetails =
                await CentralTransactionsSchema.create({
                  category: "Student",
                  walletId: wal._id,
                  transactionId: transaction.transactionId,
                  name: name,
                  date: transaction.date,
                  type: transaction.type,
                  amount: transaction.amount,
                  description: transaction.description,
                  status: transaction.status,
                  balance: transaction.balance,
                });
              if (!centaltransactiondetails) {
                return res.status(400).json({
                  status: 0,
                  error: "central transaction not created!",
                });
              }
              await centaltransactiondetails.save();

              wal.walletHistory.unshift(transaction);
              await wal.save();
            }

            var st_qu = await StudentQuestions.create({ studentId: aa._id });
            var info = aa;
            var message = "User Registered Successfully.";
            // return res.status(200).json({ info, token, message });
            // res.json(aa);
            // res.redirect("/student/home");
          } else {
            return res.status(400).json({ status: 0, error: aa.error });
            // res.redirect("/student/register");
          }
        }
        var que_pricing = await QuestionPricingSchema.findOne({
          Type: req.body.questionType,
        });

        if (!que_pricing) {
          return res
            .status(400)
            .json({ status: 0, error: "Please enter correct Questiontype!" });
        }

        var price = await QuestionPriceInUsd(req.body.questionType);

        var typename = questionTypeName(req.body.questionType);

        var st_wal = await StudentWalletSchema.findOne({ studentId: aa._id });
        console.log("student wallet - ", st_wal);

        var limit = 0.25;
        var compare = parseFloat(limit) + parseFloat(price);

        console.log("wallet balance - ", st_wal.availableAmount);
        console.log("compare - ", compare);

        console.log(st_wal.availableAmount < compare);

        if (st_wal.availableAmount < compare) {
          req.files.map((file) => {
            // Delete the file from the local disk after it has been saved to the database
            fs.unlinkSync(file.path);
          });
          return res
            .status(400)
            .json({ status: 0, error: "Your Balance is not Suffecient!" });
        } else {
          st_wal.availableAmount -= parseFloat(price);
          st_wal.totalAmount =
            parseFloat(st_wal.availableAmount) +
            parseFloat(st_wal.redeemableAmount);

          const transaction = {
            transactionId: await generateTransactionId(),
            date: new Date(),
            type: "Question posted",
            amount: parseFloat(price),
            description: `Payment for ${typename} question`,
            status: "Success",
            balance: st_wal.availableAmount,
          };
          let name;
          name = "student";

          const centaltransactiondetails =
            await CentralTransactionsSchema.create({
              category: "Student",
              walletId: st_wal._id,
              transactionId: transaction.transactionId,
              name,
              date: transaction.date,
              type: transaction.type,
              amount: transaction.amount,
              description: transaction.description,
              status: transaction.status,
              balance: transaction.balance,
            });
          if (!centaltransactiondetails) {
            return res
              .status(400)
              .json({ status: 0, error: "central transaction not created!" });
          }
          await centaltransactiondetails.save();
          st_wal.walletHistory.unshift(transaction);
          await st_wal.save();
        }

        // Save the uploaded images to the Image schema
        const imagePromises = req.files.map(async (file) => {
          const img = new ImageSchema();
          img.name = file.filename;
          img.data = fs.readFileSync(file.path);
          img.contentType = file.mimetype;
          var nn = await img.save();
          if (nn) {
            console.log("nn = ", nn);
            fs.unlinkSync(file.path);
          }

          return nn;
          // return img.save().then(() => {
          //     // Delete the file from the local disk after it has been saved to the database
          //     fs.unlinkSync(file.path);
          //   });
        });

        const images = await Promise.all(imagePromises);
        const imageIds = images.map((image) => image._id);
        // console.log(imageIds);

        const { question, questionType, questionSubject } = req.body;
        // console.log(req.file.filename);

        const now = new Date();
        // const oneDay = 24 * 60 * 60 * 1000;
        // const twoDays = 2 * oneDay;
        // const threeDays = 3 * oneDay;

        const mainque = await MainQuestionsSchema.create({
          question,
          // questionPhoto: req.files.map(file => file.filename),
          questionPhoto: imageIds,
          questionType,
          questionSubject,
          status: "PENDING",
          studentId: aa._id,
          questionPrice: price,
          tutorPrice: que_pricing.tutor_price,
          adminPrice: que_pricing.admin_price,
          createdAt: now,
          // onedayafter_tutor_end: new Date(now.getTime() + oneDay),
          // twodayafter_admin_end: new Date(now.getTime() + twoDays),
          // threedayafter_unsolved_end: new Date(now.getTime() + threeDays),
          whomto_ask: "tutor",
        });

        // console.log(mainque);

        const questionId = mainque._id;

        StudentQuestionsSchema.findOneAndUpdate(
          { studentId: aa._id },
          {
            $push: {
              allQuestions: [
                {
                  questionId: questionId,
                  question,
                  // questionPhoto: req.files.map(file => file.filename),
                  questionPhoto: imageIds,
                  questionType,
                  questionSubject,
                  questionPrice: price,
                  dateOfPosted: new Date(),
                  status: "PENDING",
                },
              ],
            },
          },
          (error, result) => {
            if (error) {
              console.log("dsds");
              console.error(error);
              return;
            } else {
              console.log("Array of questions pushed:", result);
            }
          }
        );

        // sent to tutor
          // console.log(mainque)
        var new_status = await findTutorAndAssignQuestion(mainque);
          console.log(new_status)
        if (new_status) {
          return res.status(200).json({
            status: 1,
            info: aa,
            token,
            message: "Question posted successfully",
          });
        } else {
          return res
            .status(400)
            .json({ status: 0, error: "Question posting was unsuccessful!" });
        }
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ status: 0, error });
    }
  },
  async referralcomplete(req, res, next) {
    try {
      const { error } = StudentReferralCompleteValidatorSchema.validate(
        req.body
      );
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;
      // console.log(st_id);

      var { userId } = req.body;

      userId = new ObjectId(userId);

      const result = await StudentInformationSchema.findOne({
        userId: st_id,
        "referralHistory.userId": userId,
      });

      if (result) {
        // console.log(result);
        for (var i = 0; i < result.referralHistory.length; i++) {
          if (
            userId.equals(result.referralHistory[i].userId) &&
            result.referralHistory[i].redeemed === false
          ) {

            var currency = await CurrencyConversionSchema.findOne();

            const pri = await StudentPostingStreakSchema.findOne();

            var referpersonal = parseFloat(pri.referralpersonalreward) / parseFloat(currency.ConversionToInr);
            referpersonal = parseFloat(referpersonal.toFixed(2));
            var referother = parseFloat(pri.referralotherreward) / parseFloat(currency.ConversionToInr);
            referother = parseFloat(referother.toFixed(2));

            console.log(result.referralHistory[i]);

            var st_wal = await StudentWalletSchema.findOne({
              studentId: st_id,
            });
            // console.log(st_wal);
            if (st_wal) {

              try{
                let price = referpersonal;
              st_wal.availableAmount += parseFloat(price);
              if (st_wal.redeemableAmount >= 1) {
                st_wal.redeemableAmount -= parseFloat(price);
              }
              st_wal.referralAmount += parseFloat(price);
              st_wal.totalAmount =
                parseFloat(st_wal.availableAmount) +
                parseFloat(st_wal.redeemableAmount);

              const transaction = {
                transactionId: await generateTransactionId(),
                date: new Date(),
                type: "Referral",
                amount: price,
                description: `Referral Bonus`,
                status: "Success",
                balance: st_wal.availableAmount,
              };
              let name;
              let studentname = await StudentInformationSchema.findOne({
                userId: st_wal.studentId,
              });
              name = "student";
              if (studentname) {
                name = studentname.name;
              }

              const centraltransaction = {
                category: "Student",
                walletId: st_wal._id,
                transactionId: transaction.transactionId,
                name: name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                status: transaction.status,
                balance: transaction.balance,
              };

              const centaltransactiondetails =
                await CentralTransactionsSchema.create({
                  category: "Student",
                  walletId: st_wal._id,
                  transactionId: transaction.transactionId,
                  name: name,
                  date: transaction.date,
                  type: transaction.type,
                  amount: transaction.amount,
                  description: transaction.description,
                  status: transaction.status,
                  balance: transaction.balance,
                });
              if (!centaltransactiondetails) {
                return res.status(400).json({
                  status: 0,
                  error: "central transaction not created!",
                });
              }
              await centaltransactiondetails.save();
              st_wal.walletHistory.unshift(transaction);
              await st_wal.save();

              const result = await StudentInformationSchema.findOneAndUpdate(
                { userId: st_id, "referralHistory.userId": userId },
                { $set: { "referralHistory.$.redeemed": true } },
                { new: true }
              );

              }catch(err){
                return res.status(400).json({ status: 0, error: "Internal Server Error" });
              }
              // let price = 1;
              
              try{
                var studentwallet = await StudentWalletSchema.findOne({
                  studentId: userId,
                });
                // console.log(st_wal);
                if (studentwallet) {
                  // let price = 1;
                  let price = referother;
                  studentwallet.availableAmount += parseFloat(price);
                  // if (st_wal.redeemableAmount >= 1) {
                  //   st_wal.redeemableAmount -= parseFloat(price);
                  // }
                  // studentwallet.referralAmount += parseFloat(price);
                  studentwallet.totalAmount =
                    parseFloat(studentwallet.availableAmount) +
                    parseFloat(studentwallet.redeemableAmount);
    
                  const transaction = {
                    transactionId: await generateTransactionId(),
                    date: new Date(),
                    type: "Referfriend",
                    amount: price,
                    description: `Referral Bonus`,
                    status: "Success",
                    balance: studentwallet.availableAmount,
                    referstudentId: st_id
                  };
                  let name;
                  let studentname = await StudentInformationSchema.findOne({
                    userId: studentwallet.studentId,
                  });
                  name = "student";
                  if (studentname) {
                    name = studentname.name;
                  }
    
                  const centraltransaction = {
                    category: "Student",
                    walletId: studentwallet._id,
                    transactionId: transaction.transactionId,
                    name: name,
                    date: transaction.date,
                    type: transaction.type,
                    amount: transaction.amount,
                    description: transaction.description,
                    status: transaction.status,
                    balance: transaction.balance,
                  };
    
                  const centaltransactiondetails =
                    await CentralTransactionsSchema.create({
                      category: "Student",
                      walletId: studentwallet._id,
                      transactionId: transaction.transactionId,
                      name: name,
                      date: transaction.date,
                      type: transaction.type,
                      amount: transaction.amount,
                      description: transaction.description,
                      status: transaction.status,
                      balance: transaction.balance,
                      referstudentId: transaction.referstudentId
                    });
                  if (!centaltransactiondetails) {
                    return res.status(400).json({
                      status: 0,
                      error: "central transaction not created!",
                    });
                  }
                  await centaltransactiondetails.save();
                  studentwallet.walletHistory.unshift(transaction);
                  await studentwallet.save();
  
                  return res
                  .status(200)
                  .json({ status: 1, message: "Referral Bonus Redeemed" });
              
  
                }else{
                  return res.status(400).json({ status: 0, error: "Student not found" });
                }
              }catch(err){
                return res.status(400).json({ status: 0, error: "Internal Server Error" });
              }
              
            } else {
              return res
                .status(400)
                .json({ status: 0, error: "Student Not Found" });
            }

            return res
              .status(200)
              .json({ status: 1, message: "Referral Bonus Redeemed" });
          }
        }

        // console.log(result);
        console.log("error - ", "here");
        return res.status(400).json({ status: 0, error: "Already Redeemed" });
        // const matchingReferral = await result.referralHistory.find(referral => referral.userId === userId);
        // // console.log(matchingReferral);
        // const position = result.referralHistory.indexOf(matchingReferral);
        // console.log('Matching referral position:', result.referralHistory[position]);
      } else {
        console.log("No matching student information found.");
      }
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },
  async updatedate(req, res, next) {
    try {
      const documentsWithoutCreatedAt = await StudentRegisterSchema.find({
        createdAt: { $exists: false },
      });

      // Update each document with the current timestamp
      for (const document of documentsWithoutCreatedAt) {
        document.createdAt = moment().toDate();
        document.updatedAt = moment().toDate();
        await document.save();

        console.log(document);
        // await StudentRegisterSchema.updateOne(
        //     { _id: document._id },
        //     {
        //         $set: {
        //             createdAt: moment().toDate(),
        //             updatedAt: moment().toDate()
        //         }
        //     }
        // );
      }

      return res
        .status(200)
        .json({ status: 1, message: "Updated Successfully" });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error: error });
    }
  },
  async coupon(req, res, next) {
    try {
      const { error } = StudentCouponValidatorSchema.validate(req.body);

      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }

      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }

      var st_id = rec_token._id;

      const { couponCode } = req.body;

      const student = await StudentRegisterSchema.find();
      
      if(student.length > 1000) {
        return res.status(400).json({ status: 0, error: "you can not access coupon code" });
      }

      const data = await StudentCouponSchema.findOne({
        couponCode: couponCode,
      });
      if (!data) {
        return res.status(400).json({ status: 0, error: "Coupon not found" });
      }
      
      const today = new Date(Date.now());
      // console.log(today.toLocaleDateString(),data.validityDate.toLocaleDateString());
      // console.log(data.validityDate.toLocaleDateString() >= today.toLocaleDateString());
      if (
        data.validityDate.toLocaleDateString() >= today.toLocaleDateString()
      ) {
        let document = {
          couponCode: data.couponCode,
          discount: data.discount,
        };
        return res.status(200).json({ status: 1, document });
      } else {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid coupon code" });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 0, error: "Internal Server Error" });
    }
  },

  async forgotpassword(req, res, next) {
    const { error } = StudentForgotPasswordValidatorSchema.validate(req.body);
    if (error) {
      return res.status(400).json({ status: 0, error: error.message });
    }

    const { email } = req.body;

    var student = await StudentRegisterSchema.findOne({ email: email });

    if (!student) {
      return res
        .status(400)
        .json({ status: 0, error: "Email is not Registered!" });
    }

    var password = generatePassword();
    const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
    const hashedPassword = await bcrypt.hash(password, salt);

    student.password = hashedPassword;

    await student.save();
    let studentname = "Student";
    console.log(student.password);
    // Send email to user
    const emailContent = forgotpasswordTemplate(studentname,password);

    const subject = "DoubtQ - Password Recovery";
    let emailsent = await emailSender(subject, emailContent, email);

    if (emailsent === "Email sent") {
      const message = "New Password Sent to Mail Successfully.";
      console.log(emailsent);
      // return res.status(200).json({ status: 1, message });
    } else {
      const error = "Mail Sending was Unsuccessful.";
      // return res.status(401).json({ status: 0, error });
    }

    // Use the emailContent string to send the email

    //   console.log(emailContent);

    // const mailOptions = {
    //   from: GOOGLE_MAIL,
    //   to: email,
    //   subject: "DoubtQ - Account New Password",
    //   html: emailContent,
    // };

    // transporter.sendMail(mailOptions, function (error, info) {
    //   if (error) {
    //     console.log(error);
    //     const message = "Mail Sending was Unsuccessful.";
    //     return res.status(401).json({ status: 0, error });
    //   } else {
    //     console.log("Email sent: " + info.response);

    //     const message = "New Password Sent to Mail Successfully.";
    //     return res.status(200).json({ status: 1, message });
    //   }
    // });
    const message = "New Password Sent to Mail Successfully.";
    return res.status(200).json({ status: 1, message })
  },

  async otp(req, res, next) {
    try {
      const { error } = StudentOTPValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }
      let { mobileNo } = req.body;

      const student = await StudentRegisterSchema.findOne({ mobileNo });
      if (student) {
        return res
          .status(400)
          .json({ status: 0, error: "mobileNo already exist" });
      }
      const otp = generateotp(6);

      const st_otp = await StudentOTPSchema.findOne({ mobileNo });
      console.log(st_otp);
      if (st_otp) {
        st_otp.otp = otp;

        await st_otp.save();

        // await fastsms(`Your OTP is ${otp}`, st_otp.mobileNo);
        return res
          .status(200)
          .json({
            status: 1,
            message: `OTP send successfully - ${st_otp.otp}`,
          });
      } else {
        let studentotp = await StudentOTPSchema.create({
          mobileNo,
          otp,
        });

        await studentotp.save();

        // await fastsms(`Your OTP is ${otp}`,studentotp.mobileNo);
        return res
          .status(200)
          .json({
            status: 1,
            message: `OTP send successfully - ${studentotp.otp}`,
          });
      }
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 0, error: "Internal Server Error" });
    }
  },

  async registerverify(req, res, next) {
    try {
      const student = await StudentRegisterSchema.findOne({
        _id: req.params.id,
      });
      console.log(student);
      if (!student) {
        return res.status(400).json({ status: 0, error: "Invalid link" });
      }
      const token = await TokenStudentSchema.findOne({
        token: req.params.token,
      });
      console.log(token);
      if (!token) {
        return res.status(400).json({ status: 0, error: "Invalid link" });
      }

      if (student.emailverified === 1) {
        return res
          .status(400)
          .json({ status: 0, error: "already verified link" });
      }

      student.emailverified = 1;
      await student.save();

      let studentname = "Student";

      const emailContent = registrartionTemplate(studentname);

      const subject = "DoubtQ - Registration!";

      let emailsent = await emailSender(subject, emailContent, student.email);

      console.log("emailsent", emailsent);
      if (emailsent === "Email sent") {
        // const message = "New Password Sent to Mail Successfully.";
        console.log(emailsent);
        // return res.status(200).json({ status: 1, message });
      } else {
        const error = "Mail Sending was Unsuccessful.";
        console.log(error);
        // return res.status(401).json({ status: 0, error });
      }
      return res.redirect("https://vaidik-backend.onrender.com/student-register");
      return res
        .status(200)
        .json({ status: 1, message: "email verified successfully" });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .json({ status: 0, error: "Internal Server Error" });
    }
  },

  async getmobileNo(req, res, next) {
    try {
      const document = await AdminMobileNoSchema.find({}, "mobileNo");

      if (!document) {
        return res.status(400).json({ status: 0, error: "No MobileNo Found!" });
      }
      return res.status(200).json({ status: 1, document });
    } catch (err) {
      return res
        .status(500)
        .json({ status: 0, error: "Internal Server Error " });
    }
  },

  async studentstats(req, res, next) {
    try {
      const { error } = refreshTokenValidatorSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ status: 0, error: error.message });
      }

      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      const currentDate = new Date();

      // Get the date 7 days ago
      const last7DaysDate = new Date();
      last7DaysDate.setDate(currentDate.getDate() - 7);

      // Get the date 30 days ago
      const last30DaysDate = new Date();
      last30DaysDate.setDate(currentDate.getDate() - 30);

      // Get the count of questions posted today
      const todayCount = await StudentQuestionsSchema.countDocuments({
        "allQuestions.dateOfPosted": {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lt: new Date().setHours(23, 59, 59, 999),
        },
      });

      // Get the count of questions posted in the last 7 days
      const last7DaysCount = await StudentQuestionsSchema.countDocuments({
        "allQuestions.dateOfPosted": {
          $gte: last7DaysDate.setHours(0, 0, 0, 0),
          $lt: currentDate.setHours(23, 59, 59, 999),
        },
      });

      // Get the count of questions posted in the last 30 days
      const last30DaysCount = await StudentQuestionsSchema.countDocuments({
        "allQuestions.dateOfPosted": {
          $gte: last30DaysDate.setHours(0, 0, 0, 0),
          $lt: currentDate.setHours(23, 59, 59, 999),
        },
      });

      // Send the counts as a JSON response
      res.json({
        todayCount,
        last7DaysCount,
        last30DaysCount,
      });
    } catch (error) {
      console.log("error - ", error);
      return res
        .status(400)
        .json({ status: 0, error: "Internal Server Error!" });
    }
  },

  async studentsearchquestion(req, res, next) {
    try {
      const { limit = 10, skip = 0, search } = req.query;

      // Build the search query
      const searchQuery = search
        ? {
            $and: [
              { question: { $regex: search, $options: "i" } },
              { status: "Answered" },
            ],
          }
        : { status: "Answered" };

      const questions = await MainQuestionsSchema.find(
        searchQuery,
        "_id question questionPhoto questionSubject questionType"
      )
        .limit(parseInt(limit))
        .skip(parseInt(skip))
        .sort({ createdAt: -1 });

      if (!questions || questions.length === 0) {
        return res
          .status(400)
          .json({ status: 0, error: "No questions found!" });
      }

      for (let i = 0; i < questions.length; i++) {
        const images = await ImageSchema.find({
          _id: { $in: questions[i].questionPhoto },
        });

        const imageUrls = images.map((image) => {
          return `data:${image.contentType};base64,${image.data.toString(
            "base64"
          )}`;
        });

        questions[i].questionPhoto = imageUrls;
      }

      return res.status(200).json({ status: 1, data: questions });
    } catch (error) {
      console.log("error - ", error);
      return res
        .status(400)
        .json({ status: 0, error: "Internal Server Error!" });
    }
  },

  async studentgetanswer(req, res, next) {
    try {
      const { id } = req.query;
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      // console.log(st_id);

      var wal = await StudentWalletSchema.findOne({ studentId: st_id });
      // console.log(wal);
      if (!wal) {
        return res
          .status(400)
          .json({ status: 0, error: "No Subscription Plan Found!" });
      }

      if (wal.isSubscribed === false) {
        return res
          .status(400)
          .json({ status: 0, error: "No Subscription Plan Found!" });
      }

      var queid = new ObjectId(id);

      var mainque = await MainQuestionsSchema.findById(
        queid,
        "question questionPhoto questionSubject questionType answer explanation"
      );

      if (!mainque) {
        return res.status(400).json({ status: 0, error: "No Question Found!" });
      }

      return res.status(200).json({ status: 1, data: mainque });


      } catch (error) {
        console.log("error - ", error);
      return res.status(400).json({ status: 0, error: "Internal Server Error!" });
      }
  },

  async stripepayment(req, res, next) {
    try {
      
      const { error } =  StudentStripePaymentValidatorSchema.validate(req.body);

      if(error){
        return res.status(400).json({ status: 0, error: error.message });
      }
      
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      const { price, stripeId } = req.body;

      var wal = await StudentWalletSchema.findOne({studentId: st_id});

      if(!wal) {
        return res.status(400).json({ status: 0, error: "Student wallet not found" });
      }

      const payment = await stripeInstance.paymentIntents.create({
        amount: price,
        currency: "USD",
        description: `${price}$ Deposit`,
        payment_method_data: {
          type: "card",
          card: {
              token: stripeId
          }
      },
        confirm: true,
      });

      if(payment) {
        
      if (wal) {
        // let price = 1;
        wal.availableAmount += parseFloat(price);
        wal.depositAmount += parseFloat(price);
        wal.totalAmount =
          parseFloat(wal.availableAmount) + parseFloat(wal.redeemableAmount);

        const transaction = {
          transactionId: await generateTransactionId(),
          date: new Date(),
          type: "Deposit",
          amount: price,
          description: `${price}$ Deposit`,
          status: "Success",
          balance: wal.availableAmount,
        };
        let name;
        // let studentname = await StudentInformationSchema.findOne({ userId: wal.studentId });
        name = "student";
        // if(studentname){
        //      name = studentname.name;
        // }

        const centaltransactiondetails = await CentralTransactionsSchema.create(
          {
            category: "Student",
            walletId: wal._id,
            transactionId: transaction.transactionId,
            name: name,
            date: transaction.date,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            status: transaction.status,
            balance: transaction.balance,
          }
        );
        if (!centaltransactiondetails) {
          return res
            .status(400)
            .json({ status: 0, error: "central transaction not created!" });
        }
        await centaltransactiondetails.save();
        wal.walletHistory.unshift(transaction);
        await wal.save();

        const student = await StudentRegisterSchema.findOne({_id: st_id});
        if(!student){
          return res.status(400).json({ status: 0, error: "student not found" });
        }

        const emailContent = studentdepositeTemplate(transaction.transactionId,transaction.amount);

        const subject = "DoubtQ - Deposit Successful"
        let emailsent = await emailSender(subject, emailContent, student.email);

        if (emailsent === "Email sent") {
            // const message = "New Password Sent to Mail Successfully.";
            console.log(emailsent);
            // return res.status(200).json({ status: 1, message });
        } else {
            const error = "Mail Sending was Unsuccessful.";
            console.log(error);
            // return res.status(401).json({ status: 0, error });
        }

        return res
          .status(200)
          .json({ status: 1, message: "Amount Deposited Successfully." });
      } else {
        console.log("error - ", error);
        return res
          .status(400)
          .json({ status: 0, error: "No Student Wallet Found!" });
      }
    }
    } catch (error) {
      console.log("error - ", error);
      return res
        .status(400)
        .json({ status: 0, error: "Internal Server Error!" });
    }
  },

  async ccavenuepayment(req, res, next) {
    try {
      let rec_token = await TokenStudent.fetchByToken({
        token: req.body.token,
      });
      if (rec_token === null || !rec_token.token) {
        return res
          .status(400)
          .json({ status: 0, error: "Invalid refresh token!" });
      }
      const st_id = rec_token._id;

      var wal = await StudentWallet.findById(st_id);

      if (wal) {
        let price = 1;
        wal.availableAmount += parseFloat(price);
        wal.depositAmount += parseFloat(price);
        wal.totalAmount =
          parseFloat(wal.availableAmount) + parseFloat(wal.redeemableAmount);

        const transaction = {
          transactionId: await generateTransactionId(),
          date: new Date(),
          type: "Deposit",
          amount: price,
          description: `${price}$ Deposit`,
          status: "Success",
          balance: wal.availableAmount,
        };
        let name;
        // let studentname = await StudentInformationSchema.findOne({ userId: wal.studentId });
        name = "student";
        // if(studentname){
        //      name = studentname.name;
        // }

        const centaltransactiondetails = await CentralTransactionsSchema.create(
          {
            category: "Student",
            walletId: wal._id,
            transactionId: transaction.transactionId,
            name: name,
            date: transaction.date,
            type: transaction.type,
            amount: transaction.amount,
            description: transaction.description,
            status: transaction.status,
            balance: transaction.balance,
          }
        );
        if (!centaltransactiondetails) {
          return res
            .status(400)
            .json({ status: 0, error: "central transaction not created!" });
        }
        await centaltransactiondetails.save();
        wal.walletHistory.unshift(transaction);
        await wal.save();

        return res
          .status(200)
          .json({ status: 1, message: "Amount Deposited Successfully." });
      } else {
        console.log("error - ", error);
        return res
          .status(400)
          .json({ status: 0, error: "No Student Wallet Found!" });
      }
    } catch (error) {
      console.log("error - ", error);
      return res
        .status(400)
        .json({ status: 0, error: "Internal Server Error!" });
    }
  },

  async studentsubscription(req,res,next){
    try{
      const { error } = StudentSubscriptionValidatorSchema.validate(req.body);
      if (error) {
          return res.status(400).json({ status: 0, "error": error.message });
      }
      // console.log({ token: req.body.token });
      let rec_token = await TokenStudent.fetchByToken({ token: req.body.token });
      if (rec_token === null || !rec_token.token) {
          return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
      }
      const st_id = rec_token._id;
      const { subscription, price } = req.body;

      const document = await SubscriptionSchema.findOne({ duration: subscription });

      console.log(document.price);
      if(!document){
        return res.status(400).json({ status: 0, error: "subscription not found" });
      }
      document.price = await SubscriptionPriceInUsd(subscription);

      console.log(document.price === price)

      if(!document.price === price){
        return res.status(400).json({ status: 0, error: "subscription price not found" });
      }

      const studentId = new ObjectId(st_id); // replace with actual student ID
      let startingDate = new Date(); // replace with actual starting date
      let endingDate = new Date(); // replace with actual ending date

      switch (subscription) {
        case 'Weekly':
          startingDate = new Date();
          endingDate = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000); // add 7 days
          break;
        case 'Monthly':
          startingDate = new Date();
          endingDate = new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000); // add 30 days
          break;
        case '3Months':
          startingDate = new Date();
          endingDate = new Date(new Date().getTime() + 90 * 24 * 60 * 60 * 1000); // add 90 days
          break;
        case '6Months':
          startingDate = new Date();
          endingDate = new Date(new Date().getTime() + 180 * 24 * 60 * 60 * 1000); // add 180 days
          break;
        case '1Year':
          startingDate = new Date();
          endingDate = new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000); // add 365 days
          break;
        default:
          startingDate = null;
          endingDate = null;
      }

      const subscriptionplan = await StudentWalletSchema.findOne({studentId: studentId});

      if(subscriptionplan.isSubscribed === true){
        return res.status(400).json({ status: 0, error: "subscription plan already activated" });
      }

      const payment = await stripeInstance.paymentIntents.create({
        amount: amount,
        currency: "USD",
        description: "",
        payment_method: id,
        confirm: true,
      });

      console.log(payment);

      if(payment){

      await StudentWalletSchema.findOneAndUpdate(
        { studentId, studentId },
        { $set: { "isSubscribed": true,
                "planType": subscription,
                "planStartingDate": startingDate,
                "planEndingDate": endingDate,
                "planPrice": price
        } }
      )
        .then(async result => {
          if (result) {

            const stu_infor = await StudentInformationSchema.findOne({userId: studentId});
            

            const emailContent = studentsubscriptionTemplate(stu_infor.name);

            const subject = "DoubtQ - Thanks for Subscribe";

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

            // console.log(`TutorWallet document updated for questionId ${questionId}`);
            return res.status(200).json({ status: 1, message: "subscription successfully" });
            // console.log(result);
          } else {
            // console.log(`No TutorWallet document found for questionId ${questionId}`);
            return res.status(400).json({ status: 0, error: "student wallet not found" });
          }
        })
        .catch((err) => {
            console.error(err)
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        });

        // await StudentWalletSchema.findOneAndUpdate(
        //   { studentId: studentId },
        //   { $set: {
        //       isSubscribed: true,
        //       planType: subscription,
        //       planStartingDate: startingDate,
        //       planEndingDate: endingDate,
        //       planPrice: price
        //     }
        //   },
        //   (err,result) => {
        //     if (err) {
        //       console.error(err);
        //       return res.status(400).json({ status: 0, error: "student wallet not found" });
        //     } else {
        //       return res.status(200).json({ status: 1, message: "subscription successfully" });
        //     }
        //   }
        // );
      }
    }catch(err){
      console.log(err);
      return res.status(500).json({ status: 0, error: "Internal Server Error" });
    }
  },

  async getsubscriptionprice(req, res, next) {
    try {
      var sub_pri = await SubscriptionSchema.find();
      var pr;
      var data = [];
      for (var i = 0; i < sub_pri.length; i++) {
        var pr = await SubscriptionPriceInUsd(sub_pri[i].duration);
        var obj = { type: sub_pri[i].duration, price: pr, isactive: sub_pri[i].isactive };
        data.push(obj);
      }
      return res.status(200).json({ status: 1, data });
    } catch (error) {
      console.log("error - ", error);
      return res.status(400).json({ status: 0, error });
    }
  },

  async getpoststreakprice(req,res,next){
    try{
      const pri = await StudentPostingStreakSchema.findOne();
      if(!pri){
        return res.status(400).json({ status: 0, error: "student poststreak data not found" });
      }

      var currency = await CurrencyConversionSchema.findOne();

        // var pri = await StudentPostingStreakSchema.findOne();

      var ini = parseFloat(pri.initial) / parseFloat(currency.ConversionToInr);
      ini = parseFloat(ini.toFixed(2));
      var incr = parseFloat(pri.extrasum) / parseFloat(currency.ConversionToInr);
      incr = parseFloat(incr.toFixed(2));
      
      let poststreak = [];
        
      var question50 = ini;
      var question100 = question50 + incr;
      var question150 = question100 + incr;
      var question200 = question150 + incr;

      poststreak = [{
        "question50": question50,
        "question100": question100,
        "question150": question150,
        "question200": question200
      }]

      return res.status(200).json({ status: 1, poststreak});

    }catch(err){
      console.log(err);
      return res.status(500).json({ status: 0, error: "Internal Server Error" });
    }
  },

  async getthought(req,res,next){
    try{
        const document = await AdminThoughtSchema.find({},"thought");

        if(!document) {
            return res.status(400).json({ status: 0, error: "Thought not found" });
        }
        return res.status(200).json({ status: 1, document });

    }catch(err){
        return res.status(500).json({ status: 0, error: "Internal Server Error" });
    }
}

};
function generatePassword() {
  const length = 8;
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * chars.length);
    password += chars[randomIndex];
  }
  return password;
}
async function verifyPhoneOtp(otp, mobileNo) {
  // const { otp, mobileNo } = req.body;
  // const user = StudentRegisterSchema.findOne({ mobileNo });
  // let message;
  // if(!user) {
  //     return message = "student not found";
  // }
  const studentotp = await StudentOTPSchema.findOne({ mobileNo });
  if (!studentotp) {
    return "mobileNo not found";
  }
  if (studentotp.otp !== otp) {
    return "incorrect otp";
  }
  return "OTP verified successfully";
}
function generateotp(otp_length) {
  // Declare a digits variable
  // which stores all digits
  var digits = "0123456789";
  let OTP = "";
  for (let i = 0; i < otp_length; i++) {
    OTP += digits[Math.floor(Math.random() * 10)];
  }
  return OTP;
}
async function fastsms(message, contactNo) {
  try {
    console.log("fasttosms");
    const res = await client1.messages.create({
      body: message,
      from: "+12543222399",
      to: contactNo,
    });
    // const res = await fast2sms.sendMessage({
    //     authorization: FAST2SMS,
    //     message,
    //     numbers: ["9773079135"],
    // });
    console.log("res", res);
  } catch (err) {
    console.log(err);
    // return res.status(500).json({ status: 0, error: "Internal Server Error"});
  }
}
// fastsms();
export default studentController;

import express from "express";
import multer from 'multer';
import { findTutorAndAssignQuestion } from "../controller/findTutorAndAssignQuestion.js";
import { TokenStudent, MainQuestions, TokenTutor } from "../model/index.js";
import { MainQuestionsSchema, StudentQuestionsSchema, ImageSchema, TutorSubjectsSchema, TutorTimingSchema, TutorRegisterSchema, TutorQuestionsSchema, QuestionTimingSchema, QuestionPricingSchema, StudentWalletSchema, CentralTransactionsSchema, StudentInformationSchema } from "../schema/index.js";
import { QuestionChangeStatusValidatorSchema, QuestionPostValidatorSchema, QuestionChangeStatusWithReasonsValidatorSchema, UpdateQuestionValidatorSchema, refreshTokenValidatorSchema, UnsolvedSkipValidatorSchema, IssueQuestionPostValidatorSchema } from "../validators/index.js";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import questiontiming from "../schema/questiontiming.js";
import { ObjectId } from 'mongodb';
import { QuestionPriceInUsd } from "../controller/QuestionPriceInUsd.js";
import generateTransactionId from '../controller/generateTransactionId.js';
import postQuestion from "../emailtemplates/postquestion.js";
import { GOOGLE_MAIL, GOOGLE_PASSWORD } from "../config/index.js";
import nodemailer from "nodemailer"
import emailSender from "../controller/emailsender.js";
// import { QuestionPriceInUsd } from "../controller/QuestionPriceInUsd.js";


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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirectory = path.join(__dirname, '..', 'upload');
        console.log(uploadDirectory);

        // Create the upload directory if it doesn't exist
        fs.mkdir(uploadDirectory, { recursive: true }, function (err) {
            if (err) return cb(err);
            cb(null, uploadDirectory);
        });
    },
    filename: function (req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 // 1000000 Bytes = 1 MB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(png|jpg|jpeg|tif|tiff|bmp|gif|ico)$/)) {
            // upload only png and jpg format
            return cb(new Error('Please upload a Image'))
        }
        cb(undefined, true)
    }
});

router.post("/ask", upload.array('questionPhoto', 5), async (req, res) => {
    try {
        const { error } = QuestionPostValidatorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 0, "error": error.message });
        }
        // console.log({ token: req.body.token });
        let rec_token = await TokenStudent.fetchByToken({ token: req.body.token });
        if (rec_token === null || !rec_token.token) {
            return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
        }

        // console.log(req);


        var st_id = rec_token._id;

        var que_pricing = await QuestionPricingSchema.findOne({ Type: req.body.questionType });

        if (!que_pricing) {
            return res.status(400).json({ status: 0, error: 'Please enter correct QuestionPrice!' });
        }

        var price = await QuestionPriceInUsd(req.body.questionType);

        var typename = questionTypeName(req.body.questionType);

        var st_wal = await StudentWalletSchema.findOne({ studentId: st_id });
        // console.log("student wallet - ", st_wal);

        var limit = 0.25;
        var compare = parseFloat(limit) + parseFloat(price);

        // console.log("wallet balance - ", st_wal.availableAmount);
        // console.log("compare - ", compare);

        console.log(st_wal.availableAmount < compare);

        if (st_wal.availableAmount < compare) {
            req.files.map(file => {

                // Delete the file from the local disk after it has been saved to the database
                fs.unlinkSync(file.path);

            });
            return res.status(400).json({ status: 0, error: 'Your Balance is not Suffecient!' });
        } else {
            st_wal.availableAmount -= parseFloat(price);
            st_wal.paidAmount += parseFloat(price);
            st_wal.availableAmount = Number.parseFloat(st_wal.availableAmount).toFixed(2);
            // console.log("available - ", st_wal.availableAmount);
            st_wal.totalAmount = parseFloat(st_wal.availableAmount) + parseFloat(st_wal.redeemableAmount);
            st_wal.totalAmount = Number.parseFloat(st_wal.totalAmount).toFixed(2);
            // console.log("total - ", st_wal.totalAmount);
            const transaction = {
                transactionId: await generateTransactionId(),
                date: new Date(),
                type: "Question posted",
                amount: parseFloat(price),
                description: `Payment for ${typename} question`,
                status: "Success",
                balance: st_wal.availableAmount
            };
            let name;
            let studentname = await StudentInformationSchema.findOne({ userId: st_wal.studentId });
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
                balance: transaction.balance
            }

            const centaltransactiondetails = await CentralTransactionsSchema.create({
                category: "Student",
                walletId: st_wal._id,
                transactionId: transaction.transactionId,
                name: name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                status: transaction.status,
                balance: transaction.balance
            })
            if (!centaltransactiondetails) {
                return res.status(400).json({ status: 0, error: "central transaction not created!" });
            }
            await centaltransactiondetails.save();
            st_wal.walletHistory.unshift(transaction);
            await st_wal.save();



        }
        var imageIds;
        if (req.files) {



            // Save the uploaded images to the Image schema
            const imagePromises = req.files.map(async file => {
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
            imageIds = images.map(image => image._id);
            // console.log(imageIds);

        }

        const { question, questionType, questionSubject } = req.body;
        // console.log(req.file.filename);






        const now = new Date();
        // const oneDay = 24 * 60 * 60 * 1000;
        // const twoDays = 2 * oneDay;
        // const threeDays = 3 * oneDay;
        var mainque;
        if (req.files) {
            mainque = await MainQuestions.create({
                question,
                // questionPhoto: req.files.map(file => file.filename),
                questionPhoto: imageIds,
                questionType,
                questionSubject,
                status: "PENDING",
                studentId: st_id,
                questionPrice: price,
                tutorPrice: que_pricing.tutor_price,
                adminPrice: que_pricing.admin_price,
                createdAt: now,
                // onedayafter_tutor_end: new Date(now.getTime() + oneDay),
                // twodayafter_admin_end: new Date(now.getTime() + twoDays),
                // threedayafter_unsolved_end: new Date(now.getTime() + threeDays),
                whomto_ask: "tutor"
            })
        } else {
            mainque = await MainQuestions.create({
                question,
                // questionPhoto: req.files.map(file => file.filename),
                // questionPhoto: imageIds,
                questionType,
                questionSubject,
                status: "PENDING",
                studentId: st_id,
                questionPrice: price,
                tutorPrice: que_pricing.tutor_price,
                adminPrice: que_pricing.admin_price,
                createdAt: now,
                // onedayafter_tutor_end: new Date(now.getTime() + oneDay),
                // twodayafter_admin_end: new Date(now.getTime() + twoDays),
                // threedayafter_unsolved_end: new Date(now.getTime() + threeDays),
                whomto_ask: "tutor"
            })
        }




        // console.log(mainque);

        const questionId = mainque._id;

        var stu_que = await StudentQuestionsSchema.findOne({ studentId: st_id });

        if (!stu_que) {

        } else {
            var data;
            data = {
                questionId: questionId,
                question: question,
                questionPhoto: imageIds,
                questionType: questionType,
                questionSubject: questionSubject,
                questionPrice: price,
                dateOfPosted: new Date(),
                status: 'PENDING'
            };

            stu_que.allQuestions.unshift(data);
            stu_que.postquestions++;

            await stu_que.save();
        }

        // StudentQuestionsSchema.findOneAndUpdate({ studentId: st_id }, {
        //     $push: {
        //         allQuestions: {
        //             $each: [{
        //                 questionId: questionId,
        //                 question,
        //                 questionPhoto: imageIds,
        //                 questionType,
        //                 questionSubject,
        //                 questionPrice: price,
        //                 dateOfPosted: new Date(),
        //                 status: 'PENDING'
        //             }],
        //             $position: 0
        //         }
        //     }
        // },
        //     { new: true }, (error, result) => {
        //         if (error) {
        //             console.log("dsds");
        //             console.error(error);
        //             return;
        //         } else {
        //             console.log('Array of questions pushed:', result);
        //         }
        //     });

        // sent to tutor

        var new_status = await findTutorAndAssignQuestion(mainque);

        if (new_status) {
            let studentname = await StudentInformationSchema.findOne({ userId: st_wal.studentId });
            if (!studentname) {
                return res.status(400).json({ status: 0, error: "student name not found" });
            }

            const questiontitle = question.slice(0, 60);
            const emailContent = postQuestion(studentname.name, questiontitle);

            const subject = "DoubtQ - Your Question Posted Successfully!"

            let emailsent = await emailSender(subject, emailContent, studentname.email);

            console.log("emailsent", emailsent)
            if (emailsent === "Email sent") {
                const message = "New Password Sent to Mail Successfully.";
                console.log(message);
                // return res.status(200).json({ status: 1, message });
            } else {
                const error = "Mail Sending was Unsuccessful.";
                console.log(error);
                // return res.status(401).json({ status: 0, error });
            }

            // const mailOptions = {
            //     from: GOOGLE_MAIL,
            //     to: studentname.email,
            //     subject: "DoubtQ - Question posted successfully",
            //     html: emailContent,
            //   };

            //   transporter.sendMail(mailOptions, function (error, info) {
            //     if (error) {
            //       console.log(error);
            //       const message = "Mail Sending was Unsuccessful.";
            //       return res.status(401).json({ status: 0, message });
            //     } else {
            //       console.log("Email sent: " + info.response);

            //       const message = "Question posted successfully.";
            //       return res.status(200).json({ status: 1, message });
            //     }
            //   });
            return res.status(200).json({ status: 1, message: 'Question posted successfully' });
        } else {
            return res.status(400).json({ status: 0, error: 'Question posting was unsuccessful!' });
        }


        // end of sent to tutor

    } catch (error) {
        console.log("dfsd");
        console.log(error);
        return;
        // return next(error);
    }
});

router.post("/unsolvedask", upload.array('questionPhoto', 5), async (req, res) => {
    try {
        const { error } = QuestionPostValidatorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 0, "error": error.message });
        }
        // console.log({ token: req.body.token });
        let rec_token = await TokenStudent.fetchByToken({ token: req.body.token });
        if (rec_token === null || !rec_token.token) {
            return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
        }

        // console.log(req);

        var st_id = rec_token._id;

        var que_pricing = await QuestionPricingSchema.findOne({ Type: req.body.questionType });

        if (!que_pricing) {
            return res.status(400).json({ status: 0, error: 'Please enter correct Questiontype!' });
        }

        var price = await QuestionPriceInUsd(req.body.questionType);

        var typename = questionTypeName(req.body.questionType);

        var st_wal = await StudentWalletSchema.findOne({ studentId: st_id });
        // console.log("student wallet - ", st_wal);

        var limit = 0.25;
        var compare = parseFloat(limit) + parseFloat(price);

        console.log("wallet balance - ", st_wal.availableAmount);
        // console.log("compare - ", compare);

        console.log(st_wal.availableAmount < compare);

        if (st_wal.availableAmount < compare) {
            req.files.map(file => {

                // Delete the file from the local disk after it has been saved to the database
                fs.unlinkSync(file.path);

            });
            return res.status(400).json({ status: 0, error: 'Your Balance is not Suffecient!' });
        } else {
            st_wal.availableAmount -= parseFloat(price);
            st_wal.paidAmount += parseFloat(price);
            st_wal.availableAmount = Number.parseFloat(st_wal.availableAmount).toFixed(2);
            console.log("available - ", st_wal.availableAmount);
            st_wal.totalAmount = parseFloat(st_wal.availableAmount) + parseFloat(st_wal.redeemableAmount);
            st_wal.totalAmount = Number.parseFloat(st_wal.totalAmount).toFixed(2);
            console.log("total - ", st_wal.totalAmount);
            const transaction = {
                transactionId: await generateTransactionId(),
                date: new Date(),
                type: "Question posted",
                amount: parseFloat(price),
                description: `Payment for ${typename} question`,
                status: "Success",
                balance: st_wal.availableAmount
            };
            let name;
            let studentname = await StudentInformationSchema.findOne({ userId: st_wal.studentId });
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
                balance: transaction.balance
            }

            const centaltransactiondetails = await CentralTransactionsSchema.create({
                category: "Student",
                walletId: st_wal._id,
                transactionId: transaction.transactionId,
                name: name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                status: transaction.status,
                balance: transaction.balance
            })
            if (!centaltransactiondetails) {
                return res.status(400).json({ status: 0, error: "central transaction not created!" });
            }
            await centaltransactiondetails.save();
            st_wal.walletHistory.unshift(transaction);
            await st_wal.save();



        }
        var imageIds;
        if (req.files) {



            // Save the uploaded images to the Image schema
            const imagePromises = req.files.map(async file => {
                const img = new ImageSchema();
                img.name = file.filename;
                img.data = fs.readFileSync(file.path);
                img.contentType = file.mimetype;
                var nn = await img.save();
                if (nn) {
                    // console.log("nn = ", nn);
                    fs.unlinkSync(file.path);
                }

                return nn;
                // return img.save().then(() => {
                //     // Delete the file from the local disk after it has been saved to the database
                //     fs.unlinkSync(file.path);
                //   });
            });

            const images = await Promise.all(imagePromises);
            imageIds = images.map(image => image._id);
            // console.log(imageIds);

        }

        const { question, questionType, questionSubject } = req.body;
        // console.log(req.file.filename);






        const now = new Date();
        // const oneDay = 24 * 60 * 60 * 1000;
        // const twoDays = 2 * oneDay;
        // const threeDays = 3 * oneDay;
        var mainque;
        if (req.files) {
            mainque = await MainQuestions.create({
                question,
                // questionPhoto: req.files.map(file => file.filename),
                questionPhoto: imageIds,
                questionType,
                questionSubject,
                status: "unsolved",
                studentId: st_id,
                questionPrice: price,
                tutorPrice: que_pricing.tutor_price,
                adminPrice: que_pricing.admin_price,
                createdAt: now,
                // onedayafter_tutor_end: new Date(now.getTime() + oneDay),
                // twodayafter_admin_end: new Date(now.getTime() + twoDays),
                // threedayafter_unsolved_end: new Date(now.getTime() + threeDays),
                whomto_ask: "tutor",
                internalStatus: ""
            })
        } else {
            mainque = await MainQuestions.create({
                question,
                // questionPhoto: req.files.map(file => file.filename),
                // questionPhoto: imageIds,
                questionType,
                questionSubject,
                status: "unsolved",
                studentId: st_id,
                questionPrice: price,
                tutorPrice: que_pricing.tutor_price,
                adminPrice: que_pricing.admin_price,
                createdAt: now,
                // onedayafter_tutor_end: new Date(now.getTime() + oneDay),
                // twodayafter_admin_end: new Date(now.getTime() + twoDays),
                // threedayafter_unsolved_end: new Date(now.getTime() + threeDays),
                whomto_ask: "tutor",
                internalStatus: ""
            })
        }




        // console.log(mainque);

        const questionId = mainque._id;

        var stu_que = await StudentQuestionsSchema.findOne({ studentId: st_id });

        if (!stu_que) {

        } else {
            var data;
            data = {
                questionId: questionId,
                question: question,
                questionPhoto: imageIds,
                questionType: questionType,
                questionSubject: questionSubject,
                questionPrice: price,
                dateOfPosted: new Date(),
                status: 'PENDING'
            };

            stu_que.allQuestions.unshift(data);

            await stu_que.save();
        }

        return res.status(200).json({ status: 1, message: 'Question posted successfully' });
        // end of sent to tutor

    } catch (error) {
        // console.log("dfsd");
        console.log(error);
        return res.status(400).json({ status: 0, error: 'Question posting was unsuccessful!' });
        // return next(error);
    }
});

router.post("/issueask", upload.array('questionPhoto', 5), async (req, res) => {
    try {
        const { error } = IssueQuestionPostValidatorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 0, "error": error.message });
        }
        // console.log({ token: req.body.token });
        let rec_token = await TokenStudent.fetchByToken({ token: req.body.token });
        if (rec_token === null || !rec_token.token) {
            return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
        }

        // console.log(req);


        var st_id = rec_token._id;

        var que_pricing = await QuestionPricingSchema.findOne({ Type: req.body.questionType });

        if (!que_pricing) {
            return res.status(400).json({ status: 0, error: 'Please enter correct Questiontype!' });
        }

        var price = await QuestionPriceInUsd(req.body.questionType);

        var typename = questionTypeName(req.body.questionType);

        var st_wal = await StudentWalletSchema.findOne({ studentId: st_id });
        // console.log("student wallet - ", st_wal);

        var limit = 0.25;
        var compare = parseFloat(limit) + parseFloat(price);

        // console.log("wallet balance - ", st_wal.availableAmount);
        // console.log("compare - ", compare);

        console.log(st_wal.availableAmount < compare);

        if (st_wal.availableAmount < compare) {
            req.files.map(file => {

                // Delete the file from the local disk after it has been saved to the database
                fs.unlinkSync(file.path);

            });
            return res.status(400).json({ status: 0, error: 'Your Balance is not Suffecient!' });
        } else {
            st_wal.availableAmount -= parseFloat(price);
            st_wal.paidAmount += parseFloat(price);
            st_wal.availableAmount = Number.parseFloat(st_wal.availableAmount).toFixed(2);
            // console.log("available - ", st_wal.availableAmount);
            st_wal.totalAmount = parseFloat(st_wal.availableAmount) + parseFloat(st_wal.redeemableAmount);
            st_wal.totalAmount = Number.parseFloat(st_wal.totalAmount).toFixed(2);
            // console.log("total - ", st_wal.totalAmount);
            const transaction = {
                transactionId: await generateTransactionId(),
                date: new Date(),
                type: "Question posted",
                amount: parseFloat(price),
                description: `Payment for ${typename} question`,
                status: "Success",
                balance: st_wal.availableAmount
            };
            let name;
            let studentname = await StudentInformationSchema.findOne({ userId: st_wal.studentId });
            name = "student";
            if (studentname) {
                name = studentname.name;
            }
            console.log(transaction);

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
                balance: transaction.balance
            }
            console.log(centraltransaction);

            const centaltransactiondetails = await CentralTransactionsSchema.create({
                category: "Student",
                walletId: st_wal._id,
                transactionId: transaction.transactionId,
                name: name,
                date: transaction.date,
                type: transaction.type,
                amount: transaction.amount,
                description: transaction.description,
                status: transaction.status,
                balance: transaction.balance
            })
            if (!centaltransactiondetails) {
                return res.status(400).json({ status: 0, error: "central transaction not created!" });
            }
            await centaltransactiondetails.save();

            st_wal.walletHistory.unshift(transaction);
            await st_wal.save();



        }
        var imageIds;
        if (req.files) {



            // Save the uploaded images to the Image schema
            const imagePromises = req.files.map(async file => {
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
            imageIds = images.map(image => image._id);
            // console.log(imageIds);

        }

        const { question, questionType, questionSubject } = req.body;
        // console.log(req.file.filename);






        const now = new Date();
        // const oneDay = 24 * 60 * 60 * 1000;
        // const twoDays = 2 * oneDay;
        // const threeDays = 3 * oneDay;
        var mainque;
        if (req.files) {
            mainque = await MainQuestions.create({
                question,
                // questionPhoto: req.files.map(file => file.filename),
                questionPhoto: imageIds,
                questionType,
                questionSubject,
                status: "Issue",
                studentId: st_id,
                questionPrice: price,
                tutorPrice: que_pricing.tutor_price,
                adminPrice: que_pricing.admin_price,
                createdAt: now,
                // onedayafter_tutor_end: new Date(now.getTime() + oneDay),
                // twodayafter_admin_end: new Date(now.getTime() + twoDays),
                // threedayafter_unsolved_end: new Date(now.getTime() + threeDays),
                whomto_ask: "tutor",
                newReason: parseInt(req.body.newReason),
                newReasonText: req.body.newReasonText,
                isNewReasonExecuted: 1
            })
        } else {
            mainque = await MainQuestions.create({
                question,
                // questionPhoto: req.files.map(file => file.filename),
                // questionPhoto: imageIds,
                questionType,
                questionSubject,
                status: "Issue",
                studentId: st_id,
                questionPrice: price,
                tutorPrice: que_pricing.tutor_price,
                adminPrice: que_pricing.admin_price,
                createdAt: now,
                // onedayafter_tutor_end: new Date(now.getTime() + oneDay),
                // twodayafter_admin_end: new Date(now.getTime() + twoDays),
                // threedayafter_unsolved_end: new Date(now.getTime() + threeDays),
                whomto_ask: "tutor",
                newReason: parseInt(req.body.newReason),
                newReasonText: req.body.newReasonText,
                isNewReasonExecuted: 1
            })
        }




        // console.log(mainque);

        const questionId = mainque._id;

        var stu_que = await StudentQuestionsSchema.findOne({ studentId: st_id });

        if (!stu_que) {

        } else {
            var data;
            data = {
                questionId: questionId,
                question: question,
                questionPhoto: imageIds,
                questionType: questionType,
                questionSubject: questionSubject,
                questionPrice: price,
                dateOfPosted: new Date(),
                status: 'Issue'
            };

            stu_que.allQuestions.unshift(data);
            stu_que.postquestions++;

            await stu_que.save();
        }

        // StudentQuestionsSchema.findOneAndUpdate({ studentId: st_id }, {
        //     $push: {
        //         allQuestions: {
        //             $each: [{
        //                 questionId: questionId,
        //                 question,
        //                 questionPhoto: imageIds,
        //                 questionType,
        //                 questionSubject,
        //                 questionPrice: price,
        //                 dateOfPosted: new Date(),
        //                 status: 'PENDING'
        //             }],
        //             $position: 0
        //         }
        //     }
        // },
        //     { new: true }, (error, result) => {
        //         if (error) {
        //             console.log("dsds");
        //             console.error(error);
        //             return;
        //         } else {
        //             console.log('Array of questions pushed:', result);
        //         }
        //     });

        // sent to tutor

        // var new_status = await findTutorAndAssignQuestion(mainque);

        return res.status(200).json({ status: 1, question: mainque, message: 'Question posted successfully' });

        // if (new_status) {
        //     return res.status(200).json({ status: 1, message: 'Question posted successfully' });
        // } else {
        //     return res.status(400).json({ status: 0, message: 'Question posting was unsuccessful!' });
        // }


        // end of sent to tutor

    } catch (error) {
        console.log("dfsd");
        console.log(error);
        return;
        // return next(error);
    }
});

router.post("/view/:id", async (req, res) => {
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
            return res.status(400).json({ status: 0, error: "Invalid refresh token!" });
        }
        const st_id = rec_token._id;

        const question = await MainQuestionsSchema.findOne({ _id: req.params.id, studentId: st_id }).populate('questionPhoto').exec();
        if (!question) {
            return res.status(404).json({ status: 0, error: 'Question not found' });
        }
        // console.log(question);
        // Fetch the images from the Image collection
        const images = await ImageSchema.find({ _id: { $in: question.questionPhoto } });
        // console.log(images);

        // Map the image data to base64 URLs
        // const imageUrls = question.questionPhoto.map(image => {
        const imageUrls = images.map((image) => {
            // console.log(image);
            return `data:${image.contentType};base64,${image.data.toString('base64')}`;
        });
        let data;
        if (question.status === "NotOpened" || question.status === "Opened" || question.status === "Closed") {
            data = {
                id: question._id,
                question: question.question,
                questionPhoto: imageUrls,
                questionType: question.questionType,
                questionSubject: question.questionSubject,
                status: question.status,
                studentId: question.studentId,
                questionPrice: question.questionPrice,
                tutorPrice: question.tutorPrice,
                answer: question.answer,
                explanation: question.explanation && question.explanation,
                reanswer: question.reAnswer && question.reAnswer,
                reexplanation: question.reExplanation && question.reExplanation,
                studentresponse: question.studentresponded && question.studentResponce,
                adminPrice: question.adminPrice,
                createdAt: question.createdAt,
            }
        } else if (question.status === "PENDING") {
            data = {
                id: question._id,
                question: question.question,
                questionPhoto: imageUrls,
                questionType: question.questionType,
                questionSubject: question.questionSubject,
                status: question.status,
                studentId: question.studentId,
                questionPrice: question.questionPrice,
                tutorPrice: question.tutorPrice,
                adminPrice: question.adminPrice,
                createdAt: question.createdAt,
            }
        } else {
            data = {
                id: question._id,
                question: question.question,
                questionPhoto: imageUrls,
                questionType: question.questionType,
                questionSubject: question.questionSubject,
                status: question.status,
                studentId: question.studentId,
                questionPrice: question.questionPrice,
                tutorPrice: question.tutorPrice,
                adminPrice: question.adminPrice,
                newReason: question.newReason,
                newReasonText: question.newReasonText,
                isNewReasonExecuted: question.isNewReasonExecuted,
                createdAt: question.createdAt,
            }
        }
        // res.render('questiondisplay', { question, imageUrls });
        return res.status(200).json({ status: 1, data });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, error: "Server error" });
    }
});


/*

new api

this for start answering

when tutor clicks on start answering then this api calls it first find questions in pending questionsif questions is not present show them a static page

if questions are there pick last array element 

then change status to 'AssignedWithResponse' and unshift that whole question from pending to allquestions

and then proceeds



*/

router.post("/start_answering", async (req, res) => {
    try {

        // const token = req.headers.authorization;

        // if (!token) {
        //     return res.status(401).json({ status: 0, error: 'Authorization header missing' });
        // }

            const { error } = refreshTokenValidatorSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });

        let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
        if (rec_token === null || !rec_token.token) {
            return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
        }

        var tutorId = rec_token._id;

        var tut_reg = await TutorRegisterSchema.findById(tutorId);

        if (!tut_reg) {
            return res.status(400).json({ status: 0, error: "No Tutor Found!" });
        }

        if (tut_reg.questionassigned === true) {
            if (tut_reg.assignquestionId !== "") {
                var queid = new ObjectId(tut_reg.assignquestionId);
                // console.log("in ", queid);

                var mainque = await MainQuestionsSchema.findById(queid, '_id question questionPhoto questionType questionSubject tutorPrice status internalStatus que_timer_end tutorId');

                console.log("mainque", mainque);
                if (!mainque) {
                    return res.status(400).json({ status: 0, error: "No Questions Found!" });
                }

                if (mainque.internalStatus === "AssignedWithFindResponse") {
                    var questiontiming = await QuestionTimingSchema.findOne({ Type: mainque.questionType });

                    var settime = questiontiming.second_time;
                    var currentTimePlusExtra = new Date();
                    currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + settime);
                    mainque.internalStatus = "AssignedWithResponse";
                    mainque.que_timer_end = currentTimePlusExtra;

                    await mainque.save();

                    var data = {
                        questionId: mainque._id,
                        question: mainque.question,
                        questionType: mainque.questionType,
                        questionSubject: mainque.questionSubject,
                        questionPhoto: mainque.questionPhoto,
                        tutorPrice: mainque.tutorPrice,
                        status: "Assigned"
                    };

                    var tutque = await TutorQuestionsSchema.findOne({ tutorId: tutorId });

                    tutque.allQuestions.unshift(data);

                    await tutque.save();

                    const updatedQuestion = await TutorQuestionsSchema.updateOne(
                        {
                            tutorId: mainque.tutorId,
                            'pendingQuestions.questionId': mainque._id
                        },
                        { $pull: { pendingQuestions: { questionId: mainque._id } } },
                        { multi: true });

                    const images = await ImageSchema.find({ _id: { $in: mainque.questionPhoto } });
                    // console.log(images);

                    // Map the image data to base64 URLs
                    // const imageUrls = question.questionPhoto.map(image => {
                    const imageUrls = images.map((image) => {
                        // console.log(image);
                        return `data:${image.contentType};base64,${image.data.toString('base64')}`;
                    });

                    mainque.questionPhoto = imageUrls;

                    return res.status(200).json({ status: 1, question: mainque, screen: 1 });

                } else if (mainque.internalStatus === "AssignedWithResponse") {

                    const images = await ImageSchema.find({ _id: { $in: mainque.questionPhoto } });
                    // console.log(images);

                    // Map the image data to base64 URLs
                    // const imageUrls = question.questionPhoto.map(image => {
                    const imageUrls = images.map((image) => {
                        // console.log(image);
                        return `data:${image.contentType};base64,${image.data.toString('base64')}`;
                    });

                    mainque.questionPhoto = imageUrls;

                    return res.status(200).json({ status: 1, question: mainque, screen: 1 });
                } else if (mainque.internalStatus === "AssignedAnswer" || mainque.internalStatus === "FixedAnswer") {
                    const images = await ImageSchema.find({ _id: { $in: mainque.questionPhoto } });
                    // console.log(images);

                    // Map the image data to base64 URLs
                    // const imageUrls = question.questionPhoto.map(image => {
                    const imageUrls = images.map((image) => {
                        // console.log(image);
                        return `data:${image.contentType};base64,${image.data.toString('base64')}`;
                    });

                    mainque.questionPhoto = imageUrls;

                    return res.status(200).json({ status: 1, question: mainque, screen: 2 });
                } else {
                    return res.status(400).json({ status: 0, error: "No Questions Found!" });
                }

            } else {
                return res.status(400).json({ status: 0, error: "No Questions Found!" });
            }
        } else {
            return res.status(400).json({ status: 0, error: "No Questions Found!" });
        }

    } catch (error) {
        console.log("error - ", error);
        return res.status(400).json({ status: 0, error: "No Questions Found!" });
    }
});




/*
change status

only for forwarding in to flow 

if send 

AssignedWithFindResponse => goes to AsignedWithResponce


AssignedWithResponse => goes to AssignedAnswer




*/
router.post("/changestatus", async (req, res) => {
    try {
        const { error } = QuestionChangeStatusValidatorSchema.validate(req.body);
        if (error) {
            return res.status(500).json({ status: 0, "error": error.message });
        }
        let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
        if (rec_token === null || !rec_token.token) {
            return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
        }

        var tutorId = rec_token._id;
        const { internalStatus } = req.body;

        var questionId = new ObjectId(req.body.questionId);

        var question = await MainQuestionsSchema.findById(questionId);

        if (question) {
            var questiontiming = await QuestionTimingSchema.findOne({ Type: question.questionType });

            if (tutorId.equals(question.tutorId)) {

                if (internalStatus === question.internalStatus) {

                    if (internalStatus === 'AssignedWithFindResponse') {

                        // var settime = questiontiming.second_time;
                        // var currentTimePlusExtra = new Date();
                        // currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + settime);
                        // question.internalStatus = "AssignedWithResponse";
                        // question.que_timer_end = currentTimePlusExtra;

                        return res.status(401).json({ status: 0, error: "invalid internalStatus" });

                    } else if (internalStatus === 'AssignedWithResponse') {

                        var settime = questiontiming.total_time;
                        var currentTimePlusExtra = new Date();
                        currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + settime);
                        question.internalStatus = "AssignedAnswer";
                        question.que_timer_end = currentTimePlusExtra;

                    } else {
                        return res.status(401).json({ status: 0, error: "invalid internalStatus" });
                    }

                    await question.save();

                } else {
                    return res.status(401).json({ status: 0, error: "invalid internalStatus" });
                }


            } else {
                return res.status(401).json({ status: 0, error: "UnAuthorised Tutor" });
            }
        } else {
            return res.status(401).json({ status: 0, error: "UnAuthorised Question" });
        }

        const images = await ImageSchema.find({ _id: { $in: question.questionPhoto } });
        // console.log(images);

        // Map the image data to base64 URLs
        // const imageUrls = question.questionPhoto.map(image => {
        const imageUrls = images.map((image) => {
            // console.log(image);
            return `data:${image.contentType};base64,${image.data.toString('base64')}`;
        });

        question.questionPhoto = imageUrls;


        var message = "question Status Updated Successfully.";
        return res.status(200).json({ status: 1, question, message });
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ status: 0, error: "Internal Server Error" });
    }
});


router.post("/changestatuswithreasons", async (req, res) => {
    try {
        const { error } = QuestionChangeStatusWithReasonsValidatorSchema.validate(req.body);
        if (error) {
            return res.status(500).json({ status: 0, "error": error.message });
        }
        let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
        if (rec_token === null || !rec_token.token) {
            return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
        }

        var tutorId = rec_token._id;

        const { internalStatus, newReason, newReasonText } = req.body;

        var questionId = new ObjectId(req.body.questionId);

        var question = await MainQuestionsSchema.findById(questionId);

        if (question) {
            var questiontiming = await QuestionTimingSchema.findOne({ Type: question.questionType });

            if (tutorId.equals(question.tutorId)) {

                if (internalStatus === question.internalStatus) {

                    if (internalStatus === 'AssignedWithResponse' || internalStatus === 'AssignedAnswer') {

                        if (newReason === 1) {
                            question.status = "Issue";
                            question.newReason = newReason;
                            question.newReasonText = newReasonText;
                            question.isNewReasonExecuted = 1;

                            await question.save();

                            StudentQuestionsSchema.updateOne(
                                { "allQuestions.questionId": question._id },
                                {
                                    $set: {
                                        "allQuestions.$.status": "Issue",
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


                        } else if (newReason === 2) {
                            question.status = "Issue";
                            question.newReason = newReason;
                            question.newReasonText = newReasonText;
                            question.isNewReasonExecuted = 1;

                            await question.save();

                            StudentQuestionsSchema.updateOne(
                                { "allQuestions.questionId": question._id },
                                {
                                    $set: {
                                        "allQuestions.$.status": "Issue",
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

                        } else if (newReason === 3) {
                            question.status = "Issue";
                            question.newReason = newReason;
                            question.newReasonText = newReasonText;
                            question.isNewReasonExecuted = 1;

                            await question.save();
                            StudentQuestionsSchema.updateOne(
                                { "allQuestions.questionId": question._id },
                                {
                                    $set: {
                                        "allQuestions.$.status": "Issue",
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

                        } else if (newReason === 4) {
                            question.status = "Issue-admin";
                            question.newReason = newReason;
                            question.newReasonText = newReasonText;
                            question.isNewReasonExecuted = 1;

                            await question.save();

                            StudentQuestionsSchema.updateOne(
                                { "allQuestions.questionId": question._id },
                                {
                                    $set: {
                                        "allQuestions.$.status": "Issue-admin",
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

                        } else if (newReason === 5) {
                            var stat;
                            if (newReasonText !== 'Skip') {
                                stat = "No Response";
                            } else {
                                stat = reason;
                            }
                            await TutorQuestionsSchema.findOneAndUpdate(
                                {
                                    tutorId: question.tutorId,
                                    "allQuestions.questionId": question._id
                                },
                                {
                                    $set: { "allQuestions.$.status": stat }
                                }
                            );

                            await findTutorAndAssignQuestion(question);

                        } else {
                            // var error = "Wrong Choice of Reason!"
                            return res.status(401).json({ status: 0, error: "Wrong Choice of Reason!" });
                        }


                    } else {
                        return res.status(401).json({ status: 0, error: "invalid internalStatus" });
                    }

                    // await question.save();

                } else {
                    return res.status(401).json({ status: 0, error: "invalid internalStatus" });
                }


            } else {
                return res.status(401).json({ status: 0, error: "UnAuthorised Tutor" });
            }
        } else {
            return res.status(401).json({ status: 0, error: "UnAuthorised Question" });
        }
        var message = "question Status Updated Successfully.";
        return res.status(200).json({ status: 1, message });
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ status: 0, "error": "Internal Server Error" });
    }
});

router.post("/updatequestion", upload.array('questionPhoto', 5), async (req, res) => {
    try {
        const { error } = UpdateQuestionValidatorSchema.validate(req.body);
        if (error) {
            return res.status(500).json({ status: 0, "error": error.message });
        }
        let rec_token = await TokenStudent.fetchByToken({ token: req.body.token });
        if (rec_token === null || !rec_token.token) {
            return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
        }

        // console.log(req);

        var st_id = rec_token._id;

        // const { internalStatus, newReason, newReasonText } = req.body;

        var questionId = new ObjectId(req.body.questionId);

        var question = await MainQuestionsSchema.findById(questionId);

        if (question) {
            var questiontiming = await QuestionTimingSchema.findOne({ Type: question.questionType });

            // if (tutorId.equals(question.tutorId)) {
            const now = new Date();
            if (question.status === "Issue") {

                if (question.newReason === 1 && req.body.questionSubject) {

                    question.questionSubject = req.body.questionSubject;
                    question.status = "PENDING";
                    question.createdAt = now;
                    question.internalStatus = "AssignedWithFindResponse";
                    question.isNewReasonExecuted = 0;

                    await question.save();

                    StudentQuestionsSchema.updateOne(
                        { "allQuestions.questionId": question._id },
                        {
                            $set: {
                                "allQuestions.$.status": "PENDING",
                                "allQuestions.$.dateOfPosted": now,
                                "allQuestions.$.questionSubject": req.body.questionSubject
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


                    await findTutorAndAssignQuestion(question);

                } else if (question.newReason === 2 && req.body.questionType) {


                    // change of mainquestion tutor and admin price is remaining
                    var questionpricing = await QuestionPricingSchema.findOne({ Type: req.body.questionType });

                    if (req.body.priceChange) {
                        var old_price = await QuestionPriceInUsd(question.questionType);
                        var new_price = await QuestionPriceInUsd(req.body.questionType);

                        console.log(old_price, new_price);


                        var com = parseFloat(new_price) - parseFloat(old_price);
                        console.log(com);

                        if (com !== parseFloat(req.body.priceChange)) {
                            // var message = "Invalid Conversion Rate";
                            return res.status(401).json({ status: 0, error: "Invalid Conversion Rate" });
                        } else {
                            var st_wal = await StudentWalletSchema.findOne({ studentId: st_id });
                            if (com < 0) {

                                com = -1 * com;

                                st_wal.availableAmount += parseFloat(com);
                                st_wal.totalAmount = parseFloat(st_wal.availableAmount) + parseFloat(st_wal.redeemableAmount);

                                var old_typename = questionTypeName(question.questionType);
                                var new_typename = questionTypeName(req.body.questionType);



                                const transaction = {
                                    transactionId: await generateTransactionId(),
                                    date: new Date(),
                                    type: "Partial Refund",
                                    amount: parseFloat(com),
                                    description: `Partial Refund for changing ${old_typename} question to ${new_typename} question`,
                                    status: "Success",
                                    balance: st_wal.availableAmount
                                };
                                let name;
                                let studentname = await StudentInformationSchema.findOne({ userId: st_wal.studentId });
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
                                    balance: transaction.balance
                                }

                                const centaltransactiondetails = await CentralTransactionsSchema.create({
                                    category: "Student",
                                    walletId: st_wal._id,
                                    transactionId: transaction.transactionId,
                                    name: name,
                                    date: transaction.date,
                                    type: transaction.type,
                                    amount: transaction.amount,
                                    description: transaction.description,
                                    status: transaction.status,
                                    balance: transaction.balance
                                })
                                if (!centaltransactiondetails) {
                                    return res.status(400).json({ status: 0, error: "central transaction not created!" });
                                }
                                await centaltransactiondetails.save();

                                st_wal.walletHistory.unshift(transaction);
                                await st_wal.save();



                            } else if (com === 0) {

                            } else {

                                var limit = 0.25;
                                var compare = parseFloat(limit) + parseFloat(com);
                                if (st_wal.availableAmount < compare) {
                                    return res.status(400).json({ message: 'Your Balance is not Suffecient!' });
                                }

                                st_wal.availableAmount -= parseFloat(com);
                                st_wal.totalAmount = parseFloat(st_wal.availableAmount) + parseFloat(st_wal.redeemableAmount);

                                var old_typename = questionTypeName(question.questionType);
                                var new_typename = questionTypeName(req.body.questionType);



                                const transaction = {
                                    transactionId: await generateTransactionId(),
                                    date: new Date(),
                                    type: "Partial Charge",
                                    amount: parseFloat(com),
                                    description: `Partial Payment for changing ${old_typename} question to ${new_typename} question`,
                                    status: "Success",
                                    balance: st_wal.availableAmount
                                };
                                let name;
                                let studentname = await StudentInformationSchema.findOne({ userId: st_wal.studentId });
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
                                    balance: transaction.balance
                                }

                                const centaltransactiondetails = await CentralTransactionsSchema.create({
                                    category: "Student",
                                    walletId: st_wal._id,
                                    transactionId: transaction.transactionId,
                                    name: name,
                                    date: transaction.date,
                                    type: transaction.type,
                                    amount: transaction.amount,
                                    description: transaction.description,
                                    status: transaction.status,
                                    balance: transaction.balance
                                })
                                if (!centaltransactiondetails) {
                                    return res.status(400).json({ status: 0, error: "central transaction not created!" });
                                }
                                await centaltransactiondetails.save();
                                st_wal.walletHistory.unshift(transaction);
                                await st_wal.save();

                            }

                            question.questionPrice = new_price;
                            question.tutorPrice = questionpricing.tutor_price;
                            question.adminPrice = questionpricing.admin_price;
                            question.questionType = req.body.questionType;
                            question.status = "PENDING";
                            question.internalStatus = "AssignedWithFindResponse";
                            question.createdAt = now;
                            question.isNewReasonExecuted = 0;

                            await question.save();
                            StudentQuestionsSchema.updateOne(
                                { "allQuestions.questionId": question._id },
                                {
                                    $set: {
                                        "allQuestions.$.status": "PENDING",
                                        "allQuestions.$.questionPrice": new_price,
                                        "allQuestions.$.questionType": req.body.questionType
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

                            await findTutorAndAssignQuestion(question);


                        }



                    } else {
                        // var message = "Please Provide Price Change";
                        return res.status(401).json({ status: 0, error: "Please Provide Price Change" });
                    }



                } else if (question.newReason === 3) {


                    question.questionPhoto.map(async img => {

                        var imageid = new ObjectId(img);
                        await ImageSchema.findByIdAndDelete(imageid);

                    });

                    console.log(req.files);
                    const imagePromises = req.files.map(async file => {
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
                    const imageIds = images.map(image => image._id);
                    // console.log(imageIds);

                    question.questionPhoto = imageIds;
                    question.question = req.body.question_1;
                    question.status = "PENDING";
                    question.internalStatus = "AssignedWithFindResponse";
                    question.isNewReasonExecuted = 0;

                    await question.save();

                    StudentQuestionsSchema.updateOne(
                        { "allQuestions.questionId": question._id },
                        {
                            $set: {
                                "allQuestions.$.status": "PENDING",
                                "allQuestions.$.questionPhoto": imageIds,
                                "allQuestions.$.question": req.body.question_1,
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

                    await findTutorAndAssignQuestion(question);

                } else {
                    // var message = "Wrong Choice of Reason!"
                    return res.status(401).json({ status: 0, error: "Wrong Choice of Reason!" });
                }


            } else {
                return res.status(401).json({ status: 0, error: "invalid question status" });
            }

            // await question.save();

        } else {
            return res.status(401).json({ status: 0, error: "UnAuthorised Question" });
        }


        var message = "question Status Updated Successfully.";
        return res.status(200).json({ status: 1, question, message });
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ status: 0, "error": "Internal Server Error" });
    }
});


router.post("/unsolvedskip", async (req, res) => {
    try {
        const { error } = UnsolvedSkipValidatorSchema.validate(req.body);
        if (error) {
            return res.status(500).json({ status: 0, "error": error.message });
        }
        let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
        if (rec_token === null || !rec_token.token) {
            return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
        }

        var tutorId = rec_token._id;

        var questionId = new ObjectId(req.body.questionId);

        var question = await MainQuestionsSchema.findById(questionId);

        if (question) {

            if (tutorId.equals(question.tutorId)) {

                if (question.internalStatus === 'AssignedAnswer') {


                    await TutorQuestionsSchema.findOneAndUpdate(
                        {
                            tutorId: question.tutorId,
                            "allQuestions.questionId": question._id
                        },
                        {
                            $set: { "allQuestions.$.status": 'Skip' }
                        }
                    );

                    question.internalStatus = "";
                    await question.save();



                } else {
                    return res.status(401).json({ status: 0, error: "invalid internalStatus" });
                }

                // await question.save();


            } else {
                return res.status(401).json({ status: 0, error: "UnAuthorised Tutor" });
            }
        } else {
            return res.status(401).json({ status: 0, error: "UnAuthorised Question" });
        }
        var message = "question Status Updated Successfully.";
        return res.status(200).json({ status: 1, message });
    } catch (error) {
        console.log("error: ", error);
        return res.status(500).json({ status: 0, "error": "Internal Server Error" });
    }
});




export function questionTypeName(Type) {
    var ans;
    if (Type === 'MCQ') {
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
    } else {
        ans = " ";
    }

    return ans;
}

export default router;



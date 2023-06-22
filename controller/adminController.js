import { Admin, MainQuestions, TokenAdmin, TutorPersonal, TutorProfessional, TutorQuestions, TokenTutor } from "../model/index.js";
import { AdminSchema, QuestionTimingSchema, ReAnswerChoiceSchema, TokenAdminSchema, QuestionPricingSchema, CurrencyConversionSchema, QuestionTypeSchema, QuestionSubjectSchema, TutorExamQuestionsSchema, TutorRegisterSchema, TutorWalletSchema, TutorQuestionsSchema, MainQuestionsSchema, ImageSchema, TutorDocumentSchema, TutorImageSchema, TutorPersonalSchema, TutorProfessionalSchema, TutorBankDetailsSchema, StudentRegisterSchema, StudentWalletSchema, StudentQuestionsSchema, TutorExamDetailsSchema, AdminTutorExamAnswersSchema, SocialMediaSchema, StudentCouponSchema, CMSSchema, TestimonialImageSchema, TestimonialSchema, TutorSubjectsSchema, TutorExamSubjectSchema, CentralTransactionsSchema, TutorsPaymentSchema, CentralTransactionsDemoSchema, AdminRoleSchema, ClassSchema, StudentContactSchema, TutorContactSchema, AdminContactSchema, AdminMobileNoSchema, StudentPostingStreakSchema, TutorPostingStreakSchema, SubscriptionSchema, PaymentGatewaySchema, AdminThoughtSchema, TutorExamPopUpSchema, PostingGuidelineSchema, AdminPagesSchema, AnsweringGuidelineSchema, StudentRegisterBonusSchema } from "../schema/index.js";
import { AdminRegisterValidatorSchema, AdminLoginValidatorSchema, refreshTokenValidatorSchema, AdminSetQuestionTimingValidatorSchema, AdminSetReAnswerValidatorSchema, AdminSetQuestionPricingValidatorSchema, AdminSetCurrencyConversionValidatorSchema, AdminInAppropriateQuestionValidatorSchema, QuestionTypeValidatorSchema, QuestionSubjectValidatorSchema, AdminTutorPaymentValidatotSchema, AdminQuestionPostValidator, AdminExamValidatorValidatorSchema, TutorExamQuestionValidatorSchema, AdminRandomTutorExamQuestionsValidatorSchema, AdminTutorExamAnswersValidatorSchema, AdminStudentCouponValidatorSchema, AdminTestimonialValidatorSchema, AdminSocialMediaValidatorSchema, AdminTutorExamResponseValidatorSchema, AdminTestimonialStatusValidatorSchema, AdminCMSValidatorSchema, TutorExamSubjectValidatorSchema, AdminCMSStatusValidatorSchema, UpdateTutorExamQuestionValidatorSchema, AdminSendAnswerValidatorSchema, MultipleAdminValidatorSchema, AdminRoleValidatorSchema, AdminClassValidatorSchema, AdminContactValidatorSchema, AdminForgotPasswordValidatorSchema, AdminTutorStatusValidatorSchema, AdminMobileNoValidatorSchema, AdminUpdateIssueSubjectValidatorSchema, AdminIssueSolvedValidatorSchema, AdminDeleteQuestionValidatorSchema, StudentPostingStreakValidatorSchema, TutorPostingStreakValidatorSchema, AdminStudentReferralValidatorSchema, AdminTutorReferralValidatorSchema, AdminSubscriptionValidatorSchema, AdminChangeSubscriptionPriceValidatorSchema, AdminSubscriptionStatusValidatorSchema, AdminPaymentGatewayValidatorSchema, AdminPaymentGatewayStatusValidatorSchema, AdminThoughtValidatorSchema, AdminTutorExamPopUpValidatorSchema, AdminPostingGuidelineValidatorSchema, AdminPagesValidatorSchema, AdminAnsweringGuidelineValidatorSchema, AdminStudentRegisterBonusValidatorSchema } from "../validators/index.js";

import bcrypt from "bcrypt";
import JwtService from "../service/JwtService.js";
import { APP_URL, SALT_FACTOR } from "../config/index.js";
import crypto from 'crypto';
import multer from 'multer';
import mongoose from "mongoose";
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import AdminQuestionValidatorSchema from "../validators/TutorExamQuestionValidator.js";
import tutorpersonal from "../schema/tutorpersonal.js";
import tutorsubjects from "../schema/tutorsubjects.js";
import { ObjectId } from "mongodb";
import { TutorMinBalanceSchema } from "../schema/index.js";
import TutorminbalanceValidatorSchema from "../validators/TutorminbalanceValidator.js";
import generateTransactionId from "./generateTransactionId.js";
// import { tutorimage, upload } from "./tutorController.js";
import { AdmintutorpersonalValidatorSchema } from "../validators/AdminTutorallinfoValidator.js";
import { questionTypeName } from "../routes/question.js";
import { QuestionPriceInUsd } from "./QuestionPriceInUsd.js";
import AdmintutorquestionanswerValidatorSchema from "../validators/admintutorquestionanswerValidator.js";
import reanswerchoice from "../schema/reanswerchoice.js";
import AdmintutorwarningquestionValidatorSchema from "../validators/AdmintutorwarningquestionValidator.js";
import { findTutorAndAssignQuestion } from "./findTutorAndAssignQuestion.js";
import moment from "moment";
import emailSender from "./emailsender.js";
import tutorwarningquestionTemplate from "../emailtemplates/tutorwarningquestion.js";
import suspendtutorTemplate from "../emailtemplates/suspendtutor.js";
import reactivatetutorTemplate from "../emailtemplates/reactivatetutor.js";
import forgotpasswordTemplate from "../emailtemplates/forgotpassword.js";
import tutorexampassTemplate from "../emailtemplates/tutorexampass.js";
import tutorexamfailTemplate from "../emailtemplates/tutorexamfail.js";
import tutorpaymentTemplate from "../emailtemplates/tutorpayment.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)





// multer for image save 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        let uploadDirectory;
        if (file.fieldname === "profilephoto") {
            uploadDirectory = path.join(__dirname, '..', 'tutorimage');
            console.log(uploadDirectory);
        } else if (file.fieldname === "degree_image") {
            uploadDirectory = path.join(__dirname, '..', 'uploads');
            console.log(uploadDirectory);
        } else if (file.fieldname === "questionPhoto") {
            uploadDirectory = path.join(__dirname, '..', 'upload');
            console.log(uploadDirectory);
        } else {
            uploadDirectory = path.join(__dirname, '..', 'testimonial');
            console.log(uploadDirectory);
        }
        // else {
        //     uploadDirectory = path.join(__dirname, '..', 'postingguideline');
        //     console.log(uploadDirectory);
        // }

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

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {

        // let uploadDirectory = path.join(__dirname, '..', 'postingguideline');
        //     console.log(uploadDirectory);
        let uploadDirectory;
        if(file.fieldname === "postingguideline"){
            uploadDirectory = path.join(__dirname, '..', 'postingguideline');
            console.log(uploadDirectory);
        }else{
            uploadDirectory = path.join(__dirname, '..', 'answeringguideline');
            console.log(uploadDirectory);
        }
        

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
            // return cb(new Error('Please upload a Image'))
            return cb(null, false)
        }
        cb(undefined, true)
    }
}).fields([{ name: 'profilephoto', maxCount: 1 }, { name: 'degree_image', maxCount: 1 }, { name: 'questionPhoto', maxCount: 5 }, { name: 'profileimage', maxCount: 1 }]);


const uploadpdf = multer({
    storage: storage1,
    limits: {
        fileSize: 1000000000 // 1000000000 Bytes = 1 GB
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.match(/\.(pdf|docx)$/)) {
            // upload only png and jpg format
            // return cb(new Error('Please upload a Pdf / Docx File'))
            return cb(null, false)
        }
        cb(undefined, true)
    }
}).fields([{ name: 'postingguideline', maxCount: 1 }, { name: 'answeringguideline', maxCount: 1 }]);
// multer ends here


const adminController = {
    async register(req, res, next) {
        try {
            const { error } = AdminRegisterValidatorSchema.validate(req.body);
            if (error) {
                return res.json({ status: 0, "error": error.message });
            }
            const { username, email, password } = req.body;
            const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
            const hashedPassword = await bcrypt.hash(password, salt);
            req.body.password = hashedPassword;

            var user;

            user = new AdminSchema({
                username,
                email,
                password: req.body.password,
            });

            var aa = await Admin.create(user);
            // console.log(aa);

            if (!aa.error) {
                // console.log(aa);
                let refresh_token;
                // access_token = await JwtService.sign({_id:document._id});
                refresh_token = await JwtService.sign({ _id: aa._id });
                var tt = await TokenAdminSchema.create({ _id: aa._id, token: refresh_token, expiresAt: new Date() });
                let token = refresh_token;
                var info = aa;
                var message = "Admin Registered Successfully.";
                return res.status(200).json({ status: 1, info, token, message });
                // res.json(aa);
                // res.redirect("/student/home");
            } else {
                return res.status(400).json({ status: 0, "error": aa.error });
                // res.redirect("/student/register");
            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 0, error });
        }
    },
    async login(req, res, next) {
        try {
            const { error } = AdminLoginValidatorSchema.validate(req.body);
            if (error) {
                return res.json({ status: 0, "error": error.message });
            }
            let { email, password } = req.body;
            const user = await Admin.fetchById({ email: email });
            // if(!user) return next(CustomErrorHandler.wrongCredential());
            if (!user) {
                return res.status(400).json({ status: 0, "error": "Email is not Registered!" });
            }

            const match = await bcrypt.compare(password, user.password);
            // if(!match) return next(CustomErrorHandler.wrongCredential());
            if (!match) {
                return res.status(400).json({ status: 0, "error": "Please Write correct password!" });
            }

            var refresh_token;
            try {
                var r_t = await TokenAdmin.fetchById({ _id: user._id });
                // console.log(`r_t = ${r_t}`);
                if (r_t === "al") {
                    refresh_token = await JwtService.sign({ _id: user._id });
                    // user.token = refresh_token;
                    console.log("New Generated");

                    await TokenAdminSchema.create({ _id: user._id, token: refresh_token, expiresAt: new Date() });

                } else {
                    refresh_token = r_t.token;
                    // console.log("already exist");
                }
            } catch (error) {
                console.log("error generated");
                return res.status(400).json({ status: 0, "error": "Internal Server Error" });
            }


            var role = await AdminRoleSchema.findById(user.role).populate('action');
            var actions;
            if(!role){

            } else {
                actions = role.action;
            }

            var message = "Tutor Login Successfully.";
            var info = user;
            console.log(refresh_token);
            return res.status(200).json({ status: 1, info, actions,token: refresh_token, message });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 0, error });
        }
    },
    async logout(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const del = await TokenAdmin.delete({ token: rec_token.token });
            // console.log(del);
            if (del.acknowledged === true) {
                res.status(200).json({ status: 1, message: "Logged out successful" });
            } else {
                res.status(400).json({ status: 0, error: "Error in Logging out Tutor!" });
            }
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 0, error });
        }
    },
    async changepassword(req, res, next) {
        try {
            const { error } = TutorChangePasswordValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            const { password, new_password } = req.body;

            const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
            const hashedPassword = await bcrypt.hash(new_password, salt);
            // new_password = hashedPassword;
            var st_id = rec_token._id;

            var data = await Tutor.fetchById({ _id: st_id });

            const match = await bcrypt.compare(password, data.password);
            // if(!match) return next(CustomErrorHandler.wrongCredential());
            if (!match) {
                return res.status(400).json({ status: 0, "error": "Please Enter correct current password!" });
            }

            var new_data = await TutorRegisterSchema.findByIdAndUpdate(st_id, { password: hashedPassword }, { new: true })

            const message = "Tutor Password Changed Successfully.";
            res.status(200).json({ status: 1, message });

        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 0, error });
        }
    },


    // Class Stuff

    async getclass(req, res, next) {
        try {
            const questionTypes = await ClassSchema.find({}, 'studentClass');

            if (!questionTypes || questionTypes.length === 0) {
                return res.status(400).json({ status: 0, error: "No Class Found!" });
            }
            const questionTypeList = questionTypes.map(qt => qt.studentClass);
            return res.status(200).json({ status: 1, data: questionTypeList });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },

    async setquestionclass(req, res, next) {
        try {
            const { error } = AdminClassValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { studentClass } = req.body;

            var old_sch;
            
            if (req.body.id) {
                var id = new ObjectId(req.body.id);
                old_sch = await ClassSchema.findById(id);
            }


            console.log(old_sch);

            if (!old_sch) {
                var new_sch;
                try {

                    new_sch = await ClassSchema.create({
                        studentClass
                    });

                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }
                var as = await new_sch.save();
                // console.log("dgfgdfh: ", as);

                if (!as) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }

                return res.status(200).json({ status: 1, message: "Class Details Created Successfully." });

            } else {
                var new_sch;
                try {
                    new_sch = await ClassSchema.findByIdAndUpdate(old_sch._id, {
                        studentClass
                    }, { new: true });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }

                if (!new_sch) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }

                return res.status(200).json({ status: 1, message: "Details Updated Successfully." });

            }


        } catch (error) {
            console.log("error : ", error);
            return res.status(500).json({ status: 0, message: "Internal Server Error!" });
        }
    },

    async getquestionclass(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const questionTypes = await ClassSchema.find({}, '-__v');

            // if (!questionTypes || questionTypes.length === 0) {
            //     return res.status(400).json({ status: 0, error: "No QuestionTypes Found!" });
            // }
            // const questionTypeList = questionTypes.map(qt => qt.questionType);
            return res.status(200).json({ status: 1, data: questionTypes });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },

    async deletequestionclass(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await ClassSchema.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            return res.status(200).json({ status: 1, message: "question Class deleted successfully" });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },


    /// this section is for question timing add/update/delete

    async getquestiontypefortiming(req, res, next) {
        try {
            const questionTypes = await QuestionTypeSchema.find({}, 'questionType');
            const timingTypes = await QuestionTimingSchema.find({}, 'Type');

            if (!questionTypes || questionTypes.length === 0) {
                return res.status(400).json({ status: 0, error: "No QuestionTypes Found!" });
            }

            const questionTypeList = questionTypes.map(qt => qt.questionType);
            const timingTypeList = timingTypes.map(pt => pt.Type);

            const filteredQuestionTypes = questionTypeList.filter(qt => !timingTypeList.includes(qt));

            return res.status(200).json({ status: 1, data: filteredQuestionTypes });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    async setquestiontiming(req, res, next) {
        try {
            const { error } = AdminSetQuestionTimingValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { Type } = req.body;

            var first_time = 0, second_time = 0, skip_time = 0, total_time = 0, tutor_time = 0, admin_time = 0, unsolved_time = 0;

            first_time = req.body.first_time;
            second_time = req.body.second_time;
            skip_time = req.body.skip_time;
            total_time = req.body.total_time;
            tutor_time = req.body.tutor_time;
            admin_time = req.body.admin_time;
            unsolved_time = req.body.unsolved_time;

            let old_sch;

            if (req.body.id) {
                var id = new ObjectId(req.body.id);
                old_sch = await QuestionTimingSchema.findById(id);
            }


            console.log(old_sch);

            if (!old_sch) {
                var new_sch;
                try {

                    new_sch = await QuestionTimingSchema.create({
                        Type,
                        first_time,
                        second_time,
                        skip_time,
                        total_time,
                        tutor_time,
                        admin_time,
                        unsolved_time
                    });

                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }
                var as = await new_sch.save();
                console.log("dgfgdfh: ", as);

                if (!as) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }

                return res.status(200).json({ status: 1, message: "Details Created Successfully." });

            } else {
                var new_sch;
                try {
                    new_sch = await QuestionTimingSchema.findByIdAndUpdate(old_sch._id, {
                        first_time,
                        second_time,
                        skip_time,
                        total_time,
                        tutor_time,
                        admin_time,
                        unsolved_time
                    }, { new: true });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }

                if (!new_sch) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }

                return res.status(200).json({ status: 1, message: "Details Updated Successfully." });

            }


        } catch (error) {
            console.log("error : ", error);
            return res.status(500).json({ status: 0, message: "Internal Server Error!" });
        }
    },

    async getquestiontiming(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const questionTypes = await QuestionTimingSchema.find();

            // if (!questionTypes || questionTypes.length === 0) {
            //     return res.status(400).json({ status: 0, error: "No QuestionTypes Found!" });
            // }
            // const questionTypeList = questionTypes.map(qt => qt.questionType);
            return res.status(200).json({ status: 1, data: questionTypes });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },

    async deletequestiontiming(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await QuestionTimingSchema.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            return res.status(200).json({ status: 1, message: "questiontiming deleted successfully" });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async setreanswer(req, res, next) {
        try {
            const { error } = AdminSetReAnswerValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var old_sch = await ReAnswerChoiceSchema.findOne();
            console.log("old_sch - ", old_sch);
            var message;


            if (old_sch) {
                old_sch.choice = req.body.choice;
                old_sch.reanswer_time = req.body.reanswer_time;
                await old_sch.save();
                message = "Choice Updated Successfully.";
                return res.status(200).json({ status: 1, message });

            } else {
                var new_sch;
                console.log("choice - ", req.body.choice);
                new_sch = await ReAnswerChoiceSchema.create({
                    choice: req.body.choice,
                    reanswer_time: req.body.reanswer_time
                });
                message = "Choice Updated Successfully.";
                return res.status(200).json({ status: 1, message });
            }
        } catch (error) {
            console.log("error - ", error);
            message = "Internal Server Error.";
            return res.status(500).json({ status: 0, message });
        }
    },

    async getreanswer(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const questionTypes = await ReAnswerChoiceSchema.findOne();

            // if (!questionTypes || questionTypes.length === 0) {
            //     return res.status(400).json({ status: 0, error: "No QuestionTypes Found!" });
            // }
            // const questionTypeList = questionTypes.map(qt => qt.questionType);
            return res.status(200).json({ status: 1, data: questionTypes });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },

    /// this section is for question pricing add/update/delete
    async getquestiontypeforpricing(req, res, next) {
        try {
            const questionTypes = await QuestionTypeSchema.find({}, 'questionType');
            const pricingTypes = await QuestionPricingSchema.find({}, 'Type');

            if (!questionTypes || questionTypes.length === 0) {
                return res.status(400).json({ status: 0, error: "No QuestionTypes Found!" });
            }

            const questionTypeList = questionTypes.map(qt => qt.questionType);
            const pricingTypeList = pricingTypes.map(pt => pt.Type);

            const filteredQuestionTypes = questionTypeList.filter(qt => !pricingTypeList.includes(qt));

            return res.status(200).json({ status: 1, data: filteredQuestionTypes });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    async setquestionpricing(req, res, next) {
        try {
            const { error } = AdminSetQuestionPricingValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { Type, question_price, tutor_price, admin_price } = req.body;
            let old_sch;
            if (req.body.id) {
                var id = new ObjectId(req.body.id);
                old_sch = await QuestionPricingSchema.findById(id);
            }

            // var old_sch = await QuestionPricingSchema.findOne({ Type: Type });

            // console.log(old_sch);

            if (!old_sch) {
                var new_sch;
                try {
                    new_sch = await QuestionPricingSchema.create({
                        Type,
                        question_price,
                        tutor_price,
                        admin_price
                    });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }
                var as = await new_sch.save();
                console.log("dgfgdfh: ", as);

                if (!as) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }

                return res.status(200).json({ status: 1, message: "Details Created Successfully." });

            } else {
                var new_sch;
                try {
                    new_sch = await QuestionPricingSchema.findByIdAndUpdate(old_sch._id, {
                        question_price,
                        tutor_price,
                        admin_price
                    }, { new: true });
                } catch (error) {
                    console.log(error);
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }

                if (!new_sch) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }

                return res.status(200).json({ status: 1, message: "Details Updated Successfully." });

            }
        } catch (error) {
            console.log("error : ", error);
            return res.status(500).json({ status: 0, message: "Internal Server Error!" });
        }
    },

    async getquestionpricing(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const questionTypes = await QuestionPricingSchema.find();

            // if (!questionTypes || questionTypes.length === 0) {
            //     return res.status(400).json({ status: 0, error: "No QuestionTypes Found!" });
            // }
            // const questionTypeList = questionTypes.map(qt => qt.questionType);
            return res.status(200).json({ status: 1, data: questionTypes });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },

    async deletequestionpricing(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await QuestionPricingSchema.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            return res.status(200).json({ status: 1, message: "questionpricing deleted successfully" });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async setcurrencyconversion(req, res, next) {
        try {
            const { error } = AdminSetCurrencyConversionValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { Currency, ConversionToInr } = req.body;

            if (Currency === 'USD') {
                var old_sch = await CurrencyConversionSchema.findOne({ Currency: Currency });

                console.log(old_sch);

                if (!old_sch) {
                    var new_sch;
                    try {
                        new_sch = await CurrencyConversionSchema.create({
                            Currency,
                            ConversionToInr
                        });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                    }
                    var as = await new_sch.save();
                    console.log("currency create : ", as);

                    if (!as) {
                        return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                    }

                    return res.status(200).json({ status: 1, message: "Details Created Successfully." });

                } else {
                    var new_sch;
                    try {
                        new_sch = await CurrencyConversionSchema.findByIdAndUpdate(old_sch._id, {
                            ConversionToInr
                        }, { new: true });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                    }

                    if (!new_sch) {
                        return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                    }

                    return res.status(200).json({ status: 1, message: "Currency Conversion Rate Updated Successfully." });

                }

            } else {
                return res.status(500).json({ status: 0, status: 0, message: "Wrong Type!" });
            }






        } catch (error) {
            console.log("error : ", error);
            return res.status(500).json({ status: 0, message: "Internal Server Error!" });
        }
    },
    async getcurrencyconversion(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var old_sch = await CurrencyConversionSchema.findOne({ Currency: "USD" });

            if (!old_sch) {
                return res.status(400).json({ status: 0, error: "Data not Found!" });
            }

            return res.status(200).json({ status: 1, rate: old_sch.ConversionToInr });
        } catch (error) {
            console.log("Error - ", error);
            return res.status(400).json({ status: 0, error: "Internal server Error!" });
        }
    },
    async inappropriatequestion(req, res, next) {
        try {
            const { error } = AdminInAppropriateQuestionValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { Currency, ConversionToInr } = req.body;

            if (Currency === 'USD') {
                var old_sch = await CurrencyConversionSchema.findOne({ Currency: Currency });

                console.log(old_sch);

                if (!old_sch) {
                    var new_sch;
                    try {
                        new_sch = await CurrencyConversionSchema.create({
                            Currency,
                            ConversionToInr
                        });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                    }
                    var as = await new_sch.save();
                    console.log("currency create : ", as);

                    if (!as) {
                        return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                    }

                    return res.status(200).json({ status: 1, message: "Details Created Successfully." });

                } else {
                    var new_sch;
                    try {
                        new_sch = await CurrencyConversionSchema.findByIdAndUpdate(old_sch._id, {
                            ConversionToInr
                        }, { new: true });
                    } catch (error) {
                        console.log(error);
                        return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                    }

                    if (!new_sch) {
                        return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                    }

                    return res.status(200).json({ status: 1, message: "Details Updated Successfully." });

                }

            } else {
                return res.status(500).json({ status: 0, status: 0, message: "Wrong Type!" });
            }






        } catch (error) {
            console.log("error : ", error);
            return res.status(500).json({ status: 0, message: "Internal Server Error!" });
        }
    },
    async questiontype(req, res, next) {
        try {
            const { error } = QuestionTypeValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { questionType } = req.body;

            var data;
            if (req.body.id) {
                var id = new ObjectId(req.body.id);
                data = await QuestionTypeSchema.findById(id);
            }
            if (!data) {
                try {
                    let document = await QuestionTypeSchema.create({
                        questionType
                    });

                    await document.save();
                } catch (err) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }
                return res.status(200).json({ status: 1, message: "Data create successfully" });
            } else {
                try {
                    let document = await QuestionTypeSchema.findByIdAndUpdate({ _id: data._id }, {
                        questionType
                    }, { new: true });

                    await document.save();
                } catch (err) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }
                return res.status(200).json({ status: 1, message: "Data updated successfully" });
            }
        } catch (err) {
            return res.status(500).json({ status: 0, message: "Internal Server Error!" });
        }
    },
    async getquestiontype(req, res, next) {
        try {
            const questionTypes = await QuestionTypeSchema.find({}, 'questionType');

            if (!questionTypes || questionTypes.length === 0) {
                return res.status(400).json({ status: 0, error: "No QuestionTypes Found!" });
            }
            const questionTypeList = questionTypes.map(qt => qt.questionType);
            const message = "question type details successfully";
            return res.status(200).json({ status: 1, data: questionTypes , message});
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    async deletequestiontype(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await QuestionTypeSchema.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            return res.status(200).json({ status: 1, message: "questiontype deleted successfully" });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async questionsubject(req, res, next) {
        try {
            const { error } = QuestionSubjectValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { questionSubject } = req.body;

            var data;
            if (req.body.id) {
                var id = new ObjectId(req.body.id);
                data = await QuestionSubjectSchema.findById(id);
            }
            if (!data) {
                try {
                    let document = await QuestionSubjectSchema.create({
                        questionSubject
                    });
                    await document.save();
                } catch (err) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }
                return res.status(200).json({ status: 1, message: "Data create successfully" });
            } else {
                try {
                    let document = await QuestionSubjectSchema.findByIdAndUpdate({ _id: data._id }, {
                        questionSubject
                    }, { new: true });
                    await document.save();
                } catch (err) {
                    return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                }
                return res.status(200).json({ status: 1, message: "Data updated successfully" });
            }
        } catch (err) {
            return res.status(500).json({ status: 0, message: "Internal Server Error!" });
        }
    },
    async getquestionsubject(req, res, next) {
        try {
            const questionTypes = await QuestionSubjectSchema.find({}, 'questionSubject');

            if (!questionTypes || questionTypes.length === 0) {
                return res.status(400).json({ status: 0, error: "No QuestionTypes Found!" });
            }
            const questionTypeList = questionTypes.map(qt => qt.questionSubject);
            return res.status(200).json({ status: 1, data: questionTypes });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    async deletequestionsubject(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await QuestionSubjectSchema.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            return res.status(200).json({ status: 1, message: "questionsubject deleted successfully" });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    // now subjects are universal so not make tutorexam subject
    // async tutorexamsubject(req, res, next) {
    //     try {
    //         const { error } = TutorExamSubjectValidatorSchema.validate(req.body);
    //         if (error) {
    //             return res.status(400).json({ status: 0, "error": error.message });
    //         }
    //         // console.log({ token: req.body.token });
    //         let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
    //         if (rec_token === null || !rec_token.token) {
    //             return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
    //         }

    //         const { subject, subSubjects } = req.body;

    //         const data = await TutorExamSubjectSchema.findOne({ subject: subject });

    //         if (!data) {
    //             try {
    //                 let document = await TutorExamSubjectSchema.create({
    //                     subject,
    //                     subSubjects
    //                 });
    //                 await document.save();
    //             } catch (err) {
    //                 return res.status(500).json({ status: 0, message: "Internal Server Error!" });
    //             }
    //             return res.status(200).json({ status: 1, message: "Data create successfully" });
    //         } else {
    //             try {

    //                 data.subject = subject;
    //                 data.subSubjects = subSubjects;

    //                 await data.save();
    //                 // let document = await TutorExamSubjectSchema.findByIdAndUpdate({ _id: data._id }, {
    //                 //     subject,
    //                 //     subSubjects
    //                 // }, { new: true });
    //                 // await document.save();
    //             } catch (err) {
    //                 return res.status(500).json({ status: 0, message: "Internal Server Error!" });
    //             }
    //             return res.status(200).json({ status: 1, message: "Data updated successfully" });
    //         }
    //     } catch (err) {
    //         return res.status(500).json({ status: 0, message: "Internal Server Error!" });
    //     }
    // },
    // async gettutorexamsubject(req, res, next) {
    //     try {
    //         const tutorexamsubjects = await TutorExamSubjectSchema.find({}, 'subject');

    //         if (!tutorexamsubjects || tutorexamsubjects.length === 0) {
    //             return res.status(400).json({ status: 0, error: "No tutorexamsubjects Found!" });
    //         }
    //         const questionTypeList = tutorexamsubjects.map(qt => qt.subject);
    //         return res.status(200).json({ status: 1, data: questionTypeList });
    //     } catch (error) {
    //         console.log("error - ", error);
    //         return res.status(400).json({ status: 0, error: "Internal Server Error!" });
    //     }
    // },


    /*verified tutors*/
    async verifiedtutor(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TutorRegisterSchema.aggregate([
                {
                    $match: {
                        // isVerified: true,
                        status: 3
                    }
                },
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "result"
                    }
                },
                {
                    $lookup: {
                        from: "TutorSubjects",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "subject"
                    }
                },
                {
                    $lookup: {
                        from: "TutorWallet",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "wallet"
                    }
                },
                {
                    $project: {
                        updatedAt: 1,
                        name: {
                            $first: "$result.name"
                        },
                        email: 1,
                        mobileNo: {
                            $first: "$result.mobileNo"
                        },
                        subjects: {
                            $first: "$subject.subjects"
                        },
                        balance: {
                            $first: "$wallet.totalAmount"
                        }
                    }
                }
            ])
            if (!document) {
                return res.status(400).json({ status: 0, error: "tutor not found" });
            }
            return res.status(200).json({ status: 1, document });
        } catch (err) {

            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    // Warning tutors
    async warningtutor(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TutorRegisterSchema.aggregate([
                // {
                //     $match: {
                //         // isSuspended: true,
                //         status: 4
                //     }
                // },
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "result"
                    }
                },
                {
                    $lookup: {
                        from: "TutorSubjects",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "subject"
                    }
                },
                {
                    $lookup: {
                        from: "TutorWallet",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "wallet"
                    }
                },
                {
                    $lookup: {
                        from: "TutorQuestions",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "ques"
                    }
                },
                {
                    $project: {
                        name: {
                            $first: "$result.name"
                        },
                        email: 1,
                        mobileNo: {
                            $first: "$result.mobileNo"
                        },
                        subjects: {
                            $first: "$subject.subjects"
                        },
                        balance: {
                            $first: "$wallet.totalAmount"
                        },
                        warningQuestions: { $size: "$ques.warningquestionId" }
                    }
                },
                {
                    $match: {
                        warningQuestions: { $gt: 0 }
                    }
                }
            ])
            if (!document) {
                return res.status(400).json({ status: 0, error: "tutor not found" });
            }
            return res.status(200).json({ status: 1, document });
        } catch (err) {

            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    // unverified tutors
    async unverifiedtutor(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TutorRegisterSchema.aggregate([
                {
                    $match: {
                        // isVerified: false
                        status: 2
                    }
                },
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "result"
                    }
                },
                {
                    $lookup: {
                        from: "TutorSubjects",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "subject"
                    }
                },
                {
                    $lookup: {
                        from: "TutorWallet",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "wallet"
                    }
                },
                {
                    $project: {
                        name: {
                            $first: "$result.name"
                        },
                        email: 1,
                        mobileNo: {
                            $first: "$result.mobileNo"
                        },
                        subjects: {
                            $first: "$subject.subjects"
                        },
                        balance: {
                            $first: "$wallet.totalAmount"
                        }
                    }
                }
            ])
            if (!document) {
                return res.status(400).json({ status: 0, error: "tutor not found" });
            }
            return res.status(200).json({ status: 1, document });
        } catch (err) {

            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async suspendtutordetails(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TutorRegisterSchema.aggregate([
                {
                    $match: {
                        // isVerified: true,
                        status: 5
                    }
                },
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "result"
                    }
                },
                {
                    $lookup: {
                        from: "TutorSubjects",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "subject"
                    }
                },
                {
                    $lookup: {
                        from: "TutorWallet",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "wallet"
                    }
                },
                {
                    $project: {
                        updatedAt: 1,
                        suspensionEndDate: 1,
                        name: {
                            $first: "$result.name"
                        },
                        email: 1,
                        mobileNo: {
                            $first: "$result.mobileNo"
                        },
                        subjects: {
                            $first: "$subject.subjects"
                        },
                        balance: {
                            $first: "$wallet.totalAmount"
                        },
                        daysRemaining: {
                            $dateDiff: {
                                startDate: "$uspensionEndDate",
                                endDate: "$$NOW",
                                unit: "month"
                            }
                        }
                       
                    }
                }
            ])
            if (!document) {
                return res.status(400).json({ status: 0, error: "tutor not found" });
            }
            // let daysRemainingString;
            let tutordetails;
            let tutor = [];
            let tutors = await document.map(value => {
                const expiresAt = moment(value.suspensionEndDate);
                const daysRemaining = Math.max(Math.floor(expiresAt.diff(moment(), 'days')), 0);
                const daysRemainingString = daysRemaining > 0 ? `${daysRemaining} days` : `0 days`;

                tutordetails = {
                    _id: value._id,
                    email: value.email,
                    updatedAt: value.updatedAt,
                    name: value.name,
                    mobileNo: value.mobileNo,
                    subjects: value.subjects,
                    balance: value.balance,
                    // expiresAt: job.expiresAt,
                    daysRemaining: daysRemainingString,
                };
                tutor.push(tutordetails);

            });
            return res.status(200).json({ status: 1, document: tutor });
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    // Trial tutors
    async trialtutor(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TutorRegisterSchema.aggregate([
                {
                    $match: {
                        // isVerified: false
                        status: 1
                    }
                },
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "result"
                    }
                },
                {
                    $lookup: {
                        from: "TutorSubjects",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "subject"
                    }
                },
                {
                    $lookup: {
                        from: "TutorWallet",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "wallet"
                    }
                },
                {
                    $project: {
                        name: {
                            $first: "$result.name"
                        },
                        email: 1,
                        mobileNo: {
                            $first: "$result.mobileNo"
                        },
                        subjects: {
                            $first: "$subject.subjects"
                        },
                        balance: {
                            $first: "$wallet.totalAmount"
                        }
                    }
                }
            ])
            if (!document) {
                return res.status(400).json({ status: 0, error: "tutor not found" });
            }
            return res.status(200).json({ status: 1, document });
        } catch (err) {

            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async tutordetails(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            console.log(req.params.id);
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TutorRegisterSchema.aggregate([
                {
                    $match: {
                        _id: ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "result"
                    }
                },
                {
                    $lookup: {
                        from: "TutorBankDetails",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "bankdetails"
                    }
                },
                {
                    $lookup: {
                        from: "TutorSubjects",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "subject"
                    }
                },
                {
                    $lookup: {
                        from: "TutorWallet",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "wallet"
                    }
                },
                {
                    $project: {
                        email: 1,
                        referralHistory: { $size: "$referralHistory" },
                        profilephoto: {
                            $first: "$result.profilephoto"
                        },
                        name: {
                            $first: "$result.name"
                        },
                        mobileNo: {
                            $first: "$result.mobileNo"
                        },
                        bankdetails: {
                            $first: "$bankdetails"
                        },
                        subjects: {
                            $first: "$subject.subjects"
                        },
                        earning: {
                            $first: "$wallet.earningAmount"
                        },
                        paid: {
                            $first: "$wallet.paidAmount"
                        },
                        balance: {
                            $first: "$wallet.totalAmount"
                        }
                    }
                }
            ])
            for (var i = 0; i < document.length; i++) {

            if (document[i].profilephoto) {
                const tutorimage = await TutorImageSchema.find({
                    _id: { $in: document[i].profilephoto }
                });

                const timage = await tutorimage.map((image) => {
                    return `data:${image.contentType};base64,${image.data.toString("base64")}`;
                })
                document[i].profilephoto = timage;
            }
        }

            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            return res.status(200).json({ status: 1, document });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async tutortransactiondetails(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TutorWalletSchema.findOne({ tutorId: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, message: "no data found" });
            }
            let transactiondetails = {};
            let transaction = [];
            document.walletHistory.map((value) => {
                transactiondetails = {
                    date: value.date,
                    amount: value.amount,
                    balance: value.balance,
                }
                transaction.push(transactiondetails);
            })
            return res.status(200).json({ status: 1, transaction });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async tutorquestionanswer(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            // const ques = await TutorQuestionsSchema.findOne({tutorId:req.params.id});

            // const question = ques.allQuestions
            // .filter((q)=> q.status === "Answered");
            // const pipeline = [
            //     { $match: { tutorId: ObjectId(req.params.id), 'allQuestions.status': 'Answered' } },
            //     { $unwind: '$allQuestions' },
            //     { $match: { 'allQuestions.status': 'Answered' } },
            //   ];

            //   const document = await TutorQuestionsSchema.aggregate(pipeline);

            let { limit, skip } = req.query;
            limit = parseInt(limit) || 10; // Default limit is 10
            skip = parseInt(skip) || 0; // Default skip is 0


            const document = await TutorQuestionsSchema.aggregate([
                {
                    $match: {
                        tutorId: ObjectId(req.params.id),
                        'allQuestions.status': 'Answered'
                    }
                },
                { $unwind: '$allQuestions' },
                { $match: { 'allQuestions.status': 'Answered' } },
                {
                    $lookup: {
                        from: "MainQuestions",
                        localField: "allQuestions.questionId",
                        foreignField: "_id",
                        as: "mainquestion"
                    }
                },
                { $unwind: '$mainquestion' },
                {
                    $lookup: {
                        from: "Image",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['_id', '$allQuestions.questionphoto'],
                                    },
                                },
                            },
                        ],

                        as: "image"
                    }
                },
                {
                    $lookup: {
                        from: "StudentInformation",
                        localField: "mainquestion.studentId",
                        foreignField: "userId",
                        as: "student"
                    }
                },
                {
                    $project: {
                        // "allQuestions.question":1,
                        // "allQuestions.questionType":1,
                        // "allQuestions.questionSubject":1,
                        // questionPhoto:{
                        //     $first: "$allQuestions.questionPhoto"
                        // },
                        // "allQuestions.tutorPrice":1,
                        // "allQuestions.status":1,
                        // "allQuestions.answer":1,
                        // "allQuestions.explanation":1,
                        "allQuestions": 1,
                        student: {
                            $first: "$student.name"
                        },
                        "stats": 1
                        
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ])

            if (!document) {
                return res.status(400).json({ status: 0, error: "Question not found" });
            }
            // const document = await TutorQuestionsSchema.aggregate([
            //   {
            //     $match: {
            //       tutorId: ObjectId(req.params.id), // replace with the tutor ID you want to filter by
            //     },
            //   },
            //   {
            //     $lookup: {
            //       from: 'MainQuestions',
            //       localField: 'allQuestions.questionId',
            //       foreignField: '_id',
            //       as: 'mainQuestion',
            //     },
            //   },
            //   {
            //     $match: {
            //     //   'mainQuestion.answered': true,
            //       'mainQuestion.tutorId': ObjectId(req.params.id), // same tutor ID filter as the first match stage
            //       'allQuestions.status': 'Answered', // filter for allQuestions with status "answered"
            //     },
            //   },
            // //   {
            // //         $project: {
            // //           _id: 0,
            // //           allQuestions: 1,
            // //           studentName: {
            // //                 $arrayElemAt: ['$mainQuestion.studentId', 0],
            // //               },
            // //         //   "mainQuestion.studentId":1
            // //         //   studentName: {
            // //         //     $arrayElemAt: ['$studentInfo.name', 0],
            // //         //   },
            // //         //   questionPhotos: '$questionPhotos',
            // //         },
            // //       },
            //   {
            //     $project: {
            //       studentId: {
            //         $arrayElemAt: ['$mainQuestion.studentId', 0],
            //       },
            //       questionphoto: '$allQuestions.questionPhoto', // include the questionphoto field from allQuestions
            //     },
            //   },
            //   {
            //     $lookup: {
            //       from: 'StudentInformation',
            //       localField: 'studentId',
            //       foreignField: 'userId',
            //       as: 'studentInfo',
            //     },
            //   },
            // //   {
            // //     $lookup: {
            // //       from: 'Image',
            // //       let: { questionphoto: '$questionphoto' },
            // //       pipeline: [
            // //         {
            // //           $match: {
            // //             $expr: {
            // //               $in: ['$_id', '$$questionphoto'],
            // //             },
            // //           },
            // //         },
            // //       ],
            // //       as: 'questionPhotos',
            // //     },
            // //   },
            //   {
            //     $project: {
            //       _id: 0,
            //       studentId: 1,
            //       studentName: {
            //         $arrayElemAt: ['$studentInfo.name', 0],
            //       },
            //       questionPhotos: '$questionPhotos',
            //     },
            //   },
            // ])
            for (var i = 0; i < document.length; i++) {
                console.log(document[i].allQuestions.questionPhoto)
                const image = await ImageSchema.find({
                    _id: { $in: document[i].allQuestions.questionPhoto }
                });
                const imageUrls = await image.map((image) => {
                    return `data:${image.contentType};base64,${image.data.toString("base64")}`;
                })
                document[i].allQuestions.questionPhoto = imageUrls
            }

            return res.status(200).json({ status: 1, message: document });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async tutorsinfo(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            const document = await TutorRegisterSchema.aggregate([
                {
                    $match: {
                        _id: ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "personaldetails"
                    }
                },
                {
                    $lookup: {
                        from: "TutorBankDetails",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "bankdetails"
                    }
                },
                {
                    $lookup: {
                        from: "TutorProfessional",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "professionaldetails"
                    }
                },
                {
                    $project: {
                        email: 1,
                        referralHistory: 1,
                        personaldetails: {
                            $first: "$personaldetails"
                        },
                        professionaldetails: {
                            $first: "$professionaldetails"
                        },
                        // mobileNo:{
                        //     $first: "$result.mobileNo"
                        // },
                        bankdetails: {
                            $first: "$bankdetails"
                        }

                    }
                }
            ])

            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            for (var i = 0; i < document.length; i++) {

                const image = await TutorDocumentSchema.find({
                    _id: { $in: document[i].professionaldetails.degree_image }
                });

                const imageUrls = await image.map((image) => {
                    return `data:${image.contentType};base64,${image.data.toString("base64")}`;
                })

                if (document[i].personaldetails.profilephoto) {
                    const tutorimage = await TutorImageSchema.find({
                        _id: { $in: document[i].personaldetails.profilephoto }
                    });

                    const timage = await tutorimage.map((image) => {
                        return `data:${image.contentType};base64,${image.data.toString("base64")}`;
                    })
                    document[i].professionaldetails.degree_image = imageUrls;
                    document[i].personaldetails.profilephoto = timage;
                }
            }
            return res.status(200).json({ status: 1, document });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async tutorspayment(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let { isPaymentDone } = req.query;
            
            const latestRecord = TutorsPaymentSchema.findOne({}, {}, { sort: { 'enddate' : -1 } }).exec();
            latestRecord.then((latestDoc) => {
                console.log(latestDoc);
                let condition = {
                    startdate: { $ne: latestDoc.startdate },
                    enddate: { $ne: latestDoc.enddate },
                };

                if(req.query.isPaymentDone !== undefined) {
                    condition['transaction.isPaymentDone'] = req.query.isPaymentDone;
                }

                TutorsPaymentSchema.find(
                condition, (err, docs) => {
                if (err) {
                    console.error(err);
                   return res.status(500).json({ status: 0, error: "Internal Server Error" });
                } else {
                    let transaction = [];

                       // output: "31 May"
                    for( var i = 0; i < docs.length; i++){

                        // let startDate = docs[i].startdate;
                        // let endDate = docs[i].enddate;
                        // const dateEnd = docs[i].enddate;
                        // console.log(endDate);
                        // let document = {
                        //     startdate: docs[i].startdate,
                        //     enddate: endDate
                        // }

                        let startDate = docs[i].startdate;
                        let endDate = new Date(docs[i].enddate); // create new Date object from string
                        // const dateEnd = endDate;
                        let document = {
                            startdate: docs[i].startdate,
                            // enddate: endDate,
                            originalEndDate: docs[i].enddate // add original end date property
                        }
                        // console.log(endDate);
                        endDate.setDate(endDate.getDate() - 1);
                        // console.log(endDate);
                        let startOptions = { day: 'numeric', month: 'short' };
                        let endOptions = { day: 'numeric', month: 'short' };

                        let dateFormatter = new Intl.DateTimeFormat('en-US', startOptions);
                        let startDateString = dateFormatter.format(startDate);

                        dateFormatter = new Intl.DateTimeFormat('en-US', endOptions);
                        let endDateString = dateFormatter.format(endDate);

                        let date = `${startDateString} to ${endDateString}`;
                        console.log(startDateString); // output: "15 May"
                        console.log(endDateString);
                        // let document = {
                        //     date:date,
                        //     startdate: docs[i].startdate,
                        //     enddate: docs[i].enddate,
                        //     transaction: docs[i].transaction
                        // }
                        document["_id"] = docs[i]._id;
                        document["date"] = date;
                        document["transaction"] = docs[i].transaction;
                        transaction.push(document);
                        // console.log(docs[i].startdate);
                    }   
                    
                    return res.status(200).json({ status: 1, transaction });
                }
                });
            });
        
            // const document = await TutorRegisterSchema.aggregate([
            //     {
            //         $lookup: {
            //             from: "TutorPersonal",
            //             localField: "_id",
            //             foreignField: "tutorId",
            //             as: "result"
            //         }
            //     },
            //     {
            //         $lookup: {
            //             from: "TutorBankDetails",
            //             localField: "_id",
            //             foreignField: "tutorId",
            //             as: "bankdetails"
            //         }
            //     },
            //     {
            //         $lookup: {
            //             from: "TutorWallet",
            //             localField: "_id",
            //             foreignField: "tutorId",
            //             as: "wallet"
            //         }
            //     },
            //     {
            //         $project: {
            //             email: 1,
            //             // referralHistory:1,
            //             name: {
            //                 $first: "$result.name"
            //             },
            //             bankdetails: {
            //                 $first: "$bankdetails"
            //             },
            //             balance: {
            //                 $first: "$wallet.availableAmount"
            //             }
            //         }
            //     }
            // ])
            // if (!document) {
            //     return res.status(400).json({ status: 0, error: "data not found" });
            // }

            // let aa = [];
            // for (var i = 0; i < document.length; i++) {
            //     console.log(document[i])
            //     const minbalance = await TutorMinBalanceSchema.findOne();

            //     if (!minbalance) {
            //         return res.status(400).json({ status: 0, error: "min balance not found" });

            //     }
            //     console.log(document[i].balance)
            //     document[i].balance = document[i].balance - parseInt(minbalance.minBalance);

            //     if (document[i].balance > 0) {
            //         var documents = {
            //             email: document[i].email,
            //             name: document[i].name,
            //             bankdetails: document[i].bankdetails,
            //             balance: document[i].balance

            //         }
            //         aa.push(documents);
            //     }
            // }

            // return res.status(200).json({ status: 1, info: aa });
        } catch (err) {
            console.log(err)
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async tutorpayment(req, res, next) {
        try {
            const { error } = AdminTutorPaymentValidatotSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { balance,  } = req.body;
            let id = new ObjectId(req.body.paymentId);
            
            let document = await TutorWalletSchema.findOne({ tutorId: req.params.id });

            if (!document) {
                return res.status(400).json({ status: 0, error: "wallet not found" });
            }

            let tutorIds = await TutorsPaymentSchema.findOne({
                $and: [
                    { "transaction.tutorId": req.params.id },
                    { "transaction.isPaymentDone": 1 } // condition to satisfy
                ]
            });
            console.log(tutorIds);

            if (tutorIds) {
                return res.status(400).json({ status: 0, error: "tutor payment already successfull" });
            }
            // const minbalance = await TutorMinBalanceSchema.findOne();
            // if (!minbalance) {
            //     return res.status(400).json({ status: 0, error: "min balance not found" });
            // }
            // if (document.availableAmount === (minbalance.minBalance + parseInt(balance))) {

                document.availableAmount = document.availableAmount - parseInt(balance);
                document.totalAmount = document.availableAmount + document.pendingAmount;
                console.log(document.availableAmount);

                const transaction = {
                    transactionId: await generateTransactionId(),
                    date: new Date(),
                    type: "Withdrawal",
                    amount: balance,
                    description: new Date(),
                    status: "Success",
                    balance: document.availableAmount
                };
                let name;
                let tutorname = await TutorPersonalSchema.findOne({ tutorId: document.tutorId });
                name = "tutor"
                if (tutorname) {
                    name = tutorname.name
                }
                const centraltransaction = {
                    category: "Tutor",
                    walletId: document._id,
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
                    category: "Tutor",
                    walletId: document._id,
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

                let tutorpayment = await TutorsPaymentSchema.findOne({_id: id });
                if(!tutorpayment){
                    return res.status(400).json({ status: 0, error: "tutor payment not found" });
                }
                tutorpayment.pendingAmount -= parseInt(balance);
                tutorpayment.paidAmount += parseInt(balance)
                
                let tutorPayment = await TutorsPaymentSchema.findOneAndUpdate(
                    { _id: id, "transaction.tutorId": req.params.id },
                    { $set: { 
                        "transaction.$.amount": parseInt(balance),
                        "transaction.$.isPaymentDone": 1,
                        "transaction.$.howMuchPaymentDone": parseInt(balance), 
                        "transaction.$.isPaymentCompleted": 1
                    } },
                    { new: true }
                );
                
                if (!tutorPayment) {
                    return res.status(404).json({ status: 0, message: "Tutor payment not found" });
                }

                await tutorpayment.save();
                await centaltransactiondetails.save();
                document.walletHistory.unshift(transaction);
                await document.save();

                const tutor = await TutorRegisterSchema.findOne({ _id: req.params.id });
                if(!tutor){
                    return res.status(400).json({ status: 0, error: "tutor not found" });
                }
                const emailContent = tutorpaymentTemplate();

                    const subject = "DoubtQ - Payment Withdrawal Successful"
                    let emailsent = await emailSender(subject, emailContent, tutor.email);

                    if (emailsent === "Email sent") {
                        // const message = "New Password Sent to Mail Successfully.";
                        console.log(emailsent);
                        // return res.status(200).json({ status: 1, message });
                    } else {
                        const error = "Mail Sending was Unsuccessful.";
                        console.log(error);
                        // return res.status(401).json({ status: 0, error });
                    }
                
            // }
            return res.status(200).json({ status: 1, message: "tutor payment successfully" });
            
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async tutorminbalance(req, res, next) {
        try {
            const { error } = TutorminbalanceValidatorSchema.validate(req.body);
            if (error) {
                res.status(400).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            const { minBalance } = req.body;

            const data = await TutorMinBalanceSchema.findOne();

            if (!data) {
                const document = await TutorMinBalanceSchema.create({
                    minBalance
                });
                await document.save();
                return res.status(200).json({ status: 1, message: "Min balance create successfully" });
            } else {
                data.minBalance = minBalance;
                await data.save();
                return res.status(200).json({ status: 1, message: "Min balance updated successfully" });
            }
        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async tutorallinfo(req, res, next) {
        try {

            upload(req, res, async (err) => {
                if (err) {

                    return res.status(500).json({ status: 0, "error": err });
                }
                // console.log(req);
                console.log(req.body);
                console.log(req.files);
                const { error } = AdmintutorpersonalValidatorSchema.validate(req.body);
                if (error) {
                    return res.json({ status: 0, "error": error.message });
                }

                let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
                if (rec_token === null || !rec_token.token) {
                    return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
                }
                // const { error } = AdmintutorprofessionalValidatorSchema.validate(req.body);
                // if (error) {
                //     return res.status(500).json({ status: 0, "error": error.message });
                // }
                var user;
                var imageId;
                // console.log(req.files)
                if (req.files !== undefined && req.files.profilephoto) {
                    const img = new TutorImageSchema();
                    img.name = req.files.profilephoto[0].filename;
                    img.data = fs.readFileSync(req.files.profilephoto[0].path);
                    img.contentType = req.files.profilephoto[0].mimetype;
                    const image = await img.save();

                    fs.unlinkSync(req.files.profilephoto[0].path);
                    // console.log(image);
                    // const impr = await Promise.all(image);
                    imageId = image._id;
                }

                const { name, mobileNo, country, gender, dob, experience } = req.body;

                let tutorpersonalinfo = await TutorPersonal.fetchById({ tutorId: req.params.id });
                if (!tutorpersonalinfo) {
                    return res.status(400).json({ status: 0, error: "tutor not found" });
                }
                if (req.files !== undefined && req.files.profilephoto && !tutorpersonalinfo.profilephoto === "") {
                    const data = await TutorImageSchema.deleteOne({ _id: tutorpersonalinfo.profilephoto });
                }
                user = await TutorPersonalSchema.findByIdAndUpdate(tutorpersonalinfo._id, {
                    profilephoto: req.files !== undefined ? (req.files.profilephoto ? imageId : tutorpersonalinfo.profilephoto) : tutorpersonalinfo.profilephoto,
                    name,
                    mobileNo,
                    country,
                    gender,
                    dob,
                    experience
                }, { new: true });

                await user.save();
                // var aa = await TutorPersonal.create(user);


                // Save the uploaded image to the Image schema
                if (req.files !== undefined && req.files.degree_image) {
                    const img = new TutorDocumentSchema();
                    img.name = req.files.degree_image[0].filename;
                    img.data = fs.readFileSync(req.files.degree_image[0].path);
                    img.contentType = req.files.degree_image[0].mimetype;
                    const image = await img.save();
                    fs.unlinkSync(req.files.degree_image[0].path);
                    // console.log(image);
                    // const impr = await Promise.all(image);
                    imageId = image._id;
                }


                const { degree_choice, degree, degree_specialisation, clg_name, clg_city, gpa } = req.body;

                let tut_info = await TutorProfessional.fetchById({ tutorId: req.params.id });

                if (!tut_info) {
                    return res.status(400).json({ status: 0, error: "tutor not found" });
                }
                if (req.files !== undefined && req.files.degree_image) {
                    await TutorDocumentSchema.deleteOne({ _id: tut_info.degree_image });
                }
                user = await TutorProfessionalSchema.findByIdAndUpdate(tut_info._id, {
                    degree_choice,
                    ...(req.files !== undefined && req.files.degree_image && { degree_image: imageId }),
                    degree,
                    degree_specialisation,
                    clg_name,
                    clg_city,
                    gpa
                }, { new: true });

                await user.save();
                // var aa = await TutorProfessional.create(user);
                // console.log(aa); 
                const { Tutorbankname, bankcountry, bankName, accountNumber, IFSCCode, accountType, panCard } = req.body;

                var tut_bank = await TutorBankDetailsSchema.findOne({ tutorId: req.params.id });
                console.log(tut_bank);

                if (!tut_bank) {
                    return res.status(400).json({ status: 0, error: "bank details not found" });
                }
                var tut_bank1 = await TutorBankDetailsSchema.findByIdAndUpdate(tut_bank._id, {
                    bankcountry,
                    Tutorbankname,
                    bankName,
                    accountNumber,
                    IFSCCode,
                    accountType,
                    panCard
                }, { new: true });
                console.log(tut_bank1);
                return res.status(200).json({ status: 1, message: "data updated successfully" });

            })
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async students(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            const document = await StudentRegisterSchema.aggregate([
                {
                    $lookup: {
                        from: "StudentInformation",
                        localField: "_id",
                        foreignField: "userId",
                        as: "studentinformation"
                    }
                },
                {
                    $lookup: {
                        from: "StudentQuestions",
                        localField: "_id",
                        foreignField: "studentId",
                        as: "studentquestions"
                    }
                },
                { $unwind: "$studentquestions" },
                {
                    $lookup: {
                        from: "StudentWallet",
                        localField: "_id",
                        foreignField: "studentId",
                        as: "studentwallet"
                    }
                },
                {
                    $sort: {
                      createdAt: -1 // 1 for ascending order or -1 for descending order
                    }
                },
                {
                    $project: {
                        email: 1,
                        mobileNo: 1,
                        name: {
                            $ifNull: [ { $first: "$studentinformation.name" }, "Student" ]
                        },
                        questions: {
                            $size: "$studentquestions.allQuestions"
                        },
                        // mobileNo:{
                        //     $first: "$result.mobileNo"
                        // },
                        balance: {
                            $first: "$studentwallet.availableAmount"
                        },
                        createdAt: 1
                    }
                }
            ])
            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            return res.status(200).json({ status: 1, document });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async studentdetails(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            console.log(req.params.id);
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            // const document = await StudentRegisterSchema.aggregate([
            //     {
            //         $match:{
            //             _id: ObjectId(req.params.id)
            //         }
            //     },
            //     {
            //         $lookup: {
            //           from: "StudentInformation",
            //           localField: "_id",
            //           foreignField: "userId",
            //           as: "studentinformation"
            //         }
            //     },
            //     { $unwind: "$studentinformation"},
            //     {
            //         $lookup: {
            //           from: "StudentWallet",
            //           localField: "_id",
            //           foreignField: "studentId",
            //           as: "studentwallet"
            //         }
            //     },
            //     {
            //         $project:{
            //             email:1,
            //             mobileNo:1,
            //             name:{
            //                 $first: "$studentinformation.name"
            //             },
            //             referralHistory: {
            //                 // $cond: {
            //                 //     if: { $eq: [ { $size: "$studentinformation.referralHistory" }, 0 ] },
            //                 //     then: 0,
            //                 //     else: { $size: "$studentinformation.referralHistory" }
            //                 // }
            //                 $size: "$studentinformation.referralHistory"
            //             },                
            //             balance:{
            //                 $first: "$studentwallet.availableAmount"
            //             },

            //         }
            //     }
            // ])
            const document = await StudentRegisterSchema.aggregate([
                {
                    $match: {
                        _id: ObjectId(req.params.id)
                    }
                },
                {
                    $lookup: {
                        from: "StudentInformation",
                        localField: "_id",
                        foreignField: "userId",
                        as: "studentinformation"
                    }
                },
                { $unwind: "$studentinformation" },
                {
                    $lookup: {
                        from: "StudentWallet",
                        localField: "_id",
                        foreignField: "studentId",
                        as: "studentwallet"
                    }
                },
                { $unwind: "$studentwallet" },
                {
                    $project: {
                        email: 1,
                        mobileNo: 1,
                        name: "$studentinformation.name",
                        referralHistory: { $size: "$studentinformation.referralHistory" },
                        paid: "$studentwallet.paidAmount",
                        deposit: "$studentwallet.depositAmount",
                        refferal: "$studentwallet.referralAmount",
                        balance: "$studentwallet.availableAmount",

                    }
                }
            ])
            if (!document) {
                return res.status(400).json({ status: 0, error: "student not found" });
            }
            return res.status(200).json({ status: 1, document });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async studenttransactiondetails(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await StudentWalletSchema.findOne({ studentId: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, message: "no data found" });
            }
            let transactiondetails = {};
            let transaction = [];
            document.walletHistory.map((value) => {
                transactiondetails = {
                    date: value.date,
                    amount: value.amount,
                    balance: value.balance,
                }
                transaction.push(transactiondetails);
            })
            return res.status(200).json({ status: 1, transaction });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async studentquestionanswer(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let { limit, skip } = req.query;
            limit = parseInt(limit) || 10; // Default limit is 10
            skip = parseInt(skip) || 0; // Default skip is 0


            const document = await StudentQuestionsSchema.aggregate([
                {
                    $match: {
                        studentId: ObjectId(req.params.id)
                    }
                },
                { $unwind: '$allQuestions' },
                // { $match: { 'allQuestions.status': 'Answered' } },
                {
                    $lookup: {
                        from: "MainQuestions",
                        localField: "allQuestions.questionId",
                        foreignField: "_id",
                        as: "mainquestion"
                    }
                },
                { $unwind: '$mainquestion' },
                {
                    $lookup: {
                        from: "Image",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['_id', '$allQuestions.questionphoto'],
                                    },
                                },
                            },
                        ],

                        as: "image"
                    }
                },
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "mainquestion.tutorId",
                        foreignField: "tutorId",
                        as: "tutor"
                    }
                },
                {
                    $project: {
                        // "allQuestions.question":1,
                        // "allQuestions.questionType":1,
                        // "allQuestions.questionSubject":1,
                        // questionPhoto:{
                        //     $first: "$allQuestions.questionPhoto"
                        // },
                        // "allQuestions.tutorPrice":1,
                        // "allQuestions.status":1,
                        // "allQuestions.answer":1,
                        // "allQuestions.explanation":1,
                        "allQuestions": 1,
                        answer: "$mainquestion.answer",
                        explanation: "$mainquestion.explanation",
                        reanswer: "$mainquestion.reAnswer",
                        reexplanation: "$mainquestion.reExplanation",
                        newreason: "$mainquestion.newReason",
                        newReasonText: "$mainquestion.newReasonText",
                        tutor: {
                            $first: "$tutor.name"
                        }
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }

            ])
            for (var i = 0; i < document.length; i++) {
                // console.log(document[i].allQuestions.questionPhoto)
                const image = await ImageSchema.find({
                    _id: { $in: document[i].allQuestions.questionPhoto }
                });
                const imageUrls = await image.map((image) => {
                    return `data:${image.contentType};base64,${image.data.toString("base64")}`;
                })
                document[i].allQuestions.questionPhoto = imageUrls
            }
            if (!document) {
                return res.status(400).json({ status: 0, error: "Question not found" });
            }

            return res.status(200).json({ status: 1, message: document });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    // admin add new question
    async adminquestion(req, res, next) {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    console.log(err);
                    return res.status(400).json({ status: 0, error: err });
                }

                const { error } = AdminQuestionPostValidator.validate(req.body);
                if (error) {
                    return res.status(400).json({ status: 0, "error": error.message });
                }
                // console.log({ token: req.body.token });
                let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
                if (rec_token === null || !rec_token.token) {
                    return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
                }

                // console.log(req);

                var st_id = new ObjectId("643fd4bc84b7c007143bf7e4");

                var que_pricing = await QuestionPricingSchema.findOne({ Type: req.body.questionType });

                if (!que_pricing) {
                    return res.status(400).json({ status: 0, message: 'Please enter correct Questiontype!' });
                }

                var price = await QuestionPriceInUsd(req.body.questionType);

                var typename = questionTypeName(req.body.questionType);

                // var st_wal = await StudentWalletSchema.findOne({ studentId: st_id });
                // console.log("student wallet - ", st_wal);

                // var limit = 0.25;
                // var compare = parseFloat(limit) + parseFloat(price);

                // console.log("wallet balance - ", st_wal.availableAmount);
                // console.log("compare - ", compare);

                // console.log(st_wal.availableAmount < compare);

                // if (st_wal.availableAmount < compare) {
                //     req.files.map(file => {

                //         // Delete the file from the local disk after it has been saved to the database
                //         fs.unlinkSync(file.path);

                //     });
                //     return res.status(400).json({status: 0, message: 'Your Balance is not Suffecient!' });
                // } else {
                //     st_wal.availableAmount -= parseFloat(price);
                //     st_wal.paidAmount += parseFloat(price);
                //     st_wal.availableAmount = Number.parseFloat(st_wal.availableAmount).toFixed(2);
                //     console.log("available - ", st_wal.availableAmount);
                //     st_wal.totalAmount = parseFloat(st_wal.availableAmount) + parseFloat(st_wal.redeemableAmount);
                //     st_wal.totalAmount = Number.parseFloat(st_wal.totalAmount).toFixed(2);
                //     console.log("total - ", st_wal.totalAmount);
                //     const transaction = {
                //         transactionId: await generateTransactionId(),
                //         date: new Date(),
                //         type: "Question posted",
                //         amount: parseFloat(price),
                //         description: `Payment for ${typename} question`,
                //         status: "Success",
                //         balance: st_wal.availableAmount
                //     };
                //     st_wal.walletHistory.unshift(transaction);
                //     await st_wal.save();



                // }
                var imageIds;
                if (req.files.questionPhoto) {



                    // Save the uploaded images to the Image schema
                    const imagePromises = req.files.questionPhoto.map(async file => {
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

                const { question, questionType, questionSubject, answer, explanation } = req.body;
                // console.log(req.file.filename);






                const now = new Date();
                // const oneDay = 24 * 60 * 60 * 1000;
                // const twoDays = 2 * oneDay;
                // const threeDays = 3 * oneDay;
                var mainque;
                if (req.files.questionPhoto) {
                    mainque = await MainQuestions.create({
                        question,
                        // questionPhoto: req.files.map(file => file.filename),
                        questionPhoto: imageIds,
                        questionType,
                        questionSubject,
                        answer,
                        explanation,
                        status: "Answered",
                        studentId: st_id,
                        questionPrice: price,
                        tutorPrice: que_pricing.tutor_price,
                        adminPrice: que_pricing.admin_price,
                        createdAt: now,
                        // onedayafter_tutor_end: new Date(now.getTime() + oneDay),
                        // twodayafter_admin_end: new Date(now.getTime() + twoDays),
                        // threedayafter_unsolved_end: new Date(now.getTime() + threeDays),
                        whomto_ask: "admin generated"
                    })
                } else {
                    mainque = await MainQuestions.create({
                        question,
                        // questionPhoto: req.files.map(file => file.filename),
                        // questionPhoto: imageIds,
                        questionType,
                        questionSubject,
                        answer,
                        explanation,
                        status: "Answered",
                        studentId: st_id,
                        questionPrice: price,
                        tutorPrice: que_pricing.tutor_price,
                        adminPrice: que_pricing.admin_price,
                        createdAt: now,
                        // onedayafter_tutor_end: new Date(now.getTime() + oneDay),
                        // twodayafter_admin_end: new Date(now.getTime() + twoDays),
                        // threedayafter_unsolved_end: new Date(now.getTime() + threeDays),
                        whomto_ask: "admin generated"
                    })
                }




                // console.log(mainque);

                // const questionId = mainque._id;

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
                // {new: true}, (error, result) => {
                //     if (error) {
                //         console.log("dsds");
                //         console.error(error);
                //         return;
                //     } else {
                //         console.log('Array of questions pushed:', result);
                //     }
                // });

                // sent to tutor

                // var new_status = await findTutorAndAssignQuestion(mainque);
                console.log(mainque)
                if (mainque) {
                    return res.status(200).json({ status: 1, message: "Question post successfully" });
                }
            })
            // end of sent to tutor

        } catch (error) {
            console.log("dfsd");
            console.log(error);
            return;
            // return next(error);
        }

    },
    // admin view all question
    async adminviewquestion(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { limit = 10, skip = 0 } = req.query;
            const questions = await MainQuestionsSchema.find()
                .limit(parseInt(limit))
                .skip(parseInt(skip))
                .sort({ createdAt: -1 });

            if (!questions || questions.length === 0) {
                return res.status(400).json({ status: 0, error: "No questions found!" });
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
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    // admin search question
    async adminsearchquestion(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { limit = 10, skip = 0, search } = req.query;

            // Build the search query
            const searchQuery = search
                ? { question: { $regex: search, $options: "i" } }
                : {};

            const questions = await MainQuestionsSchema.find(searchQuery)
                .limit(parseInt(limit))
                .skip(parseInt(skip))
                .sort({ createdAt: -1 });

            if (!questions || questions.length === 0) {
                return res.status(400).json({ status: 0, error: "No questions found!" });
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
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    // admin set tutor exam questions count
    async tutorexamdetail(req, res, next) {
        try {
            const { error } = AdminExamValidatorValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { MCQ, theory } = req.body;

            const old_schema = await TutorExamDetailsSchema.findOne();
            var new_sch;
            if (old_schema) {
                try {
                    new_sch = await TutorExamDetailsSchema.findByIdAndUpdate({ _id: old_schema._id }, {
                        MCQ,
                        theory
                    }, { new: true });

                } catch (err) {
                    return res.status(400).json({ error: "Internal Server Error" });
                }
                await new_sch.save();

                if (!new_sch) {
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }

                return res.status(200).json({ status: 1, message: "Tutorexam update successfully" });

            } else {
                try {
                    new_sch = await TutorExamDetailsSchema.create({
                        MCQ,
                        theory
                    });

                } catch (err) {
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }

                await new_sch.save();

                if (!new_sch) {
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "tutorexam create successfully" });

            }

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async gettutorexamdetail(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const old_schema = await TutorExamDetailsSchema.findOne({}, 'MCQ theory');

            if (!old_schema) {
                return res.status(400).json({ status: 0, error: "Internal Server Error" });
            }

            return res.status(200).json({ status: 1, data: old_schema });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    //
    async asktutorexamquestion(req, res, next) {
        try {

            const { error } = TutorExamQuestionValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { question, questionType, questionSubject, answer } = req.body;

            var ques;

            if (questionType === 'MCQ') {
                if (!req.body.mcqoptions) {
                    return res.status(400).json({ status: 0, error: "Please Enter MCQ Options!" });
                } else {
                    ques = await TutorExamQuestionsSchema.create({
                        question,
                        questionType,
                        mcqoptions: req.body.mcqoptions,
                        questionSubject,
                        answer
                    });
                }
            } else {

                ques = await TutorExamQuestionsSchema.create({
                    question,
                    questionType,
                    questionSubject,
                    answer
                });

            }
            await ques.save();

            return res.status(200).json({ status: 1, message: "question create successfully" });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async updatetutorexamquestion(req, res, next) {
        try {
            const { error } = UpdateTutorExamQuestionValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { question, questionSubject, answer } = req.body;
            // 
            const tutorexamquetion = await TutorExamQuestionsSchema.findOne({ _id: req.params.id });
            var ques;
            if (tutorexamquetion.questionType === 'MCQ') {
                if (!req.body.mcqoptions) {
                    return res.status(400).json({ status: 0, error: "Please Enter MCQ Options!" });
                } else {
                    ques = await TutorExamQuestionsSchema.findOneAndUpdate({ _id: req.params.id }, {
                        question,
                        mcqoptions: req.body.mcqoptions,
                        questionSubject,
                        answer
                    }, { new: true });
                    await ques.save();
                }
            } else {
                ques = await TutorExamQuestionsSchema.findOneAndUpdate({ _id: req.params.id }, {
                    question,
                    questionSubject,
                    answer
                }, { new: true });
            }
            await ques.save();

            return res.status(200).json({ status: 1, message: "question updated successfully" });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async deletetutorexamquestion(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }


            const que = await TutorExamQuestionsSchema.findOneAndRemove({ _id: req.params.id });
            if (!que) {
                return res.status(400).json({ status: 0, message: "Question Not Found!" });
            }
            return res.status(200).json({ status: 1, message: "tutor exam question delete successfully" });
        } catch (err) {

            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async gettutorexamquestion(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { questionSubject, questionType, limit = 10, skip = 0, search } = req.query;

            let conditions = {
                questionSubject: questionSubject || { $exists: true },
                questionType: questionType || { $exists: true }
            };

            if (search) {
                // Add a search condition based on the `question` field
                conditions.question = { $regex: search, $options: 'i' };
            }


            const tutorexamquestion = await TutorExamQuestionsSchema.find(conditions)
                .sort({ date: "desc" })
                .skip(parseInt(skip))
                .limit(parseInt(limit));

            return res.status(200).json({ status: 1, tutorexamquestion });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 0, message: "Internal server error" });
        }
    },
    // admin side api for allocating randomised question
    async randomizedtutorquestion(req, res, next) {
        try {
            const { error } = AdminRandomTutorExamQuestionsValidatorSchema.validate(req.body);
            if (error) {
                return res.status(500).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var tutorId = rec_token._id;

            const { subject } = req.body;

            var tutorsubjects = await TutorSubjectsSchema.findOne({ tutorId: tutorId });

            if (!tutorsubjects) {
                return res.status(400).json({ status: 0, error: "Tutor Subjects Not Found!" });
            }



            // Fetch the TutorExamDetails document for the input subject
            const examDetails = await TutorExamDetailsSchema.findOne();
            if (!examDetails) {
                return res.status(404).json({ status: 0, error: "No exam details found!" });
            }

            // Calculate the number of questions to select for each type
            const numMCQ = examDetails.MCQ;
            const numTheory = examDetails.theory;

            // Select random questions for each type and subject
            const mcqQuestions = await TutorExamQuestionsSchema.aggregate([
                { $match: { questionSubject: subject, questionType: 'MCQ' } },
                { $sample: { size: numMCQ } },
                {
                    $project: {
                        _id: 1,
                        question: 1,
                        mcqoptions: 1,
                        questionType: 1,
                        questionSubject: 1,
                        answer: ''
                    }
                } // Exclude the answer field from the result
            ]);

            if (mcqQuestions.length === 0) {
                return res.status(400).json({ status: 0, error: "No Mcq Questions Found!" });
            }

            const theoryQuestions = await TutorExamQuestionsSchema.aggregate([
                { $match: { questionSubject: subject, questionType: 'theory' } },
                { $sample: { size: numTheory } },
                {
                    $project: {
                        _id: 1,
                        question: 1,
                        questionType: 1,
                        questionSubject: 1,
                        answer: ''
                    }
                } // Exclude the answer field from the result
            ]);


            if (theoryQuestions.length === 0) {
                return res.status(400).json({ status: 0, error: "No Theory Questions Found!" });
            }

            // Combine the questions and send the response
            const questions = mcqQuestions.concat(theoryQuestions);
            return res.status(200).json({ status: 1, questions });


        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, message: "Internal Server Error!" });
        }
    },
    async tutorexamanswer(req, res, next) {
        try {
            const { error } = AdminTutorExamAnswersValidatorSchema.validate(req.body);
            if (error) {
                return res.status(500).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var tutorId = rec_token._id;

            const { subject, questions } = req.body;

            var mcqcount = 0, theorycount = 0;
            var mcqscore = 0;

            var new_ques = [];

            for (var i = 0; i < questions.length; i++) {
                if (questions[i].questionType === 'theory') {

                    theorycount++;
                    var que = await TutorExamQuestionsSchema.findById(questions[i]._id);

                    if (!que) {
                        return res.status(400).json({ status: 0, error: "Invalid Questions!" });
                    }

                    var data = {
                        _id: questions[i]._id,
                        question: questions[i].question,
                        questionType: questions[i].questionType,
                        questionSubject: questions[i].questionSubject,
                        tutorAnswer: questions[i].answer,
                        realAnswer: que.answer,
                        adminmarks: 0
                    }

                    // console.log(data);
                    new_ques.push(data);
                    // console.log(new_ques);

                } else {
                    mcqcount++;
                    var que = await TutorExamQuestionsSchema.findById(questions[i]._id);

                    if (!que) {
                        return res.status(400).json({ status: 0, error: "Invalid Questions!" });
                    }

                    if (que.answer === questions[i].answer) {
                        mcqscore++;
                    }
                }
            }

            var new_exam_data = await AdminTutorExamAnswersSchema.create({
                isDone: 0,
                veridict: 2,
                tutorId: tutorId,
                examSubject: subject,
                examDate: Date.now(),
                finalScore: 0,
                mcqScore: mcqscore,
                mcqTotal: mcqcount,
                theoryScore: 0,
                theoryTotal: theorycount,
                theoryQA: new_ques
            });

            if (!new_exam_data) {
                return res.status(400).json({ status: 0, error: "Internal Server Error!" });
            }

            await new_exam_data.save();

            var tut_sub = await TutorSubjectsSchema.findOne({ tutorId });

            if (!tut_sub) {
                return res.status(400).json({ status: 0, error: "Tutor Subjects Not Found!" });
            }

            var data = {
                subject: subject,
                examId: new_exam_data._id,
                date: Date.now(),
                result: 2
            }

            tut_sub.examGiven.unshift(data);

            await tut_sub.save();

            var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(tutorId, {
                internalStatus: 2
            }, { new: true });

            return res.status(200).json({ status: 1, error: "Your Exam Response Sent Successfully, Please Complete Other Subjects Exams if remaining, You will get Email Rearding Results and next Process." });


        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    async admintutorexamverify(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            // var data = await AdminTutorExamAnswersSchema.find({ isDone: 0 });
            var data = await AdminTutorExamAnswersSchema.aggregate([
                {
                    $match: { isDone: 0 }
                },
                {
                    $lookup: {
                        from: 'TutorRegister',
                        localField: 'tutorId',
                        foreignField: '_id',
                        as: 'tutorRegister'
                    }
                },
                {
                    $lookup: {
                        from: 'TutorPersonal',
                        localField: 'tutorId',
                        foreignField: 'tutorId',
                        as: 'tutorPersonal'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        tutorId: 1,
                        isDone: 1,
                        examSubject: 1,
                        veridict: 1,
                        examDate: 1,
                        finalScore: 1,
                        mcqScore: 1,
                        mcqTotal: 1,
                        theoryScore: 1,
                        theoryTotal: 1,
                        theoryQA: 1,
                        email: { $first: '$tutorRegister.email' },
                        name: { $first: '$tutorPersonal.name' },
                        mobileNo: { $first: '$tutorPersonal.mobileNo' }
                    }
                }
            ]);

            return res.status(200).json({ status: 1, data });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    async AdminTutorExamResponse(req, res, next) {
        try {
            const { error } = AdminTutorExamResponseValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var { examId, tutorId, veridict, finalScore, mcqScore, theoryScore, theoryQA } = req.body;

            examId = new ObjectId(examId);
            tutorId = new ObjectId(tutorId);

            var new_exam_data = await AdminTutorExamAnswersSchema.findById(examId);

            if (!new_exam_data) {
                return res.status(400).json({ status: 0, error: "No Exam Found!" });
            }

            console.log("ver - ", veridict, Number.isInteger(veridict));

            if (veridict >= 1 && veridict < 0) {
                return res.status(400).json({ status: 0, error: "Wrong choise of veridict!" });
            }

            var subject;

            if (tutorId.equals(new_exam_data.tutorId)) {
                subject = new_exam_data.examSubject;
                new_exam_data.veridict = veridict;
                new_exam_data.finalScore = finalScore;
                new_exam_data.mcqScore = mcqScore;
                new_exam_data.theoryScore = theoryScore;
                new_exam_data.theoryQA = theoryQA;
                new_exam_data.isDone = 1;

                await new_exam_data.save();

                if (veridict === 1) {
                    var tutor_sub = await TutorSubjectsSchema.findOne({ tutorId: tutorId });

                    if (!tutor_sub) {
                        return res.status(400).json({ status: 0, error: "Tutor Subjects Not Found!" });
                    }

                    var dn = 0;

                    for (var i = 0; i < tutor_sub.examGiven.length; i++) {
                        if (examId.equals(tutor_sub.examGiven[i].examId)) {
                            tutor_sub.examGiven[i].result = 1;

                            tutor_sub.subjectsWithoutCooldown.push(subject);


                            // var tut_exam_sub = await TutorExamSubjectSchema.findOne({ subject: subject });

                            // if (!tut_exam_sub) {
                            //     return res.status(400).json({ status: 0, error: "No Subject Found!" });
                            // }

                            // var tut_sub = tut_exam_sub.subSubjects;

                            // i want to push tut_sub into tutor_sub.subjects but make sure no subject is repeated
                            // Push tut_sub into tutor_sub.subjects while ensuring there are no duplicates
                            // const existingSubjects = new Set(tutor_sub.subjects);
                            // tut_sub.forEach(subject => existingSubjects.add(subject));
                            // tutor_sub.subjects = Array.from(existingSubjects);
                            tutor_sub.subjects.push(subject);

                            await tutor_sub.save();


                            var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(tutorId, {
                                internalStatus: 3
                            }, { new: true });
                            dn = 1;

                           let tutor = await TutorRegisterSchema.findOneAndUpdate(
                                {'referralHistory.userId': tutorId },
                                { $set: { 'referralHistory.$.verified': true } },
                                { new: true });

                              if(!tutor) {
                               console.log("tutor not found");
                              }  

                            // mail to tutor about he/she passed the exam

                            const emailContent = tutorexampassTemplate();

                            const subject = "DoubtQ - You are passed the Exam";

                            let emailsent = await emailSender(subject, emailContent, tut_reg.email);

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

                            return res.status(200).json({ status: 1, message: "Exam Result Submitted Successfully." });

                        }
                    }

                    if (dn === 0) {
                        return res.status(400).json({ status: 0, error: "Exam Not Found!" });
                    }
                } else {
                    var tutor_sub = await TutorSubjectsSchema.findOne({ tutorId: tutorId });

                    if (!tutor_sub) {
                        return res.status(400).json({ status: 0, error: "Tutor Subjects Not Found!" });
                    }

                    var dn = 0;

                    for (var i = 0; i < tutor_sub.examGiven.length; i++) {
                        if (examId.equals(tutor_sub.examGiven[i].examId)) {
                            tutor_sub.examGiven[i].result = 0;

                            var data = {
                                subjectName: subject,
                                cooldownPeriod: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
                            }
                            tutor_sub.subjectsWithCooldown.push(data);

                            var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(tutorId, {
                                internalStatus: 2
                            }, { new: true });


                            dn = 1;

                            // mail to tutor about he/she failed the exam

                            
                            const emailContent = tutorexamfailTemplate();

                            const subject = "DoubtQ - You are failed the Exam";

                            let emailsent = await emailSender(subject, emailContent, tut_reg.email);

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

                            return res.status(200).json({ status: 1, message: "Exam Result Submitted Successfully." });

                        }
                    }

                    if (dn === 0) {
                        return res.status(400).json({ status: 0, error: "Exam Not Found!" });
                    }
                }

            } else {
                return res.status(400).json({ status: 0, error: "No Data Found!" });
            }
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    async socialmedia(req, res, next) {
        try {
            const { error } = AdminSocialMediaValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { Facebook, LinkedIn, Twitter, YouTube, Instagram } = req.body;
            var new_sch;
            const old_sch = await SocialMediaSchema.findOne();
            if (old_sch) {
                try {
                    new_sch = await SocialMediaSchema.findByIdAndUpdate({ _id: old_sch._id }, {
                        Facebook,
                        LinkedIn,
                        Twitter,
                        YouTube,
                        Instagram
                    }, { new: true });

                } catch (err) {
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                await new_sch.save();

                if (!new_sch) {
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "social media update successfully" });
            } else {
                try {
                    new_sch = await SocialMediaSchema.create({
                        Facebook,
                        LinkedIn,
                        Twitter,
                        YouTube,
                        Instagram
                    })
                } catch (err) {
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                await new_sch.save();

                if (!new_sch) {
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }

                return res.status(200).json({ status: 1, message: "social media create suceessfully" });
            }

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async getsocialmedia(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const questionTypes = await SocialMediaSchema.findOne();

            // if (!questionTypes || questionTypes.length === 0) {
            //     return res.status(400).json({ status: 0, error: "No QuestionTypes Found!" });
            // }
            // const questionTypeList = questionTypes.map(qt => qt.questionType);
            return res.status(200).json({ status: 1, data: questionTypes });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },

    async testimonial(req, res, next) {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(400).json({ status: 0, error: err });
                }

                const { error } = AdminTestimonialValidatorSchema.validate(req.body);
                if (error) {
                    if (req.files.profileimage) {
                        fs.unlinkSync(req.files.profileimage[0].path);
                    }
                    return res.status(400).json({ status: 0, "error": error.message });
                }

                let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
                if (rec_token === null || !rec_token.token) {
                    return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
                }
                // const { error } = AdmintutorprofessionalValidatorSchema.validate(req.body);
                // if (error) {
                //     return res.status(500).json({ status: 0, "error": error.message });
                // }
                // if (!req.files.profileimage) {
                //     return res.status(500).json({ status: 0, message: "please select image" });
                // }
                var user;
                var imageId;
                console.log(req.files)
                if (req.files.profileimage) {
                    const img = new TestimonialImageSchema();
                    img.name = req.files.profileimage[0].filename;
                    img.data = fs.readFileSync(req.files.profileimage[0].path);
                    img.contentType = req.files.profileimage[0].mimetype;
                    const image = await img.save();

                    fs.unlinkSync(req.files.profileimage[0].path);

                    // console.log(image);
                    // const impr = await Promise.all(image);
                    imageId = image._id;
                }

                const { sortOrder, name, description, status } = req.body;
                let data;
                if (req.body.id) {
                    var id = new ObjectId(req.body.id);
                    data = await TestimonialSchema.findById(id);
                }

                if (!data) {
                    if (!req.files.profileimage) {
                        return res.status(500).json({ status: 0, message: "please select image" });
                    }
                    const new_sch = await TestimonialSchema.create({
                        sortOrder,
                        profileimage: imageId,
                        name,
                        description,
                        isactive: status
                    })

                    await new_sch.save();

                    if (!new_sch) {
                        return res.status(400).json({ status: 0, error: "Internal Server Error" });
                    }
                    return res.status(200).json({ status: 1, message: "Testimonial create successfully" });
                } else {
                    try {
                        if (req.files.profileimage) {
                            const document = await TestimonialImageSchema.deleteOne({ _id: data.profileimage });
                        }
                        let document = await TestimonialSchema.findByIdAndUpdate({ _id: data._id }, {
                            sortOrder,
                            profileimage: imageId,
                            name,
                            description,
                            isactive: status
                        }, { new: true });

                        await document.save();
                    } catch (err) {
                        return res.status(500).json({ status: 0, message: "Internal Server Error!" });
                    }
                    return res.status(200).json({ status: 1, message: "Testimonial updated successfully" });
                }

            })
        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async destroytestimonial(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TestimonialSchema.findOneAndRemove({ _id: req.params.id });

            if (!document) {
                return res.status(400).json({ status: 0, error: "testimonial not found" });
            }

            await TestimonialImageSchema.deleteOne({ _id: document.profileimage });

            return res.status(200).json({ status: 1, message: "testimonial deleted successfully" });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async testimonialstatuschange(req, res, next) {
        try {
            const { error } = AdminTestimonialStatusValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { status } = req.body;

            const testimonial = await TestimonialSchema.findByIdAndUpdate({ _id: req.params.id }, {
                isactive: status
            }, { new: true });

            await testimonial.save();
            if (!testimonial) {
                return res.status(400).json({ status: 0, error: "testimonial not found" });
            }

            return res.status(200).json({ status: 1, message: "status updated successfully" });

        } catch (err) {
            return res.status(200).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async gettestimonial(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let document = await TestimonialSchema.find();


            if (!document) {
                return res.status(400).json({ status: 0, error: "testimonials not found" });
            }
            let testimonial = [];

            for (var i = 0; i < document.length; i++) {
                // console.log(document[i].profileimage);
                const image = await TestimonialImageSchema.find({
                    _id: { $in: document[i].profileimage }
                });
                // console.log(image);
                // const imageUrls = await image.map((image) => {
                //     return `data:${image.contentType};base64,${image.data.toString("base64")}`;
                // })
                const imageUrls = `data:${image[0].contentType};base64,${image[0].data.toString("base64")}`;
                // console.log(imageUrls);
                document[i].profileimage = imageUrls;
                let testimonialdata = {
                    id: document[i]._id,
                    sortOrder: document[i].sortOrder,
                    profileimage: imageUrls,
                    name: document[i].name,
                    description: document[i].description,
                    isactive: document[i].isactive
                }
                testimonial.push(testimonialdata);
            }

            return res.status(200).json({ status: 1, testimonial });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    

    async coupon(req, res, next) {
        try {
            const { error } = AdminStudentCouponValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { couponCode, validityDate, discount } = req.body;

            var old_sch;
            if (req.body.id) {

                var aid = new ObjectId(req.body.id);
                old_sch = await StudentCouponSchema.findById(aid);

            }
            var new_sch;
            if (old_sch) {
                try {
                    new_sch = await StudentCouponSchema.findByIdAndUpdate({ _id: old_sch._id }, {
                        couponCode,
                        validityDate,
                        discount
                    }, { new: true });

                } catch (err) {
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                await new_sch.save();

                if (!new_sch) {
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "coupon update successfully" });
            }

            try {
                new_sch = await StudentCouponSchema.create({
                    couponCode,
                    validityDate,
                    discount
                });

            } catch (err) {
                return res.status(400).json({ status: 0, error: "Internal Server Error" });
            }
            await new_sch.save();

            if (!new_sch) {
                return res.status(500).json({ status: 0, error: "Internal Server Error" });
            }
            return res.status(200).json({ status: 1, message: "coupon create successfully" });
        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async getcoupons(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var doc = await StudentCouponSchema.find({}, '_id couponCode validityDate discount');

            return res.status(200).json({ status: 1, data: doc });
        } catch (error) {
            console.log("Error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },

    async destroycoupon(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await StudentCouponSchema.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            return res.status(200).json({ status: 1, message: "coupon deleted successfully" });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async cms(req, res, next) {
        try {
            const { error } = AdminCMSValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { sortOrder, pageName, contentText, metaTitle, metaKeyword, metaDescription, status } = req.body;

            var old_sch;
            if (req.body.id) {
                var aid = new ObjectId(req.body.id);
                old_sch = await CMSSchema.findById(aid);
            }
            var new_sch;
            if (old_sch) {
                try {
                    new_sch = await CMSSchema.findByIdAndUpdate({ _id: old_sch._id }, {
                        sortOrder,
                        pageName,
                        contentText,
                        metaTitle,
                        metaKeyword,
                        metaDescription,
                        isactive: status
                    }, { new: true });

                } catch (err) {
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                await new_sch.save();

                if (!new_sch) {
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "CMS update successfully" });
            } else {
                try {
                    new_sch = await CMSSchema.create({
                        sortOrder,
                        pageName,
                        contentText,
                        metaTitle,
                        metaKeyword,
                        metaDescription,
                        isactive: status
                    })

                } catch (err) {
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }

                await new_sch.save();

                if (!new_sch) {
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }

                return res.status(200).json({ status: 1, message: "CMS create successfully" });
            }

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async destroycms(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await CMSSchema.findOneAndRemove({ _id: req.params.id });

            if (!document) {
                return res.status(400).json({ status: 0, error: "CMS not found" });
            }
            return res.status(200).json({ status: 1, message: "CMS deleted successfully" });
        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async cmsstatuschange(req, res, next) {
        try {

            const { error } = AdminCMSStatusValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { status } = req.body;

            const cms = await CMSSchema.findByIdAndUpdate({ _id: req.params.id }, {

                isactive: status

            }, { new: true });

            if (!cms) {
                return res.status(400).json({ status: 0, error: "CMS not found" });
            }
            return res.status(200).json({ status: 1, message: "status successfully" });
        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async adminwallet(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { category, type, limit = 10, skip = 0 } = req.query;

            const transactions = await CentralTransactionsSchema.find({
                category: category || { $exists: true },
                type: type || { $exists: true },
            })
                .sort({ date: "desc" })
                .skip(parseInt(skip))
                .limit(parseInt(limit));

            res.status(200).json({ status: 1, transactions });
        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 0, message: "Internal server error" });
        }
    },
    async fetchTransactionHistory(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, error: error.message });
            }

            const { category, walletId, type = '', limit = 10, skip = 0 } = req.query;

            const query = {
                category,
                walletId: walletId ? walletId : { $exists: true },
                type: type ? type : { $exists: true }, // Include all documents if type is not provided
            };

            const transactions = await CentralTransactionsSchema.find(query)
                .sort({ date: -1 }) // Sort by date in descending order
                .skip(parseInt(skip))
                .limit(parseInt(limit));

            return res.status(200).json({ status: 1, transactions });


        } catch (error) {
            console.error(error);
            res.status(500).json({ status: 0, message: "Internal server error" });
        }
    },


    // async centraldbfeed(req, res, next) {

    //     var cnt = 0;
    //         await TutorWalletSchema.find({}, (err, tutorWallets) => {
    //         if (err) {
    //           console.error(err);
    //           return;
    //         }

    //         tutorWallets.forEach((tutorWallet) => {
    //           const transactions = tutorWallet.walletHistory.map((transaction) => {
    //                 cnt++;
    //           });


    //         });
    //       });

    //       // Query the StudentWallet collection and insert the relevant transactions into the CentralTransactions collection
    //       await StudentWalletSchema.find({}, (err, studentWallets) => {
    //         if (err) {
    //           console.error(err);
    //           return;
    //         }

    //         studentWallets.forEach((studentWallet) => {
    //           const transactions = studentWallet.walletHistory.map((transaction) => {
    //             cnt++;
    //           });


    //         });
    //       });

    //       return res.status(200).json({cnt});

    // },

    async tutorspaymentdetails(req, res, next) {
        try {
            const document = await TutorRegisterSchema.aggregate([
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "result"
                    }
                },
                {
                    $lookup: {
                        from: "TutorBankDetails",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "bankdetails"
                    }
                },
                {
                    $lookup: {
                        from: "TutorWallet",
                        localField: "_id",
                        foreignField: "tutorId",
                        as: "wallet"
                    }
                },
                {
                    $unwind: "$wallet"
                },
                {
                    $unwind: "$wallet.walletHistory"
                },
                {
                    $match: { 'wallet.walletHistory.type': { $in: ['Answer given', 'Referral'] } }
                },
                {
                    $project: {
                        email: 1,
                        // referralHistory:1,
                        name: {
                            $first: "$result.name"
                        },
                        bankdetails: {
                            $first: "$bankdetails"
                        },
                        // balance: {
                        //     $first: "$wallet.availableAmount"
                        // },
                        wallet: "$wallet.walletHistory.type",
                        total: {
                            $sum: "$wallet.walletHistory.amount"
                        }

                    }
                }
            ])
            if (!document) {
                return res.status(400).json({ status: 0, error: "data not found" });
            }

            return res.status(200).json({ status: 1, message: document });

        } catch (err) {
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async getcms(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let document = await CMSSchema.find();


            if (!document) {
                return res.status(400).json({ status: 0, error: "cms not found" });
            }
            return res.status(200).json({ status: 1, document });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async tutpay(req, res, next) {
        try {
            let { startDate, endDate } = req.query;

            let today = new Date();
            let date = today.getDate();
            let month = today.getMonth();
            let year = today.getFullYear();

            console.log(today);

            if (date >= 1 && date < 15) {
                startDate = `${year}-${month + 1}-01`;
                endDate = today;
                console.log(new Date("2023-05-20").getMonth() + 1)
                console.log(startDate);

            } else if (date >= 15) {
                startDate = `${year}-${month + 1}-15`;
                endDate = today;
                // console.log(startDate)
            }
            const tutorRegisters = await TutorRegisterSchema.find();
            const tutorDetails = await Promise.all(tutorRegisters.map(async (tutorRegister) => {
                const tutorPersonal = await TutorPersonalSchema.findOne({ tutorId: tutorRegister._id });
                const tutorBankDetails = await TutorBankDetailsSchema.findOne({ tutorId: tutorRegister._id });
                const tutorWallet = await TutorWalletSchema.findOne({ tutorId: tutorRegister._id, 'walletHistory.date': { $gte: new Date(startDate), $lte: new Date(endDate) } });
                if (!tutorWallet) return null;
                const amount = tutorWallet.walletHistory.reduce((acc, curr) => {
                    if (curr.type === 'Answer given' || curr.type === 'Referral' && curr.date >= new Date(startDate) && curr.date <= new Date(endDate)) {
                        return acc + curr.amount;
                    }
                    return acc;

                }, 0);
                console.log(amount)
                // const referralAmount = tutorWallet.walletHistory.reduce((acc, curr) => {
                //     if (curr.type === 'Referral' && curr.date >= new Date(startDate) && curr.date <= new Date(endDate)) {
                //         return acc + curr.amount;
                //     }
                //     return acc;
                // }, 0);
                return {
                    tutorId: tutorRegister._id,
                    email: tutorRegister.email,
                    name: tutorPersonal ? tutorPersonal.name : "",
                    bankcountry: tutorBankDetails ? tutorBankDetails.bankcountry : "",
                    Tutorbankname: tutorBankDetails ? tutorBankDetails.Tutorbankname : "",
                    bankName: tutorBankDetails ? tutorBankDetails.bankName : "",
                    accountNumber: tutorBankDetails ? tutorBankDetails.accountNumber : "",
                    IFSCCode: tutorBankDetails ? tutorBankDetails.IFSCCode : "",
                    accountType: tutorBankDetails ? tutorBankDetails.accountType : "",
                    panCard: tutorBankDetails ? tutorBankDetails.panCard : "",
                    totalAmount: tutorWallet.totalAmount,
                    availableAmount: tutorWallet.availableAmount,
                    pendingAmount: tutorWallet.pendingAmount,
                    earningAmount: tutorWallet.earningAmount,
                    paidAmount: tutorWallet.paidAmount,
                    amount
                    // answerGivenAmount,
                    // referralAmount,
                };
            }));
            // console.log(tutorDetails)
            const sortedTutorDetails = tutorDetails.filter((tutorDetail) => tutorDetail !== null).sort((a, b) => b.amount - a.amount);
            for (var i = 0; i < sortedTutorDetails.length; i++) {
                console.log(sortedTutorDetails[i].tutorId);
                let transaction = {
                    tutorId: sortedTutorDetails[i].tutorId,
                    email: sortedTutorDetails[i].email,
                    name: sortedTutorDetails[i].name,
                    bankdetails: [{
                        bankcountry: sortedTutorDetails[i].bankcountry,
                        Tutorbankname: sortedTutorDetails[i].Tutorbankname,
                        bankName: sortedTutorDetails[i].bankName,
                        accountNumber: sortedTutorDetails[i].accountNumber,
                        IFSCCode: sortedTutorDetails[i].IFSCCode,
                        accountType: sortedTutorDetails[i].accountType,
                        panCard: sortedTutorDetails[i].panCard
                    }],
                    price: sortedTutorDetails[i].amount
                }
                const tutorspayment = await TutorsPaymentSchema.findOne({ "transaction.tutorId": sortedTutorDetails[i].tutorId });
                console.log(tutorspayment);
                if (tutorspayment) {
                    console.log(tutorspayment.startdate >= startDate, tutorspayment.enddate, endDate);
                    if (tutorspayment.startdate >= startDate && tutorspayment.enddate <= endDate) {
                        console.log(startDate);
                        tutorspayment.startdate = startDate;
                        tutorspayment.enddate = endDate,
                            tutorspayment.pendingAmount = sortedTutorDetails[i].pendingAmount,
                            tutorspayment.paidAmount = sortedTutorDetails[i].paidAmount,
                            tutorspayment.transaction = transaction

                        await tutorspayment.save();
                    }
                } else {
                    console.log(startDate);
                    const tutorpayment = await TutorsPaymentSchema.create({
                        startdate: startDate,
                        enddate: endDate,
                        pendingAmount: sortedTutorDetails[i].pendingAmount,
                        paidAmount: sortedTutorDetails[i].paidAmount,
                        transaction: transaction
                    });
                    await tutorpayment.save();
                }
            }
            // let transaction = {
            //     email: sortedTutorDetails.email,
            //     name: sortedTutorDetails.name,
            //     bankdetails:[{
            //         bankcountry: sortedTutorDetails.bankcountry,
            //         Tutorbankname: sortedTutorDetails.Tutorbankname,
            //         bankName: sortedTutorDetails.bankName,
            //         accountNumber: sortedTutorDetails.accountNumber,
            //         IFSCCode: sortedTutorDetails.IFSCCode,
            //         accountType: sortedTutorDetails.accountType,
            //         panCard: sortedTutorDetails.panCard
            //     }]
            // }
            var tutpayment

            // const tutorspayment = await TutorsPaymentSchema.findOne({startdate: startDate , endDate : endDate})
            // if(tutorspayment){
            //     try{
            //         tutpayment = await TutorsPaymentSchema.findByIdAndUpdate({ _id: tutorspayment._id },{
            //             startdate: startDate,
            //             enddate: endDate,
            //             pendingAmount: sortedTutorDetails.pendingAmount,
            //             paidAmount: sortedTutorDetails.paidAmount,
            //             transaction: transaction,
            //             price: sortedTutorDetails.amount
            //         },{ new: true });
            //     }catch(err){

            //         return res.status(500).json({ status: 0, error: "Internal Server Error"});
            //     }
            //     if(!tutpayment){
            //         return res.status({ status: 0, error: "Internal Server Error"});
            //     }
            //     await tutpayment.save();

            //     return res.json({ status: 1, success: true, data: sortedTutorDetails });

            // }else{
            //     try{
            //         tutpayment = await TutorsPaymentSchema.create({
            //             startdate: startDate,
            //             enddate: endDate,
            //             pendingAmount: sortedTutorDetails.pendingAmount,
            //             paidAmount: sortedTutorDetails.paidAmount,
            //             transaction: transaction,
            //             price: sortedTutorDetails.amount
            //         })
            //     }catch(err){
            //         console.log(err);
            //         return res.status(500).json({ status: 0, error: "Internal Server Error"});
            //     }
            //     if(!tutpayment){
            //         return res.status(400).json({ status: 0, error: "Internal Server Error"});
            //     }
            //     await tutpayment.save();

            //    return res.json({ status: 1, success: true, data: sortedTutorDetails });

            // }
            res.json({ success: true, data: sortedTutorDetails });


        } catch (error) {
            console.error(error);
            res.status(500).json({ success: false, error: 'Internal server error' });
        }
    },

    async adminquestions(req, res, next) {
        try {

            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { questionType, questionSubject, whomto_ask, limit = 10, skip = 0 } = req.query;

            let conditions = {
                whomto_ask: whomto_ask
            };

            if (req.query.questionType) {
                conditions.questionType = questionType;
            }

            if (req.query.questionSubject) {
                conditions.questionSubject = questionSubject;
            }
            if (whomto_ask === "tutor") {
                conditions.$or = [{ internalStatus: "AssignedWithFindResponse" }, { internalStatus: "AssignedWithResponse" }];
            } else if (whomto_ask === "unsolved") {
                conditions.internalStatus = "";
            } else if (whomto_ask === "reanswer") {
                conditions.$or = [{ internalStatus: "AssignedWithFindResponse" }, { internalStatus: "AssignedWithResponse" }];
            }

            let transactions = await MainQuestionsSchema.find(conditions)
                .sort({ createdAt: "desc" })
                .limit(limit)
                .skip(skip)

            for (var i = 0; i < transactions.length; i++) {
                const image = await ImageSchema.find({
                    _id: { $in: transactions[i].questionPhoto }
                });
                const imageUrls = await image.map((image) => {
                    return `data:${image.contentType};base64,${image.data.toString("base64")}`;
                })
                transactions[i].questionPhoto = imageUrls
            }

            return res.status(200).json({ status: 1, transactions });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 0, message: "Internal server error" });
        }
    },

    async sendanswer(req, res, next) {
        try {
            const { error } = AdminSendAnswerValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            const { answer, explanation } = req.body;

            var questionId = new ObjectId(req.body.questionId);

            var tut_id = new ObjectId("645a3d393c2be9170643a1e5");

            var ans_cnt;

            var question = await MainQuestionsSchema.findById(questionId);

            if (question) {

                var tut_q = await TutorQuestionsSchema.findOne({ tutorId: tut_id });

                ans_cnt = tut_q.answeredquestions;


                var tut_wal = await TutorWalletSchema.findOne({ tutorId: tut_id })

                var reanswerchoice = await ReAnswerChoiceSchema.findOne();
                // console.log(reanswerchoice);
                reanswerchoice = reanswerchoice.choice;
                var typename = questionTypeName(question.questionType);
                var question = await MainQuestionsSchema.findById(questionId);
                if (question.whomto_ask === 'reanswer') {
                    question.reAnswer = answer;
                    question.reExplanation = explanation;
                    question.internalStatus = "Answered";
                    question.status = "Closed";
                    question.whomto_ask = "";
                    question.paymentGoesTo = tut_id;

                    await question.save();

                    tut_wal.availableAmount += parseFloat(question.tutorPrice);
                    tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);
                    tut_wal.earningAmount += parseFloat(question.tutorPrice);

                    const transaction = {
                        transactionId: await generateTransactionId(),
                        questionId: question._id,
                        date: new Date(),
                        type: "Answer given",
                        amount: parseFloat(question.tutorPrice),
                        description: `Payment for ${typename} question`,
                        status: "Success",
                        balance: tut_wal.availableAmount
                    };
                    let name;
                    // let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
                    name = "Tutor Admin";
                    // if (tutorname) {
                    //     name = tutorname.name;
                    // }

                    const centraltransaction = {
                        category: "Tutor",
                        walletId: tut_wal._id,
                        transactionId: transaction.transactionId,
                        name: name,
                        date: transaction.date,
                        type: transaction.type,
                        questionId: transaction.questionId,
                        amount: transaction.amount,
                        description: transaction.description,
                        status: transaction.status,
                        balance: transaction.balance
                    }

                    const centaltransactiondetails = await CentralTransactionsSchema.create({
                        category: "Tutor",
                        walletId: tut_wal._id,
                        transactionId: transaction.transactionId,
                        name: name,
                        date: transaction.date,
                        type: transaction.type,
                        questionId: transaction.questionId,
                        amount: transaction.amount,
                        description: transaction.description,
                        status: transaction.status,
                        balance: transaction.balance
                    })
                    if (!centaltransactiondetails) {
                        return res.status(400).json({ status: 0, error: "central transaction not created!" });
                    }
                    await centaltransactiondetails.save();

                    tut_wal.walletHistory.unshift(transaction);
                    await tut_wal.save();

                } else {
                    var mainque = await MainQuestionsSchema.findByIdAndUpdate(questionId, {
                        answer,
                        explanation,
                        internalStatus: "Answered",
                        // status: "NotAnswered",
                        status: reanswerchoice === true ? "NotOpened" : "Closed",
                        paymentGoesTo: tut_id
                    });

                    if (!mainque) {
                        return next(CustomErrorHandler.somethingwrong());
                    }
                    if (reanswerchoice) {
                        tut_wal.pendingAmount += parseFloat(question.tutorPrice);
                    } else {
                        tut_wal.availableAmount += parseFloat(question.tutorPrice);
                        tut_wal.earningAmount += parseFloat(question.tutorPrice);
                    }
                    tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);

                    const transaction = {
                        transactionId: await generateTransactionId(),
                        questionId: question._id,
                        date: new Date(),
                        type: "Answer given",
                        amount: parseFloat(question.tutorPrice),
                        description: `Payment for ${typename} question`,
                        status: reanswerchoice ? "Pending" : "Success",
                        balance: tut_wal.availableAmount
                    };
                    let name;
                    // let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
                    name = "TutorAdmin";
                    // if (tutorname) {
                    //     name = tutorname.name
                    // }

                    const centraltransaction = {
                        category: "Tutor",
                        walletId: tut_wal._id,
                        transactionId: transaction.transactionId,
                        name: name,
                        date: transaction.date,
                        type: transaction.type,
                        questionId: transaction.questionId,
                        amount: transaction.amount,
                        description: transaction.description,
                        status: transaction.status,
                        balance: transaction.balance
                    }

                    const centaltransactiondetails = await CentralTransactionsSchema.create({
                        category: "Tutor",
                        walletId: tut_wal._id,
                        transactionId: transaction.transactionId,
                        name: name,
                        date: transaction.date,
                        type: transaction.type,
                        questionId: transaction.questionId,
                        amount: transaction.amount,
                        description: transaction.description,
                        status: transaction.status,
                        balance: transaction.balance
                    })
                    if (!centaltransactiondetails) {
                        return res.status(400).json({ status: 0, error: "central transaction not created!" });
                    }
                    await centaltransactiondetails.save();

                    tut_wal.walletHistory.unshift(transaction);
                    await tut_wal.save();
                }



                var tutor = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                    questionassigned: false
                }, { new: true });

                if (!tutor) {
                    return next(CustomErrorHandler.somethingwrong());
                }

                StudentQuestionsSchema.updateOne(
                    { "allQuestions.questionId": mainque._id },
                    {
                        $set: {
                            "allQuestions.$.status": reanswerchoice === true ? "NotOpened" : "Closed",
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

                // tutor payment is remaining is done in above status change portion

            } else {
                return res.status(401).json({ status: 0, message: "UnAuthorised Question!" })
            }

            const message = "Answer Submitted Successfully.";
            return res.status(200).json({ status: 1, message });

        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 0, message: "Internal server error" });
        }
    },

    async dashboardstats(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const today = new Date();
            const last7Days = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
            const last30Days = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

            const studentRegistrations = {
                today: await StudentRegisterSchema.countDocuments({ createdAt: { $gte: today.setHours(0, 0, 0, 0) } }),
                last7Days: await StudentRegisterSchema.countDocuments({ createdAt: { $gte: last7Days.setHours(0, 0, 0, 0) } }),
                last30Days: await StudentRegisterSchema.countDocuments({ createdAt: { $gte: last30Days.setHours(0, 0, 0, 0) } })
            };

            const tutorRegistrations = {
                today: await TutorRegisterSchema.countDocuments({ createdAt: { $gte: today.setHours(0, 0, 0, 0) } }),
                last7Days: await TutorRegisterSchema.countDocuments({ createdAt: { $gte: last7Days.setHours(0, 0, 0, 0) } }),
                last30Days: await TutorRegisterSchema.countDocuments({ createdAt: { $gte: last30Days.setHours(0, 0, 0, 0) } }),
                trialTutors: await TutorRegisterSchema.countDocuments({ status: 1 }),
                unverifiedTutors: await TutorRegisterSchema.countDocuments({ status: 2 }),
                verifiedTutors: await TutorRegisterSchema.countDocuments({ status: 3 })
            };

            const questionsAsked = {
                today: await MainQuestionsSchema.countDocuments({ createdAt: { $gte: today.setHours(0, 0, 0, 0) } }),
                last7Days: await MainQuestionsSchema.countDocuments({ createdAt: { $gte: last7Days.setHours(0, 0, 0, 0) } }),
                last30Days: await MainQuestionsSchema.countDocuments({ createdAt: { $gte: last30Days.setHours(0, 0, 0, 0) } })
            };

            const unsolvedQuestions = {
                today: await MainQuestionsSchema.countDocuments({ status: 'unsolved', createdAt: { $gte: today.setHours(0, 0, 0, 0) } }),
                last7Days: await MainQuestionsSchema.countDocuments({ status: 'unsolved', createdAt: { $gte: last7Days.setHours(0, 0, 0, 0) } }),
                last30Days: await MainQuestionsSchema.countDocuments({ status: 'unsolved', createdAt: { $gte: last30Days.setHours(0, 0, 0, 0) } })
            };

            const answeredQuestions = {
                today: await MainQuestionsSchema.countDocuments({ status: 'Answered', createdAt: { $gte: today.setHours(0, 0, 0, 0) } }),
                last7Days: await MainQuestionsSchema.countDocuments({ status: 'Answered', createdAt: { $gte: last7Days.setHours(0, 0, 0, 0) } }),
                last30Days: await MainQuestionsSchema.countDocuments({ status: 'Answered', createdAt: { $gte: last30Days.setHours(0, 0, 0, 0) } })
            };

            const totalMoneyReceived = await CentralTransactionsSchema.aggregate([
                { $match: { type: 'Deposit' } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);



            const totalMoneyDistributed = await CentralTransactionsSchema.aggregate([
                { $match: { type: { $in: ['Withdrawal', 'Refund', 'Partial Refund', 'Answer given', 'Referral'] } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            const totalMoneyGet = await CentralTransactionsSchema.aggregate([
                { $match: { type: { $in: ['Question posted', 'Partial Charge'] } } },
                { $group: { _id: null, total: { $sum: '$amount' } } }
            ]);

            const totalEarnings = parseInt(84) * parseFloat(totalMoneyGet.total) - parseInt(totalMoneyDistributed.total);

            const dashboardStats = {
                studentRegistrations,
                tutorRegistrations,
                questionsAsked,
                unsolvedQuestions,
                answeredQuestions,
                totalMoneyReceived,
                totalMoneyDistributed,
                totalMoneyGet,
                totalEarnings
            };

            return res.status(200).json({ status: 1, dashboardStats });



        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 0, message: "Internal server error" });
        }
    },

    async multipleadmin(req, res, next) {
        try {
            const { error } = MultipleAdminValidatorSchema.validate(req.body);
            if (error) {
                return res.json({ status: 0, "error": error.message });
            }
            let { username, email, role, isactive, mainpassword } = req.body;

            const id = new ObjectId("63f84ae9533919067d5a0989")

            const admin = await AdminSchema.findById(id);
            if (!admin) {
                return res.status(400).json({ status: 0, error: "Admin not found" });
            }
            const match = await bcrypt.compare(mainpassword, admin.password);
            // if(!match) return next(CustomErrorHandler.wrongCredential());
            if (!match) {
                return res.status(400).json({ status: 0, "error": "Please Write correct password!" });
            }
            let old_sch;
            if (req.body.id) {
                let newadminid = new ObjectId(req.body.id);
                old_sch = await AdminSchema.findById(newadminid)
            }

            if (!old_sch) {
                var user;
                if(!req.body.password){
                    return res.status(500).json({ status: 0, error: "Please enter password!"});
                }
                const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
                const hashedPassword = await bcrypt.hash(req.body.password, salt);
                req.body.password = hashedPassword;
                try{
                    user = new AdminSchema({
                        username,
                        email,
                        password: req.body.password,
                        role,
                        isactive,
                        isdeletable: 1
                    });
                } catch (err) {
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }

                var aa = await Admin.create(user);
                // console.log(aa);

                if (!aa.error) {
                    // console.log(aa);
                    var message = "New Admin Registered Successfully.";
                    return res.status(200).json({ status: 1, message });
                    // res.json(aa);
                    // res.redirect("/student/home");
                } else {
                    return res.status(400).json({ status: 0, "error": aa.error });
                    // res.redirect("/student/register");
                }

            } else {
                var new_data;
                try{
                    if(req.body.password){
                        const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
                        const hashedPassword = await bcrypt.hash(req.body.password, salt);
                        req.body.password = hashedPassword;

                        new_data = await AdminSchema.findByIdAndUpdate(old_sch._id, { 
                            username,
                            email,
                            password: req.body.password,
                            role,
                            isactive
                        
                        }, { new: true })
                    }else{
                        new_data = await AdminSchema.findByIdAndUpdate(old_sch._id, { 
                            username,
                            email,
                            role,
                            isactive
                        
                        }, { new: true })
                    }
                    
                }catch(err){
                    console.log(err)
                    return res.status(500).json({ status: 0, error: "Internal Server Error"});
                }

                var aa = await new_data.save();
                if (!aa.error) {
                    // console.log(aa);
                    var message = "New Admin Updated Successfully.";
                    return res.status(200).json({ status: 1, message });
                    // res.json(aa);
                    // res.redirect("/student/home");
                } else {
                    return res.status(400).json({ status: 0, "error": aa.error });
                    // res.redirect("/student/register");
                }

                // const message = "New Admin updated Successfully.";
                // return res.status(200).json({ status: 1, message });
            }


        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error!" });
        }
    },

    async getmultipleadmin(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            // role are remaining
            let document = await AdminSchema.find({}, '-password -__v -isdeletable').populate('role', 'rolename -_id');
            if(!document){
                return res.status(400).json({ status: 0, error: "admin not found"});
            }

            return res.status(200).json({ status: 1, document });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async destroyadmin(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const admin = await AdminSchema.findById(new ObjectId(req.params.id));

            // const document = await AdminSchema.findOneAndRemove({ _id: req.params.id });

            if (!admin) {
                return res.status(400).json({ status: 0, error: "admin not found" });
            }
            if (admin.isdeletable === 0) {
                return res.status(400).json({ status: 0, error: "can't delete administrator!" });
            }
            // return res.status(200).json({ status: 0, admin }) ;
            const document = await AdminSchema.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, error: "admin not found" });
            }
            return res.status(200).json({ status: 1, message: "admin deleted successfully" });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async adminrole(req,res,next){
        try{
            const { error } =  AdminRoleValidatorSchema.validate(req.body);
            if (error) {
                return res.json({ status: 0, "error": error.message });
            }
            let { rolename, action, mainpassword } = req.body;

            const id = new ObjectId("63f84ae9533919067d5a0989")

            const admin =  await AdminSchema.findById(id);
            if(!admin){
                return res.status(400).json({ status: 0, error: "Admin not found"});
            }
            const match = await bcrypt.compare(mainpassword, admin.password);
            // if(!match) return next(CustomErrorHandler.wrongCredential());
            if (!match) {
                return res.status(400).json({ status: 0, "error": "Please Write correct password!" });
            }
            let old_sch;
            if( req.body.id){
                let newadminid = new ObjectId(req.body.id);
                old_sch = await AdminRoleSchema.findById(newadminid)
            }

            // const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
            //     const hashedPassword = await bcrypt.hash(password, salt);
            //     password = hashedPassword;

            if(!old_sch){
                var user;
                try{
                    user = await AdminRoleSchema.create({
                        rolename,
                        action,
                        isdeletable: 1
                    });
                }catch(err){
                   return res.status(500).json({ status: 0, error: "please enter different rolename"}); 
                }
                
                var aa = await user.save();
                // console.log(aa);

                if (aa) {
                    // console.log(aa);
                    var message = "Admin Role Created Successfully.";
                    return res.status(200).json({ status: 1, message });
                    // res.json(aa);
                    // res.redirect("/student/home");
                } else {
                    return res.status(400).json({ status: 0, "error": aa.error });
                    // res.redirect("/student/register");
                }

            }else{
                var new_data;
                try{
                     new_data = await AdminRoleSchema.findByIdAndUpdate(old_sch._id, { 
                        rolename,
                        action
                    }, { new: true })
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error"});
                }

                 var aa = await new_data.save();
                if (aa) {
                    // console.log(aa);
                    var message = "Admin Role Updated Successfully.";
                    return res.status(200).json({ status: 1, message });
                    // res.json(aa);
                    // res.redirect("/student/home");
                } else {
                    return res.status(400).json({ status: 0, "error": aa.error });
                    // res.redirect("/student/register");
                }
            // const message = "New Admin updated Successfully.";
            // return res.status(200).json({ status: 1, message });
            }
            
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error!"});
        }
    },

    async getadminrole(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            // role are remaining
            let document = await AdminRoleSchema.find({}, '-__v -isdeletable').populate('action');
            if(!document){
                return res.status(400).json({ status: 0, error: "admin role not found"});
            }
            
            return res.status(200).json({ status: 1, document });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
    },

    async getadminrolename(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            // role are remaining
            let document = await AdminRoleSchema.find({}, '-__v -isdeletable -action'); 
            if(!document){
                return res.status(400).json({ status: 0, error: "admin role not found"});
            }

            return res.status(200).json({ status: 1, data: document });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
    },
    async destroyadminrole(req,res,next){
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const admin = await AdminRoleSchema.findById(new ObjectId(req.params.id));
            
            // const document = await AdminSchema.findOneAndRemove({ _id: req.params.id });

            if (!admin) {
                return res.status(400).json({ status: 0, error: "admin role not found" });
            }
            if(admin.isdeletable === 0){
                return res.status(400).json({ status: 0, error: "can't delete administrator" });
            }
            // return res.status(200).json({ status: 0, admin }) ;
            const document = await AdminRoleSchema.findOneAndRemove({ _id: req.params.id });
            if (!document) {
                return res.status(400).json({ status: 0, error: "admin role not found" });
            }
            return res.status(200).json({ status: 1, message: "admin role deleted successfully" });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },


    async fakedata(req, res, next) {
        try {
            // Define the start and end dates for the transactions
            const startDate = new Date('2023-03-01');
            const endDate = new Date('2023-05-12');

            // Define the number of wallets for each category
            const numStudentWallets = 10;
            const numTutorWallets = 10;

            // Define the fixed wallet IDs for each category
            const studentWalletIds = [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
            ];

            const tutorWalletIds = [
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId(),
                new mongoose.Types.ObjectId()
            ];

            // Generate fake transactions for every day and for every type of transaction
            var transactions = [];
            let transactionId = 1;
            for (let date = startDate; date <= endDate; date.setDate(date.getDate() + 1)) {

                transactions = [];
                // Generate transactions for students
                for (let i = 0; i < numStudentWallets; i++) {
                    const walletId = studentWalletIds[i];
                    const name = `Student ${i + 1}`;
                    const type = mongoose.Types.ObjectId().toString() < "60" ? "Deposit" : "Question posted";
                    const amount = Math.floor(Math.random() * 100) + 1;
                    const description = type === "Deposit" ? "Deposit to wallet" : "Posting of question";
                    const status = "Success";
                    const balance = Math.floor(Math.random() * 1000) + 100;

                    const transaction = new CentralTransactionsDemoSchema({
                        category: "Student",
                        walletId,
                        transactionId: `ST-${transactionId}`,
                        name,
                        date,
                        type,
                        amount,
                        description,
                        status,
                        balance,
                    });

                    transactions.push(transaction);
                    transactionId++;
                }

                // Generate transactions for tutors
                for (let i = 0; i < numTutorWallets; i++) {
                    const walletId = tutorWalletIds[i];
                    const name = `Tutor ${i + 1}`;
                    const type = mongoose.Types.ObjectId().toString() < "60" ? "Withdrawal" : "Answer given";
                    const amount = Math.floor(Math.random() * 100) + 1;
                    const description = type === "Withdrawal" ? "Withdrawal from wallet" : "Answer given to a question";
                    const status = type === "Answer given" ? (mongoose.Types.ObjectId().toString() < "80" ? "Success" : "Pending") : "Success";
                    const balance = Math.floor(Math.random() * 1000) + 100;

                    const transaction = new CentralTransactionsDemoSchema({
                        category: "Tutor",
                        walletId,
                        transactionId: `TU-${transactionId}`,
                        name,
                        date,
                        type,
                        amount,
                        description,
                        status,
                        balance,
                    });

                    transactions.push(transaction);
                    transactionId++;
                }

                CentralTransactionsDemoSchema.insertMany(transactions, (error, result) => {
                    if (error) {
                        console.error(error);
                    } else {
                        console.log(`Inserted ${result.length} transactions`);
                        
                    }
                });
            }

            // Insert the transactions into the database
            

            return res.status(200).json({ status: 1, message: "Done" });

        } catch (error) {
            console.log("error - ", error);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async transactionssummary(req, res, next) {
        try {
            // Define the start and end dates for the summary
            //   const startDate = new Date('2023-03-01');
            //   const endDate = new Date('2023-05-12');

            //   // Group the transactions by day, category, and status
            //   const result = await CentralTransactionsDemoSchema.aggregate([
            //     { $match: { date: { $gte: startDate, $lte: endDate } } },
            //     { $group: {
            //         _id: {
            //           day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
            //           category: "$category",
            //           status: "$status",
            //         },
            //         totalAmount: { $sum: "$amount" },
            //       } 
            //     },
            //     { $sort: { "_id.day": 1, "_id.category": 1, "_id.status": 1 } }
            //   ]);

            //   console.log(result);

            //   // Format the result as an object with daywise and categorywise sums
            //   const summary = {};
            //   for (const { _id, totalAmount } of result) {
            //     const { day, category, status } = _id;
            //     if (!summary[day]) {
            //       summary[day] = {};
            //     }
            //     if (!summary[day][category]) {
            //       summary[day][category] = {};
            //     }
            //     summary[day][category][status] = totalAmount;
            //   }

            var summary = await CentralTransactionsDemoSchema.aggregate([
                {
                    $match: {
                        date: { $gte: new Date('2023-03-01') }
                    }
                },
                {
                    $group: {
                        _id: {
                            day: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                            type: "$type",
                        },
                        count: { $sum: 1 },
                        totalAmount: { $sum: "$amount" }
                    }
                },
                {
                    $sort: { "_id.day": 1, "_id.type": 1 }
                }
            ])

            return res.status(200).json({ status: 1, summary });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ status: 0, error: "Internal server error" });
        }
    },
    async getstudentcontact(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let { issolved, limit, skip } = req.query;
            let condition;

            if(req.query.issolved) {
                condition = {
                    issolved: issolved
                }
            }

            const document = await StudentContactSchema.find(condition)
                .limit(limit)
                .skip(skip);

            if(!document){
                return res.status(400).json({ status: 0, error: "student contact not found" });
            }
            return res.status(200).json({ status: 1, document });
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
    },
    async gettutorcontact(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let { issolved, skip, limit } = req.query;
            
            let condition;

            if(req.query.issolved){
                condition = {
                    issolved: issolved
                }
            }
            
            const document = await TutorContactSchema.find(condition)
            .limit(limit)
            .skip(skip);
            if(!document){
                return res.status(400).json({ status: 0, error: "tutor contact not found" });
            }
            return res.status(200).json({ status: 1, document });
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
    },

    async admincontact(req, res, next) {
        try {
          const { error } = refreshTokenValidatorSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ status: 0, error: error.message });
          }
          // console.log({ token: req.body.token });
          let rec_token = await TokenAdmin.fetchByToken({
            token: req.body.token,
          });
          if (rec_token === null || !rec_token.token) {
            return res
              .status(400)
              .json({ status: 0, error: "Invalid refresh token!" });
          }
        //   const st_id = rec_token._id;

          const id = new ObjectId(req.params.id);
          let student = await StudentContactSchema.findById(id) ;

          if(student){
            if(student.issolved === 1){
                return res.status(400).json({ status:0, error: "student contact already solved" });
            }
            student.issolved = 1;
            await student.save();

            return res.status(200).json({ status: 1, message: "student contact solved successfully" });
          }

          let tutor = await TutorContactSchema.findById(id);

          if(tutor){
            if(tutor.issolved === 1){
                return res.status(400).json({ status:0, error: "tutor contact already solved" });
            }
            tutor.issolved = 1,
            await tutor.save();

            return res.status(200).json({ status: 1, message: "tutor contact solved successfully" });
          }

          return res.status(400).json({ status: 0, error: "contact not found"});
        //   const { fullname, mobileNo, email, Message } = req.body;
        //   const document = await AdminContactSchema.create({
        //     userId: st_id,
        //     fullname,
        //     mobileNo,
        //     email,
        //     Message,
        //   });
        //   document.save();
        //   return res.status(200).json({ status: 1, document });
        } catch (error) {
          console.log("error - ", error);
          return res.status(400).json({ status: 0, error });
        }
      },

      async updatetutorquestionanswer(req, res, next) {
        try{
            const { error } = AdmintutorquestionanswerValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            const { question, answer, explanation } = req.body;

            var questionId = new ObjectId(req.body.questionId);

            var mainquestion = await MainQuestionsSchema.findById(questionId);
            if(!mainquestion){
                return res.status(400).json({ status: 0, error: "question not found"});
            }

            var tut_que = await TutorQuestionsSchema.findOneAndUpdate(
                {
                    tutorId: mainquestion.tutorId,
                    "allQuestions.questionId": questionId
                },
                {
                    $set: {
                        "allQuestions.$.status": "Answered",
                        "allQuestions.$.question": question,
                        "allQuestions.$.answer": answer,
                        "answer.$.explanation": explanation
                    }
                }
            );
    
            if(!tut_que) {
                return res.status(400).json({ status: 0, error: "tutor not found"});
            }

            var reanswerchoice = await ReAnswerChoiceSchema.findOne();
            reanswerchoice = reanswerchoice.choice;

            let questions =  await MainQuestionsSchema.findById(questionId);
            if(questions.whomto_ask === "reanswer"){
                questions.question = question;
                questions.reAnswer = answer;
                questions.reExplanation = explanation;
                questions.internalStatus = "Answered";
                questions.status = "Closed";
                questions.whomto_ask = "";
                
                await questions.save();
                
            }else{
                questions.question = question,
                questions.answer = answer,
                questions.explanation = explanation,
                questions.internalStatus = "Answered",
                questions.status = (reanswerchoice === true ? "NotOpened" : "Closed");

                await questions.save();
            }

            if(!questions){
                return res.status(400).json({ ststus: 0, error: "quesion not found"});
            }
            return res.status(200).json({ status: 1 , message: "answer updated successfully"});
        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
      },

      async deletequestion(req,res,next){
        try{
            const { error } = AdminDeleteQuestionValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            
            const questionId = new ObjectId(req.body.questionId);
            const tutorId = new ObjectId(req.body.tutorId);

            const question = await MainQuestionsSchema.findOne({_id: questionId });
            // console.log(question);
            // const question = await MainQuestionsSchema.findOneAndRemove({_id: questionId});
            // if(!question){
            //     return res.status(400).json({ status: 0, error: "question not found" });
            // }
            
            let tut_wal = await TutorWalletSchema.findOne({ tutorId });
            // console.log(tut_wal);
            if(!tut_wal){
                return res.status(400).json({ status: 0, error: "tutor wallet not found" });
            }

            tut_wal.availableAmount -= parseFloat(question.tutorPrice);
            tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);
            tut_wal.earningAmount -= parseFloat(question.tutorPrice);

           await TutorWalletSchema.findOneAndUpdate(
                { tutorId, 'walletHistory.questionId': questionId },
                { $set: { 'walletHistory.$.date': new Date(),
                          'walletHistory.$.type': "Chargeback",
                          'walletHistory.$.amount': parseFloat(question.tutorPrice),
                        'walletHistory.$.description': `Chargeback for question`,
                        'walletHistory.$.status': "Success",
                        'walletHistory.$.balance': tut_wal.availableAmount
                } },
                { arrayFilters: [{ 'elem.questionId': questionId }], new: true }
              )
                .then(result => {
                  if (result) {
                    console.log(`TutorWallet document updated for questionId ${questionId}`);
                    // console.log(result);
                  } else {
                    console.log(`No TutorWallet document found for questionId ${questionId}`);
                    return res.status(400).json({ status: 0, error: "tutor wallet not found" });
                  }
                })
                .catch((err) => {
                    console.error(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                });
        let transactionId;
       await TutorWalletSchema.aggregate([
            { $match: { 'walletHistory.questionId': questionId } },
            { $project: {
                walletHistory: {
                  $filter: {
                    input: '$walletHistory',
                    cond: { $eq: ['$$this.questionId', questionId] }
                  }
                }
              }
            }
          ], (err, results) => {
            if (err) {
              // handle error
              return res.status(400).json({ status: 0, error: "tutor wallet not found" });
            } else {
              // handle results
              
              results.map((value)=>{
                // console.log(value.walletHistory)
                value.walletHistory.map(async (value)=>{
                    // console.log(value)
                    transactionId = value.transactionId;
                    console.log(transactionId);
                    await CentralTransactionsSchema.findOneAndUpdate(
                                { transactionId, questionId },
                                { $set: { "date": new Date(),
                                        "type": "Chargeback",
                                        "amount": parseFloat(question.tutorPrice),
                                        "description": "Chargeback for question",
                                        "status": "Success",
                                        "balance": tut_wal.availableAmount
                                } }
                              )
                                .then(result => {
                                  if (result) {
                                    console.log(`TutorWallet document updated for questionId ${questionId}`);
                                    // console.log(result);
                                  } else {
                                    console.log(`No TutorWallet document found for questionId ${questionId}`);
                                    return res.status(400).json({ status: 0, error: "central transaction not found" });
                                  }
                                })
                                .catch((err) => {
                                    console.error(err)
                                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                                });
                })
              })
            }
          });
          await tut_wal.save();

          const studentquestion = await StudentQuestionsSchema.updateOne(
                {
                  allQuestions: {
                    $elemMatch: {
                      questionId: questionId
                    }
                  }
                },
                { $pull: { allQuestions: { questionId: questionId } } }
              );

            if(!studentquestion){
                return res.status(400).json({ status: 0, error: "question not found" });
            }


            const tutorquestion = await TutorQuestionsSchema.updateOne({
                allQuestions: {
                  $elemMatch: {
                    questionId: questionId
                  }
                }
              },
              { $pull: { allQuestions: { questionId: questionId } } }
            );

            if(!tutorquestion){
                return res.status(400).json({ status: 0, error: "question not found" });
            }

            const questions = await MainQuestionsSchema.findOneAndRemove({ _id: questionId });
            if(!questions){
                return res.status(400).json({ status: 0, error: "question not found" });
            }

          
            // const tutorwallet = await TutorWalletSchema.updateOne({"tutorId": tutorId, 'walletHistory.questionId': questionId },{
            //     $set:{
            //         'walletHistory.$.date': new Date(),
            //         'walletHistory.$.type': "Chargeback",
            //         'walletHistory.$.amount': parseFloat(question.tutorPrice),
            //         'walletHistory.$.description': `Chargeback for question`,
            //         'walletHistory.$.status': "Success",
            //         'walletHistory.$.balance': tut_wal.availableAmount
            //     }
            // },(err,result)=>{
            //     if(err){
            //         return res.status(400).json({ status: 0, error: "tutorwallet not found "});
            //     }else{
            //         console.log('Result',result);
            //     }
            // }
            
            // );
            
            // console.log(tutorwallet);

            // const tutwallet = await TutorWalletSchema.findOne({ tutorId: tutorId, 'walletHistory.questionId': questionId },{
            //     'walletHistory.$': 1
            // });
            // if(!tutwallet){
            //     return res.status(400).json({status: 0, error: "tutwallet not found"});
            // }
            // console.log(tutwallet);

            //  await CentralTransactionsSchema.updateOne({ transactionId: tutwallet.walletHistory[0].transactionId, questionId: questionId},{
            //     $set: {
            //         "date": new Date(),
            //         "type": "Chargeback",
            //         "amount": parseFloat(question.tutorPrice),
            //         "description": "Chargeback for question",
            //         "status": "Success",
            //         "balance": tut_wal.availableAmount
                    
            //     }

            // },
            // (err,result)=>{
            //     if(err){
            //         return res.status(400).json({ status: 0, error: "central transaction not found "});
            //     }else{
            //         console.log('Result',result);
            //     }
            // }
        
            // );
            // const transaction = {
            //     transactionId: await generateTransactionId(),
            //     questionId: question._id,
            //     date: new Date(),
            //     type: "Chargeback",
            //     amount: parseFloat(question.tutorPrice),
            //     description: `Chargeback for question`,
            //     status: "Success",
            //     balance: tut_wal.availableAmount
            // };

            // let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
            // let name = "tutor";
            // if(tutorname){
            //     name = tutorname.name;
            // }

            
            // const centaltransactiondetails = await CentralTransactionsSchema.create({
            //     category: "Tutor",
            //     walletId: tut_wal._id,
            //     transactionId: transaction.transactionId,
            //     name: name,
            //     date: transaction.date,
            //     type: transaction.type,
                
            //     questionId: transaction.questionId,
            //     amount: transaction.amount,
            //     description: transaction.description,
            //     status: transaction.status,
            //     balance: transaction.balance
            //   })

            //   if(!centaltransactiondetails) {
            //     return res.status(400).json({ status: 0, error: "central transaction not created!"});
            //   }
            //   await centaltransactiondetails.save();
            // tut_wal.walletHistory.unshift(transaction);
            // await tut_wal.save();
            
            return res.status(200).json({ status: 1, message: "Question deleted successfully" });

        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async gettutorwarningquestion( req,res,next){
        try{
            const { error } = AdmintutorwarningquestionValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            
            // const { answer, explanation } = req.body;
            var tutorId = new ObjectId(req.body.tutorId);

            var questionId = new ObjectId(req.body.questionId);

            // let question = await TutorQuestionsSchema.findOne({ "allQuestions.questionId" : questionId });

            var question = await TutorQuestionsSchema.findOneAndUpdate(
                {
                    tutorId: tutorId,
                    "allQuestions.questionId": questionId
                },
                {
                    $set: { "allQuestions.$.isWarning": true },
                    $addToSet: { warningquestionId: questionId },
                    // $inc: { "answeredquestions": 1 }
                }, { new: true }
            );

            await question.save();

            console.log(question);    
            if(!question){
                return res.status(400).json({ status: 0, error: "question not found"});
            }

            let tutor = await TutorRegisterSchema.findOne({_id: tutorId});
            if(!tutor){
                return res.status(400).json({ status: 0, error: "Tutor not found" });
            }

            let name = "Tutor";
            let tut_infor = await TutorPersonalSchema.findById(tutorId);

            if(tut_infor){
                name = tut_infor.name;
            }

            let questions = await MainQuestionsSchema.findOne({ _id: questionId });
            if(!questions){
                return res.status(400).json({ status: 0, error: "Question not found" });
            }

            // question.isWarning = true;

            // question.warningquestionId.unshift(questionId);

            // await question.save();

            const emailContent = tutorwarningquestionTemplate(name, questions.question);

            const subject = "DoubtQ - Warning Question";

            let emailsent = await emailSender(subject, emailContent, tutor.email);
            if (emailsent === "Email sent") {
              // const message = "Register verified link Sent to Mail Successfully.";
              console.log(emailsent);
              // return res.status(200).json({ status: 1, message });
            } else {
              const error = "Mail Sending was Unsuccessful.";
              console.log(error);
              // return res.status(401).json({ status: 0, error });
            }

            return res.status(200).json({ status: 1, message: "tutor get warning question"});

        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
      },

      async getwarningquestion(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let { limit, skip } = req.query;
            limit = parseInt(limit) || 10; // Default limit is 10
            skip = parseInt(skip) || 0;

            const document = await TutorQuestionsSchema.aggregate([
                {
                    $match: {
                        tutorId: ObjectId(req.params.id),
                        // 'allQuestions.isWarning': true
                    }
                },
                { $unwind: '$allQuestions' },
                { $unwind: '$warningquestionId'},
                { $match: { 'allQuestions.isWarning': true } },
                {
                    $lookup: {
                        from: "MainQuestions",
                        localField: "warningquestionId",
                        foreignField: "_id",
                        as: "mainquestion"
                    }
                },
                { $unwind: '$mainquestion' },
                // {
                //     $lookup: {
                //         from: "Image",
                //         pipeline: [
                //             {
                //                 $match: {
                //                     $expr: {
                //                         $in: ['_id', '$allQuestions.questionphoto'],
                //                     },
                //                 },
                //             },
                //         ],

                //         as: "image"
                //     }
                // },
                {
                    $project: {
                        // "allQuestions.question":1,
                        // "allQuestions.questionType":1,
                        // "allQuestions.questionSubject":1,
                        // questionPhoto:{
                        //     $first: "$allQuestions.questionPhoto"
                        // },
                        // "allQuestions.tutorPrice":1,
                        // "allQuestions.status":1,
                        // "allQuestions.answer":1,
                        // "allQuestions.explanation":1,
                        "allQuestions": 1
                        // "mainquestion": 1
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }
            ])
            console.log(document);
            if(!document){
                return res.status(400).json({ status: 0, error: "Question not found!"});
            }
            
            for (var i = 0; i < document.length; i++) {
                console.log(document[i].allQuestions.questionPhoto)
                const image = await ImageSchema.find({
                    _id: { $in: document[i].allQuestions.questionPhoto }
                });
                const imageUrls = await image.map((image) => {
                    return `data:${image.contentType};base64,${image.data.toString("base64")}`;
                })
                document[i].allQuestions.questionPhoto = imageUrls
            }

            return res.status(200).json({ status: 1, document});
    
        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error!"});
        }
      },

      async suspendtutor(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            const id = new ObjectId(req.params.id);
            const document = await TutorRegisterSchema.findById(id);

            if(!document){
                return res.status(400).json({ status: 0, error: "tutor not found" });
            }

            if(document.status === 5){
                return res.status(400).json({ status: 0, error: "tutor already suspended"});
            }
            let date =  new Date();
            document.status = 5;
            document.suspensionEndDate = date.setDate(date.getDate() + 30);
            await document.save();

            const emailContent = suspendtutorTemplate();

            const subject = "DoubtQ - Your account is now Suspended";

            let emailsent = await emailSender(subject, emailContent, document.email);
            if (emailsent === "Email sent") {
              // const message = "Register verified link Sent to Mail Successfully.";
              console.log(emailsent);
              // return res.status(200).json({ status: 1, message });
            } else {
              const error = "Mail Sending was Unsuccessful.";
              console.log(error);
              // return res.status(401).json({ status: 0, error });
            }

            return res.status(200).json({ status: 0, message: "tutor suspendend successfully"});

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
      },

      async tutorstatus(req,res,next){
        try{
            const { error } = AdminTutorStatusValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            let { status } = req.body;
            const id = new ObjectId(req.params.id);
            const document = await TutorRegisterSchema.findById(id);

            if(!document){
                return res.status(400).json({ status: 0, error: "tutor not found" });
            }

            if(document.status === 2) {
                if(status === 3){
                    document.status = status;

                    await document.save();
                }else{
                    let date = new Date();
                    document.status = status;
                    document.suspensionEndDate = date.setDate(date.getDate() + 30);

                    await document.save();
                }
                

                if(document.status === 3){
                    return res.status(200).json({ status: 1, message: "tutor verified successfully" });
                }
                
                if(document.status === 5){
                    return res.status(200).json({ status: 1, message: "tutor suspended successfully"});
                }

                // return res.status(200).json({ status: 1, message: "tutor change status successfully"});

            }else{
                return res.status(400).json({ status: 0, error: "not trial tutor"});
            }
            
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
      },

      async forgotpassword(req, res, next) {
        const { error } = AdminForgotPasswordValidatorSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ status: 0, error: error.message });
        }
    
        const { email } = req.body;
    
        var admin = await AdminSchema.findOne({ email: email });
    
        if (!admin) {
          return res
            .status(400)
            .json({ status: 0, error: "Email is not Registered!" });
        }
    
        var password = generatePassword();

        const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
        const hashedPassword = await bcrypt.hash(password, salt);
    
        admin.password = hashedPassword;
    
        await admin.save();
        console.log(admin.password);

        const emailContent = forgotpasswordTemplate(admin.username,password);

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

        // Send email to user
        // const emailContent = forgotpasswordTemplate(password);
    
        // const subject = "DoubtQ - Password Recovery"
        // let emailsent = await emailSender(subject,emailContent,email);
    
        //   if(emailsent === "Email sent"){
        //     const message = "New Password Sent to Mail Successfully.";
        //     console.log(emailsent);
        //     return res.status(200).json({ status: 1, message });
        //   }else{
        //     const error = "Mail Sending was Unsuccessful.";
        //     return res.status(401).json({ status: 0, error });
        //   }
    
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
        return res.status(200).json({ status: 1, message });
      },

      async adminmobileNo(req,res,next){
        try{
            const { error } = AdminMobileNoValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, error: error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({
                token: req.body.token,
            });

            if (rec_token === null || !rec_token.token) {
            return res
                .status(400)
                .json({ status: 0, error: "Invalid refresh token!" });
            }

            let { mobileNo } = req.body;
            
            let data = await AdminMobileNoSchema.findOne();
            // if(req.body.id){
            //     var id = new ObjectId(req.body.id);
            //     data = await AdminMobileNoSchema.findById(id);
            // }
            console.log(data)
            if(!data){
                try{
                    let document = await AdminMobileNoSchema.create({
                        mobileNo
                    })
                    await document.save();

                }catch(err){
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "MobileNo created successfully"});
            }else{
                try{
                    let document = await AdminMobileNoSchema.findByIdAndUpdate({_id: data._id},{
                        mobileNo
                    },{ new: true })

                    await document.save();

                }catch(err){
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "MobileNo updated successfully"});
            }
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
      },

      async getmobileNo(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ status: 0, error: error.message });
          }
          // console.log({ token: req.body.token });
          let rec_token = await TokenAdmin.fetchByToken({
            token: req.body.token,
          });

          if (rec_token === null || !rec_token.token) {
            return res
              .status(400)
              .json({ status: 0, error: "Invalid refresh token!" });
          }

          const document = await AdminMobileNoSchema.find({}, 'mobileNo');

          if(!document){
            return res.status(400).json({ status: 0, error: "No MobileNo Found!"});
          }
          return res.status(200).json({ status: 1, document });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error "});
        }
      },

      async deletemobileNo(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ status: 0, error: error.message });
          }
          // console.log({ token: req.body.token });
          let rec_token = await TokenAdmin.fetchByToken({
            token: req.body.token,
          });

          if (rec_token === null || !rec_token.token) {
            return res
              .status(400)
              .json({ status: 0, error: "Invalid refresh token!" });
          }

          const document = await AdminMobileNoSchema.findOneAndRemove({ _id: req.params.id });

          if(!document){
            return res.status(400).json({ status: 0, error: "data not found"});
          }

          return res.status(200).json({ status: 1, message: "MobileNo deleted successfully"});
          
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error"});
        }
      },

      async studentissuequestion(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let { limit, skip } = req.query;
            limit = parseInt(limit) || 10; // Default limit is 10
            skip = parseInt(skip) || 0; // Default skip is 0


            const document = await StudentQuestionsSchema.aggregate([
                // {
                //     $match: {
                //         studentId: ObjectId(req.params.id)
                //     }
                // },
                { $unwind: '$allQuestions' },
                { $match: { 'allQuestions.status': 'Issue' } },
                {
                    $lookup: {
                        from: "MainQuestions",
                        localField: "allQuestions.questionId",
                        foreignField: "_id",
                        as: "mainquestion"
                    }
                },
                { $unwind: '$mainquestion' },
                {
                    $lookup: {
                        from: "Image",
                        pipeline: [
                            {
                                $match: {
                                    $expr: {
                                        $in: ['_id', '$allQuestions.questionphoto'],
                                    },
                                },
                            },
                        ],

                        as: "image"
                    }
                },
                {
                    $lookup: {
                        from: "TutorPersonal",
                        localField: "mainquestion.tutorId",
                        foreignField: "tutorId",
                        as: "tutor"
                    }
                },
                {
                    $project: {
                        // "allQuestions.question":1,
                        // "allQuestions.questionType":1,
                        // "allQuestions.questionSubject":1,
                        // questionPhoto:{
                        //     $first: "$allQuestions.questionPhoto"
                        // },
                        // "allQuestions.tutorPrice":1,
                        // "allQuestions.status":1,
                        // "allQuestions.answer":1,
                        // "allQuestions.explanation":1,
                        "allQuestions": 1,
                        studentId: "$studentId",
                        // answer: "$mainquestion.answer",
                        // explanation: "$mainquestion.explanation",
                        // reanswer: "$mainquestion.reAnswer",
                        // reexplanation: "$mainquestion.reExplanation",
                        newreason: "$mainquestion.newReason",
                        newReasonText: "$mainquestion.newReasonText",
                        tutor: {
                            $first: "$tutor.name"
                        }
                    }
                },
                {
                    $skip: skip
                },
                {
                    $limit: limit
                }

            ])
            for (var i = 0; i < document.length; i++) {
                // console.log(document[i].allQuestions.questionPhoto)
                const image = await ImageSchema.find({
                    _id: { $in: document[i].allQuestions.questionPhoto }
                });
                const imageUrls = await image.map((image) => {
                    return `data:${image.contentType};base64,${image.data.toString("base64")}`;
                })
                document[i].allQuestions.questionPhoto = imageUrls
            }
            if (!document) {
                return res.status(400).json({ status: 0, error: "Question not found" });
            }

            return res.status(200).json({ status: 1, message: document });
        } catch (error) {
          console.log("error - ", error);
          return res.status(400).json({ status: 0, error });
        }
      },
      
      async updateissuesubject(req,res,next){
        try{
            const { error } = AdminUpdateIssueSubjectValidatorSchema.validate(req.body);
            if (error) {
                return res.status(500).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
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
                    console.log(question.status)
                    console.log(question.newReason === 1 && req.body.questionSubject)
                    if (question.newReason === 1 && req.body.questionSubject) {
                        console.log(question.status)
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
    
    
                       const tutorquestion =  await findTutorAndAssignQuestion(question);
                        if(tutorquestion === true) {
                            var message = "question subject updated successfully";
                            return res.status(200).json({ status: 1, message})
                        }
                            
                    }else{
                        return res.status(400).json({ status: 0, error: "You can only change subject" });
                    }
                }
            }else{
                return res.status(401).json({ status: 0, error: "UnAuthorised Question"});
            }
    
        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async adminissuesolved(req,res,next){
        try{
            const { error } = AdminIssueSolvedValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const questionId = new ObjectId(req.body.questionId);

            const question = await MainQuestionsSchema.findById(questionId);

            if(question){
                
                const now = new Date();

                if(question.status === "Issue"){
        
                        question.status = "PENDING";
                        question.createdAt = now;
                        question.internalStatus = "AssignedWithFindResponse";
                        question.isNewReasonExecuted = 0;

                        await question.save();
                }else{
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }

                 StudentQuestionsSchema.updateOne(
                    { "allQuestions.questionId": question._id },
                    {
                        $set: {
                            "allQuestions.$.status": "PENDING",
                            "allQuestions.$.dateOfPosted": now
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

                return res.status(200).json({ status: 1 , message: "issue solved succesfully"});

            }else{
                return res.status(401).json({ status: 0, error: "UnAuthorised Question"});
            }

        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async reactivatetutor(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const id = new ObjectId(req.params.id);
            const document = await TutorRegisterSchema.findById(id);

            if(!document){
                return res.status(400).json({ status: 0, error: "tutor not found" });
            }

            if( document.status === 3 ){
                return res.status(400).json({ status: 0, error: "tutor already reactivate" });
            }

            document.status = 3;
            await document.save();

            let tutorname = await TutorPersonalSchema.findOne({tutorId: id });
            let name = "Tutor";
            
            const emailContent = reactivatetutorTemplate(name);

            const subject = "DoubtQ - Account Reactivation";

            let emailsent = await emailSender(subject, emailContent, document.email);
            if (emailsent === "Email sent") {
              // const message = "Register verified link Sent to Mail Successfully.";
              console.log(emailsent);
              // return res.status(200).json({ status: 1, message });
            } else {
              const error = "Mail Sending was Unsuccessful.";
              console.log(error);
              // return res.status(401).json({ status: 0, error });
            }

            return res.status(200).json({ status: 1, message: "tutor reactivate successfully" });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async studentpostingstreak(req,res,next){
        try{
            const { error } = StudentPostingStreakValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            
            const { initial, extrasum } = req.body;

            let data = await StudentPostingStreakSchema.findOne();

            if(!data){
                try{
                    let document = await StudentPostingStreakSchema.create({
                        initial,
                        extrasum
                    });

                    await document.save();
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "student postingstreak created successfully" });
            }else{
                try{
                    let document = await StudentPostingStreakSchema.findByIdAndUpdate({_id: data._id},{
                        initial,
                        extrasum
                    },{ new: true });

                    await document.save();
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "student postingstreak updated successfully" });
            }

        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },
      async getstudentpostingstreak(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ status: 0, error: error.message });
          }
          // console.log({ token: req.body.token });
          let rec_token = await TokenAdmin.fetchByToken({
            token: req.body.token,
          });

          if (rec_token === null || !rec_token.token) {
            return res
              .status(400)
              .json({ status: 0, error: "Invalid refresh token!" });
          }

          const document = await StudentPostingStreakSchema.find({}, 'initial extrasum');

          if(!document){
            return res.status(400).json({ status: 0, error: "Postingstreak data not found!"});
          }
          return res.status(200).json({ status: 1, document });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

    //   async deletestudentpostingstreak(req,res,next){
    //     try{
    //         const { error } = refreshTokenValidatorSchema.validate(req.body);
    //       if (error) {
    //         return res.status(400).json({ status: 0, error: error.message });
    //       }
    //       // console.log({ token: req.body.token });
    //       let rec_token = await TokenAdmin.fetchByToken({
    //         token: req.body.token,
    //       });

    //       if (rec_token === null || !rec_token.token) {
    //         return res
    //           .status(400)
    //           .json({ status: 0, error: "Invalid refresh token!" });
    //       }

    //       const document = await StudentPostingStreakSchema.findOneAndRemove({ _id: req.params.id });

    //       if(!document){
    //         return res.status(400).json({ status: 0, error: "data not found"});
    //       }

    //       return res.status(200).json({ status: 1, message: "student postingstreak deleted successfully"});
          
    //     }catch(err){
    //         return res.status(500).json({ status: 0, error: "Internal Server Error"});
    //     }
    //   },

      async tutorpostingstreak(req,res,next){
        try{
            const { error } = TutorPostingStreakValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            
            const { initial, extrasum } = req.body;

            let data = await TutorPostingStreakSchema.findOne();

            if(!data){
                try{
                    let document = await TutorPostingStreakSchema.create({
                        initial,
                        extrasum
                    });

                    await document.save();
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "tutor postingstreak created successfully" });
            }else{
                try{
                    let document = await TutorPostingStreakSchema.findByIdAndUpdate({_id: data._id},{
                        initial,
                        extrasum
                    },{ new: true });

                    await document.save();
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "tutor postingstreak updated successfully" });
            }

        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async gettutorpostingstreak(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ status: 0, error: error.message });
          }
          // console.log({ token: req.body.token });
          let rec_token = await TokenAdmin.fetchByToken({
            token: req.body.token,
          });

          if (rec_token === null || !rec_token.token) {
            return res
              .status(400)
              .json({ status: 0, error: "Invalid refresh token!" });
          }

          const document = await TutorPostingStreakSchema.find({}, 'initial extrasum');

          if(!document){
            return res.status(400).json({ status: 0, error: "Postingstreak data not found!"});
          }
          return res.status(200).json({ status: 1, document });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

    //   async deletetutorpostingstreak(req,res,next){
    //     try{
    //         const { error } = refreshTokenValidatorSchema.validate(req.body);
    //       if (error) {
    //         return res.status(400).json({ status: 0, error: error.message });
    //       }
    //       // console.log({ token: req.body.token });
    //       let rec_token = await TokenAdmin.fetchByToken({
    //         token: req.body.token,
    //       });

    //       if (rec_token === null || !rec_token.token) {
    //         return res
    //           .status(400)
    //           .json({ status: 0, error: "Invalid refresh token!" });
    //       }

    //       const document = await TutorPostingStreakSchema.findOneAndRemove({ _id: req.params.id });

    //       if(!document){
    //         return res.status(400).json({ status: 0, error: "data not found"});
    //       }

    //       return res.status(200).json({ status: 1, message: "tutor postingstreak deleted successfully"});
          
    //     }catch(err){
    //         return res.status(500).json({ status: 0, error: "Internal Server Error"});
    //     }
    //   },

      async studentreferral(req,res,next){
        try{
            const { error } = AdminStudentReferralValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            
            const { referralpersonalreward, referralotherreward, paymentcondition } = req.body;

            let data = await StudentPostingStreakSchema.findOne();

            if(!data){
                try{
                    let document = await StudentPostingStreakSchema.create({
                        referralpersonalreward,
                        referralotherreward,
                        paymentcondition
                    });

                    await document.save();
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "student referral created successfully" });
            }else{
                try{
                    let document = await StudentPostingStreakSchema.findByIdAndUpdate({_id: data._id},{
                        referralpersonalreward,
                        referralotherreward,
                        paymentcondition
                    },{ new: true });

                    await document.save();
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "student referral updated successfully" });
            }

        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async getstudentreferral(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ status: 0, error: error.message });
          }
          // console.log({ token: req.body.token });
          let rec_token = await TokenAdmin.fetchByToken({
            token: req.body.token,
          });

          if (rec_token === null || !rec_token.token) {
            return res
              .status(400)
              .json({ status: 0, error: "Invalid refresh token!" });
          }

          const document = await StudentPostingStreakSchema.find({}, 'referralpersonalreward referralotherreward paymentcondition');

          if(!document){
            return res.status(400).json({ status: 0, error: "Referral data not found!"});
          }
          return res.status(200).json({ status: 1, document });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async tutorreferral(req,res,next){
        try{
            const { error } = AdminTutorReferralValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            
            const { referralpersonalreward, referralotherreward } = req.body;

            let data = await TutorPostingStreakSchema.findOne();

            if(!data){
                try{
                    let document = await TutorPostingStreakSchema.create({
                        referralpersonalreward,
                        referralotherreward
                    });

                    await document.save();
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "tutor referral created successfully" });
            }else{
                try{
                    let document = await TutorPostingStreakSchema.findByIdAndUpdate({_id: data._id},{
                        referralpersonalreward,
                        referralotherreward
                    },{ new: true });

                    await document.save();
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "tutor referral updated successfully" });
            }

        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async gettutorreferral(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
          if (error) {
            return res.status(400).json({ status: 0, error: error.message });
          }
          // console.log({ token: req.body.token });
          let rec_token = await TokenAdmin.fetchByToken({
            token: req.body.token,
          });

          if (rec_token === null || !rec_token.token) {
            return res
              .status(400)
              .json({ status: 0, error: "Invalid refresh token!" });
          }

          const document = await TutorPostingStreakSchema.find({}, 'referralpersonalreward referralotherreward');

          if(!document){
            return res.status(400).json({ status: 0, error: "Referral data not found!"});
          }
          return res.status(200).json({ status: 1, document });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async subscription(req,res,next){
        try{
            const { error } = AdminSubscriptionValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let { duration, price, isactive } = req.body;

            var data;
            if(req.body.id){
                let id = new ObjectId(req.body.id);
                data = await SubscriptionSchema.findById(id);
            }

            if(!data){
                try{
                    const document = await SubscriptionSchema.create({
                        duration,
                        price,
                        isactive
                    });
                    await document.save();

                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }

                return res.status(200).json({ status: 1, message: "subscription created successfully" });
            }else{
                try{
                    const document = await SubscriptionSchema.findByIdAndUpdate({ _id: data._id},{
                        duration,
                        price,
                        isactive
                    },{ new: true });
                    await document.save();

                }catch(err){
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "subscription updated successfully" });
            }
        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async getsubscription(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const subscription = await SubscriptionSchema.find({});
            
            if(!subscription){
                return res.status(400).json({ status: 0, error: "subscription not found" });
            }
            return res.status(200).json({ status: 1, subscription });

        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
      },

      async subscriptionstatuschange(req, res, next) {
        try {
            const { error } = AdminSubscriptionStatusValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { status } = req.body;

            const subscription = await SubscriptionSchema.findByIdAndUpdate({ _id: req.params.id }, {
                isactive: status
            }, { new: true });

            await subscription.save();
            if (!subscription) {
                return res.status(400).json({ status: 0, error: "subscription not found" });
            }

            return res.status(200).json({ status: 1, message: "status updated successfully" });

        } catch (err) {
            return res.status(200).json({ status: 0, error: "Internal Server Error" });
        }
    },

    

    async updatesubscriptionprice(req,res,next){
        try{
            const { error } = AdminChangeSubscriptionPriceValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { price, status } = req.body;

            const subscription = await SubscriptionSchema.findByIdAndUpdate({ _id: req.params.id }, {
                price,
                isactive: status
            }, { new: true });

            await subscription.save();
            if (!subscription) {
                return res.status(400).json({ status: 0, error: "subscription not found" });
            }
    
            return res.status(200).json({ status: 1, message: "subscription updated successfully" });
        
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async adminpaymentgateway(req,res,next){
        try{
            const { error } = AdminPaymentGatewayValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            
            const { paymentMethod, status, publicKey, privateKey, merchantId, accessCode, workingKey } = req.body;
            let data;
            if(req.body.id){
                let id = new ObjectId(req.body.id);
                 data = await PaymentGatewaySchema.findById(id);
            }
            

            if(!data){
                try{
                    let document;
                    if(paymentMethod === "Stripe"){
                        console.log(req.body)
                        document = await PaymentGatewaySchema.create({
                            name: paymentMethod,
                            publicKey,
                            privateKey,
                            isactive: status
                         });

                         await document.save(); 
                         console.log(document);
                    }else if(paymentMethod === "Ccavenue"){
                        document = await PaymentGatewaySchema.create({
                            name: paymentMethod,
                            merchantId,
                            accessCode,
                            workingKey,
                            isactive: status
                        });
                        
                        await document.save();
                    }else{

                    }
                    
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "payment gateway method created successfully" });
            }else{
                try{
                    let document;
                    if(paymentMethod === "Stripe"){
                        document = await PaymentGatewaySchema.findByIdAndUpdate({_id: data._id},{
                           name: paymentMethod,
                           publicKey,
                           privateKey,
                           isactive: status
                        },{ new: true });

                        await document.save();
                    }else if(paymentMethod === "Ccavenue"){
                        document = await PaymentGatewaySchema.findByIdAndUpdate({_id: data._id},{
                            name: paymentMethod,
                            merchantId,
                            accessCode,
                            workingKey,
                            isactive: status
                         },{ new: true });

                        await document.save();
                    }else{

                    }
                    
    
                }catch(err){
                    console.log(err);
                    return res.status(500).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "payment gateway method updated successfully" });
            }
        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async adminpaymentgatewaystatus(req,res,next){
        try{
            const { error } = AdminPaymentGatewayStatusValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { status } = req.body;

            const paymentgateway = await PaymentGatewaySchema.findByIdAndUpdate({ _id: req.params.id }, {
                isactive: status
            }, { new: true });

            await paymentgateway.save();
            if (!paymentgateway) {
                return res.status(400).json({ status: 0, error: "payment gateway method not found" });
            }

            return res.status(200).json({ status: 1, message: "status updated successfully" });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async getadminpaymentgatewaymethod(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const paymentdetails = await PaymentGatewaySchema.find({});

            if(!paymentdetails){
                return res.status(400).json({ status: 0, error: "payment method not found" });
            }
            return res.status(200).json({ status: 1, paymentdetails });

        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async adminthought(req,res,next){
        try{
            const { error } = AdminThoughtValidatorSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            let { thought } = req.body;

            var data;
            if(req.body.id){
                let id = new ObjectId(req.body.id);
                data = await AdminThoughtSchema.findById(id);
            }

            if(!data){
                try{
                    let document = await AdminThoughtSchema.create({
                        thought
                    });

                    await document.save();

                }catch(err){
                    return res.status(500).json({ status: 400, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "Thought created successfully" });
            }else{
                try{
                    let document = await AdminThoughtSchema.findByIdAndUpdate({_id: data._id},{
                        thought
                    },{ new: true });

                    await document.save();
                }catch(err){
                    return res.status(400).json({ status:0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "Thought updated successfully" });
            }
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async getthought(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await AdminThoughtSchema.find();

            if(!document) {
                return res.status(400).json({ status: 0, error: "Thought not found" });
            }
            return res.status(200).json({ status: 1, document });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async deletethought(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);

            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await AdminThoughtSchema.findOneAndRemove({_id: req.params.id});

            if(!document){
                return res.status(400).json({ status: 0, error: "data not found" });
            }
            return res.status(200).json({ status: 1, message: "Thought deleted successfully" });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async tutorexampopup(req,res,next){
        try{
            const { error } = AdminTutorExamPopUpValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { content } = req.body;
            
             let data = await TutorExamPopUpSchema.findOne();
            
            if(!data){
                try{
                    let document = await TutorExamPopUpSchema.create({
                        content
                    });

                    await document.save();

                }catch(err){
                    return res.status(500).json({ status: 0, error: "Internal Server" });
                }
                return res.status(200).json({ status: 1, message: "tutor exam popup created successfully" });
            }else{
                try{
                    let document = await TutorExamPopUpSchema.findByIdAndUpdate({_id: data._id},{
                        content
                    },{ new: true });

                    await document.save();
                }catch(err){
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "tutor exam popup updated successfully" });
            }
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async gettutorexampopup(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TutorExamPopUpSchema.find({});

            if(!document){
                return res.status(400).json({ status: 0, error: "tutorexam popup content not found" });
            }
            return res.status(200).json({ status: 1, document });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async deletetutorexampopup(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await TutorExamPopUpSchema.findOneAndRemove({_id: req.params.id});

            if(!document){
                return res.status(400).json({ status: 0, error: "tutor exam popup not found" });
            }
            return res.status(200).json({ status: 1, message: "tutor exam popup deleted successfully" });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async postingguideline(req,res,next){
        try{
            uploadpdf(req,res, async (err) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({ status: 0, message: "Please upload a Pdf / Docx File!" });
                }

                const { error } = AdminPostingGuidelineValidatorSchema.validate(req.body);
                  if (error) {
                    return res.status(400).json({ status: 0, error: error.message });
                  }
                  // console.log({ token: req.body.token });
                  let rec_token = await TokenAdmin.fetchByToken({
                    token: req.body.token,
                  });
        
                  if (rec_token === null || !rec_token.token) {
                    return res
                      .status(400)
                      .json({ status: 0, error: "Invalid refresh token!" });
                  }

                  var data = await PostingGuidelineSchema.findOne();

                  if(!data){

                    if(!req.files.postingguideline){
                        return res.status(400).json({ status: 0, error: "Please upload file" });
                    }

                    if(req.files.postingguideline) {
                        const img = new PostingGuidelineSchema();
                        img.name = req.files.postingguideline[0].filename;
                        img.data = fs.readFileSync(req.files.postingguideline[0].path);
                        img.contentType = req.files.postingguideline[0].mimetype;
                        const image = await img.save();
                        fs.unlinkSync(req.files.postingguideline[0].path);
                        // console.log(image);
                        // const impr = await Promise.all(image);
                    }

                    return res.status(200).json({ status: 1, message: "file uploaded successfully" });

                  }else{
                    if(!req.files.postingguideline){
                        return res.status(400).json({ status: 0, error: "Please upload file" });
                    }

                    const pdffile = await PostingGuidelineSchema.findByIdAndRemove({_id: data._id});
                    if(!pdffile) {
                        return res.status(400).json({ status: 0, error: "pdf file not found" });
                    }

                    if(req.files.postingguideline) {
                        const img = new PostingGuidelineSchema();
                        img.name = req.files.postingguideline[0].filename;
                        img.data = fs.readFileSync(req.files.postingguideline[0].path);
                        img.contentType = req.files.postingguideline[0].mimetype;
                        const image = await img.save();
                        fs.unlinkSync(req.files.postingguideline[0].path);
                        // console.log(image);
                        // const impr = await Promise.all(image);
                    }

                    return res.status(200).json({ status: 1, message: "pdf file uploaded successfully" });
                  }
                  
            })
            
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async downloadPdf(req,res,next){
        try{
            const file = await PostingGuidelineSchema.findOne();

            if(!file){
                return res.status(400).json({ status: 0, error: "pdf file not found" });
            }

            res.set('content-Type', file.contentType);
            res.set('Content-Disposition', `inline; pdf${path.extname(file.name)}`);
            res.send(file.data)

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async answeringguideline(req,res,next){
        try{
            uploadpdf(req,res, async (err) => {
                if(err) {
                    console.log(err);
                    return res.status(500).json({ status: 0, message: "Please upload a Pdf / Docx File!" });
                }

                const { error } = AdminAnsweringGuidelineValidatorSchema.validate(req.body);
                  if (error) {
                    return res.status(400).json({ status: 0, error: error.message });
                  }
                  // console.log({ token: req.body.token });
                  let rec_token = await TokenAdmin.fetchByToken({
                    token: req.body.token,
                  });
        
                  if (rec_token === null || !rec_token.token) {
                    return res
                      .status(400)
                      .json({ status: 0, error: "Invalid refresh token!" });
                  }

                  var data = await AnsweringGuidelineSchema.findOne();

                  if(!data){

                    if(!req.files.answeringguideline){
                        return res.status(400).json({ status: 0, error: "Please upload file" });
                    }

                    if(req.files.answeringguideline) {
                        const img = new AnsweringGuidelineSchema();
                        img.name = req.files.answeringguideline[0].filename;
                        img.data = fs.readFileSync(req.files.answeringguideline[0].path);
                        img.contentType = req.files.answeringguideline[0].mimetype;
                        const image = await img.save();
                        fs.unlinkSync(req.files.answeringguideline[0].path);
                        // console.log(image);
                        // const impr = await Promise.all(image);
                    }

                    return res.status(200).json({ status: 1, message: "file uploaded successfully" });

                  }else{
                    if(!req.files.answeringguideline){
                        return res.status(400).json({ status: 0, error: "Please upload file" });
                    }

                    const pdffile = await AnsweringGuidelineSchema.findByIdAndRemove({_id: data._id});
                    if(!pdffile) {
                        return res.status(400).json({ status: 0, error: "pdf file not found" });
                    }

                    if(req.files.answeringguideline) {
                        const img = new AnsweringGuidelineSchema();
                        img.name = req.files.answeringguideline[0].filename;
                        img.data = fs.readFileSync(req.files.answeringguideline[0].path);
                        img.contentType = req.files.answeringguideline[0].mimetype;
                        const image = await img.save();
                        fs.unlinkSync(req.files.answeringguideline[0].path);
                        // console.log(image);
                        // const impr = await Promise.all(image);
                    }

                    return res.status(200).json({ status: 1, message: "pdf file uploaded successfully" });
                  }
                  
            })
            
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async answeringguidelinedownloadPdf(req,res,next){
        try{
            const file = await AnsweringGuidelineSchema.findOne();

            if(!file){
                return res.status(400).json({ status: 0, error: "pdf file not found" });
            }

            res.set('content-Type', file.contentType);
            res.set('Content-Disposition', `inline; pdf${path.extname(file.name)}`);
            res.send(file.data)

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },



    
    async adminpages(req,res,next){
        try{
            const { error } = AdminPagesValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { pagename, subpages } = req.body;

            var data;
            if(req.body.id){
                let id = new ObjectId(req.body.id);
                data = await AdminPagesSchema.findById(id);
            }
            
            if(!data){
                try{
                    let document = await AdminPagesSchema.create({
                        name: pagename,
                        subpages
                    });
    
                    await document.save();

                }catch(err){
                    console.log(err);
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "pages created successfully" });
            
            }else{
                try{
                    let document = await AdminPagesSchema.findByIdAndUpdate({_id: data._id},{
                        name: pagename,
                        subpages
                    }, { new : true });
    
                    await document.save();

                }catch(err){
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "pages updated successfully" });
            }
            
        }catch(err){
            console.log(err);
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async getadminpages(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await AdminPagesSchema.find();

            if(!document){
                return res.status(400).json({ status: 0, error: "Internal Server Error" });
            }

            res.status(200).json({ status: 1, document });
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async deleteadminpages(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await AdminPagesSchema.findOneAndRemove({_id: req.params.id });
            if(!document){
                return res.status(400).json({ status: 0, error: "admin pages not found" });
            }

            return res.status(200).json({ status: 1, message: "Admin pages deleted successfully" });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async studentregisterbonus(req,res,next) {
        try{
            const { error } = AdminStudentRegisterBonusValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const { price } = req.body;
            
             let data = await StudentRegisterBonusSchema.findOne();
            
            if(!data){
                try{
                    let document = await StudentRegisterBonusSchema.create({
                        price
                    });

                    await document.save();

                }catch(err){
                    return res.status(500).json({ status: 0, error: "Internal Server" });
                }
                return res.status(200).json({ status: 1, message: "student register bouns created successfully" });
            }else{
                try{
                    let document = await StudentRegisterBonusSchema.findByIdAndUpdate({_id: data._id},{
                        price
                    },{ new: true });

                    await document.save();
                }catch(err){
                    return res.status(400).json({ status: 0, error: "Internal Server Error" });
                }
                return res.status(200).json({ status: 1, message: "student register bonus updated successfully" });
            }

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async getadminstudentregisterbonus(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await StudentRegisterBonusSchema.find();

            if(!document){
                return res.status(400).json({ status: 0, error: "Internal Server Error" });
            }

            res.status(200).json({ status: 1, document });
        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    async deleteadminstudentregisterbonus(req,res,next){
        try{
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenAdmin.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const document = await StudentRegisterBonusSchema.findOneAndRemove({_id: req.params.id });
            if(!document){
                return res.status(400).json({ status: 0, error: "student register bonus not found" });
            }

            return res.status(200).json({ status: 1, message: "student register bonus deleted successfully" });

        }catch(err){
            return res.status(500).json({ status: 0, error: "Internal Server Error" });
        }
    },

    

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
export default adminController;
import { Tutor, TutorPersonal, TutorProfessional, TokenTutor, TutorWallet, TutorQuestions, TutorBankDetails } from "../model/index.js";
import { TutorPersonalSchema, TutorProfessionalSchema, TutorRegisterSchema, TutorWalletSchema, TutorQuestionsSchema, TutorDocumentSchema, TutorSubjectsSchema, TutorBankDetailsSchema, TutorTimingSchema, MainQuestionsSchema, ReAnswerChoiceSchema, QuestionTimingSchema, TutorContactSchema, UnsolvedQuestionsSchema, ImageSchema, TutorImageSchema, StudentQuestionsSchema, TutorExamSubjectSchema, CentralTransactionsSchema, QuestionSubjectSchema, StudentInformationSchema, TutorOTPSchema, AdminMobileNoSchema, TutorPostingStreakSchema } from "../schema/index.js";
import { TutorRegisterValidatorSchema, refreshTokenValidatorSchema, TutorLoginValidatorSchema, TutorPersonalValidatorSchema, TutorProfessionalValidatorSchema, TutorChangePasswordValidatorSchema, TutorGoogleRegister2ValidatorSchema, TutorAddSubjectValidatorSchema, TutorBankDetailsValidatorSchema, TutorAddScreenTimeValidatorSchema, TutorSendAnswerValidatorSchema, TutorCheckUnsolvedQuestionValidatorSchema, TutorSendUnsolvedAnswerValidatorSchema, TutorReferralCompleteValidatorSchema, TutorAnswerStreakCashOutValidatorSchema, TutorForgotPasswordValidatorSchema, TutorOTPValidatorSchema } from "../validators/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../service/JwtService.js";
import { TokenTutorSchema } from "../schema/index.js";
import { APP_URL, SALT_FACTOR, CLIENT_ID } from "../config/index.js";
import crypto from 'crypto';
import mainquestions from "../schema/mainquestions.js";
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import fs from 'fs';
import { ObjectId } from 'mongodb';
import generateTransactionId from '../controller/generateTransactionId.js';
import TutorcontactValidatorSchema from "../validators/TutorcontactValidator.js";
import moment from 'moment';
import { OAuth2Client } from 'google-auth-library';
import emailSender from "./emailsender.js";
import questionanswerTemplate from "../emailtemplates/questionanswer.js";
import tutorregisterVerifyTemplate from "../emailtemplates/tutorregisterverify.js";
import tutorregistrationTemplate from "../emailtemplates/tutorregistration.js";
import forgotpasswordTemplate from "../emailtemplates/forgotpassword.js";
// import tutorregisterTemplate from "../emailtemplates/register.js";
// import registerTemplate from "../emailtemplates/register.js";

const client = new OAuth2Client(CLIENT_ID);

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
const __dirname = dirname(__filename)





// multer for image save 

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirectory = path.join(__dirname, '..', 'uploads');
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

const storage1 = multer.diskStorage({
    destination: function (req, file, cb) {
        const uploadDirectory = path.join(__dirname, '..', 'tutorimage');
        console.log(uploadDirectory);

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




export const upload = multer({
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
}).single('degree_image');



export const tutorimage = multer({
    storage: storage1,
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
}).single('profilephoto');

// multer ends here

// multer ends here



function generateReferralCode(userId) {
    const hash = crypto.createHash('sha256');
    hash.update(userId + Date.now().toString());
    return hash.digest('hex').substring(0, 12);
}

const tutorController = {
    async googleregister(req, res, next) {
        const { idToken } = req.body;

        if (!idToken) {
            return res.status(400).json({ status: 0, error: "Please Enter idToken!" });
        }

        try {
            const payload = await validateGoogleToken(idToken);

            try {
                // console.log(req.user);
                const user = new TutorRegisterSchema({
                    email: payload.email,
                    googleId: payload.sub,
                    registerType: "google",
                    emailVerified: 1,
                    googleVerified: 0,
                    internalStatus: 0
                });
                var aa = await Tutor.create(user);
                console.log(aa);
                if (!aa.error) {
                    // console.log(aa);
                    let refresh_token;
                    // access_token = await JwtService.sign({_id:document._id});
                    refresh_token = await JwtService.sign({ _id: aa._id });
                    var tt = await TokenTutorSchema.create({ _id: aa._id, token: refresh_token, expiresAt: new Date() });
                    let token = refresh_token;
                    var info = aa;
                    var message = "Tutor Registered Successfully. now redirect to password, reffral page.";
                    return res.status(200).json({ status: 1, info, token, message });
                    // res.redirect("/student/home");
                } else {
                    return res.status(400).json({ status: 0, "error": aa.error });
                    // res.redirect("/student/register");
                }
            } catch (error) {
                // originally
                // res.json({"message": "Error in registration"});
                console.log(error);
                return res.status(400).json({ status: 0, "error": error });
            }
        }
        catch (error) {
            console.log(error);
            return res.status(400).json({ status: 0, "error": error });
        }
    },
    async googleregister2(req, res, next) {
        try {
            const { error } = TutorGoogleRegister2ValidatorSchema.validate(req.body);
            if (error) {
                return res.json({ status: 0, "error": error.message });
            }

            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var st_id = rec_token._id;

            let { password } = req.body;
            const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
            const hashedPassword = await bcrypt.hash(password, salt);
            req.body.password = hashedPassword;
            var user;
            const TutorId = await TutorRegisterSchema.findById(st_id);
            if (!TutorId) {
                return res.status(400).json({ status: 0, error: "Tutor Invalid!" });
            }

            let otpverify;
            if (req.body.referralCode) {
                otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);

                if (otpverify !== "OTP verified successfully") {
                    return res.status(400).json({ status: 0, error: otpverify });
                }

                const tutor = await TutorRegisterSchema.findOne({
                    ownReferral: req.body.referralCode,
                });
                if (tutor) {
                    let answer = [
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

                      var pri = await TutorPostingStreakSchema.findOne();

                      var referralpersonal = parseFloat(pri.referralpersonalreward);
                      referralpersonal = parseFloat(referralpersonal.toFixed(2));

                    let data = {
                        userId: st_id,
                        email: TutorId.email,
                        referdate: Date.now(),
                        amount: referralpersonal,
                        active: false,
                        redeemed: false,
                    };
                    tutor.referralHistory.unshift(data);
                    await tutor.save();

                    TutorId.password = req.body.password;
                    // TutorId.class = req.body.class;
                    TutorId.mobileNo = req.body.mobileNo;
                    TutorId.referralCode = req.body.referralCode;
                    TutorId.googleVerified = 1;
                    TutorId.ownReferral = generateReferralCode(st_id);
                    TutorId.answeringStreak = answer;
                    await TutorId.save();

                    var wal = await TutorWallet.create({ tutorId: TutorId._id });
                    if (!wal) {
                        return res.status(400).json({ status: 0, "error": "No created Tutor Bank" });
                    }
                    var st_qu = await ({ tutorId: TutorId._id, answeredquestions: 0, refer1cashedout: false, refer2cashedout: false, refer3cashedout: false, refer4cashedout: false });
                    if (!st_qu) {
                        return res.status(400).json({ status: 0, "error": "No created Tutor Bank" });
                    }
                    var tut_bank = await TutorBankDetailsSchema.create({ tutorId: TutorId._id });
                    if (!tut_bank) {
                        return res.status(400).json({ status: 0, "error": "No created Tutor Bank" });
                    }
                    var tut_sub = await TutorSubjectsSchema.create({ tutorId: TutorId._id });
                    if (!tut_sub) {
                        return res.status(400).json({ status: 0, "error": "No created Tutor Subject" });
                    }

                    // const emailContent = tutorregisterVerifyTemplate(TutorId._id, req.body.token);
                    const emailContent = tutorregistrationTemplate();
        
                    const subject = "DoubtQ - Verification Email";
        
                    let emailsent = await emailSender(subject, emailContent, TutorId.email);
                    if (emailsent === "Email sent") {
                      // const message = "Register verified link Sent to Mail Successfully.";
                      console.log(emailsent);
                      // return res.status(200).json({ status: 1, message });
                    } else {
                      const error = "Mail Sending was Unsuccessful.";
                      console.log(error);
                      // return res.status(401).json({ status: 0, error });
                    }
                    var info = TutorId;
                    var message = "User registered successfully.";
                    return res.status(200).json({ status: 1, info, token: req.body.token, message });

                }
                else {
                    var message = "Invalid Referral code!";
                    return res.status(400).json({ status: 0, message });
                }

                // user = await TutorRegisterSchema.findByIdAndUpdate(st_id, {
                //     password: req.body.password,
                //     referralCode: req.body.referralCode
                // }, { new: true });
            } else {
                otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);
                if (otpverify !== "OTP verified successfully") {
                    return res.status(400).json({ status: 0, error: otpverify });
                }

                let answer = [
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
                TutorId.password = req.body.password;
                TutorId.mobileNo = req.body.mobileNo;
                TutorId.ownReferral = generateReferralCode(st_id);
                TutorId.googleVerified = 1;
                TutorId.answeringStreak = answer;

                await TutorId.save();

                var wal = await TutorWallet.create({ tutorId: TutorId._id });
                if (!wal) {
                    return res.status(400).json({ status: 0, "error": "No created Tutor Bank" });
                }
                var st_qu = await TutorQuestions.create({ tutorId: TutorId._id, answeredquestions: 0, refer1cashedout: false, refer2cashedout: false, refer3cashedout: false, refer4cashedout: false });
                if (!st_qu) {
                    return res.status(400).json({ status: 0, "error": "No created Tutor Bank" });
                }
                var tut_bank = await TutorBankDetailsSchema.create({ tutorId: TutorId._id });
                if (!tut_bank) {
                    return res.status(400).json({ status: 0, "error": "No created Tutor Bank" });
                }
                var tut_sub = await TutorSubjectsSchema.create({ tutorId: TutorId._id });
                if (!tut_sub) {
                    return res.status(400).json({ status: 0, "error": "No created Tutor Subject" });
                }

                // const emailContent = tutorregisterVerifyTemplate(TutorId._id, req.body.token);
                const emailContent = tutorregistrationTemplate();
    
                const subject = "DoubtQ - Verification Email";
    
                let emailsent = await emailSender(subject, emailContent, TutorId.email);
                if (emailsent === "Email sent") {
                  // const message = "Register verified link Sent to Mail Successfully.";
                  console.log(emailsent);
                  // return res.status(200).json({ status: 1, message });
                } else {
                  const error = "Mail Sending was Unsuccessful.";
                  console.log(error);
                  // return res.status(401).json({ status: 0, error });
                }
                var info = TutorId;
                var message = "User registered successfully.";
                return res.status(200).json({ status: 1, info, token: req.body.token, message });

                // user = await TutorRegisterSchema.findByIdAndUpdate(st_id, {
                //     password: req.body.password
                // }, { new: true });
            }

            // var wal = await TutorWallet.create({ tutorId: user._id });
            // var st_qu = await TutorQuestions.create({ tutorId: user._id });

            // var info = user;
            // var message = "User Registered Successfully.";
            // res.status(200).json({ info, token: req.body.token, message });
            

        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, "error": error });
        }
    },
    async emailregister(req, res, next) {
        try {
            const { error } = TutorRegisterValidatorSchema.validate(req.body);
            if (error) {
                return res.json({ status: 0, "error": error.message });
            }
            const { password } = req.body;
            const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
            const hashedPassword = await bcrypt.hash(password, salt);
            req.body.password = hashedPassword;

            var user;
            var aa;
            let otpverify;
            if (req.body.referralCode) {
                const tutor = await TutorRegisterSchema.findOne({
                    ownReferral: req.body.referralCode,
                })
                if (tutor) {

                    user = new TutorRegisterSchema({
                        email: req.body.email,
                        password: req.body.password,
                        registerType: "email",
                        mobileNo: req.body.mobileNo,
                        referralCode: req.body.referralCode,
                        googleVerified: 1,
                        emailVerified: 0,
                        internalStatus: 0
                    });
                    otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);

                    if (otpverify !== "OTP verified successfully") {
                        return res.status(400).json({ status: 0, error: otpverify });
                    }

                    aa = await Tutor.create(user);
                    
                    if (!aa.error) {

                        let answer = [
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
                        // console.log(aa);
                        
                        var pri = await TutorPostingStreakSchema.findOne();

                        var referralpersonal = parseFloat(pri.referralpersonalreward);
                        referralpersonal = parseFloat(referralpersonal.toFixed(2));
                        
                        let data = {
                            userId: aa._id,
                            email: aa.email,
                            referdate: Date.now(),
                            amount: referralpersonal,
                            active: false,
                            redeemed: false,
                        };
                        tutor.referralHistory.unshift(data);
                        await tutor.save();

                        aa.password = req.body.password;
                        // TutorId.class = req.body.class;
                        aa.referralCode = req.body.referralCode;
                        aa.ownReferral = generateReferralCode(aa._id);
                        aa.answeringStreak = answer;

                        await aa.save();
                        let refresh_token;
                        // access_token = await JwtService.sign({_id:document._id});
                        refresh_token = await JwtService.sign({ _id: aa._id });
                        var tt = await TokenTutorSchema.create({ _id: aa._id, token: refresh_token, expiresAt: new Date() });
                        let token = refresh_token;
                        var wal = await TutorWallet.create({ tutorId: aa._id });
                        if (!wal) {
                            return res.status(400).json({ status: 0, "error": "No created Tutor Wallet" });
                        }
                        var st_qu = await TutorQuestions.create({ tutorId: aa._id, answeredquestions: 0, refer1cashedout: false, refer2cashedout: false, refer3cashedout: false, refer4cashedout: false });
                        if (!st_qu) {
                            return res.status(400).json({ status: 0, "error": "No created Tutor Questions" });
                        }

                        var tut_bank = await TutorBankDetailsSchema.create({ tutorId: aa._id });
                        if (!tut_bank) {
                            return res.status(400).json({ status: 0, "error": "No created Tutor Bank" });
                        }
                        var tut_sub = await TutorSubjectsSchema.create({ tutorId: aa._id });
                        if (!tut_sub) {
                            return res.status(400).json({ status: 0, "error": "No created Tutor Subject" });
                        }

                        const emailContent = tutorregisterVerifyTemplate(aa._id, token);
                        // const emailContent = tutorregistrationTemplate();
            
                        const subject = "DoubtQ - Verification Email";
            
                        let emailsent = await emailSender(subject, emailContent, aa.email);
                        console.log(emailsent);
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
                        var message = "Tutor Registered Successfully.";
                        return res.status(200).json({ status: 1, info, token, message });
                        // res.json(aa);
                        // res.redirect("/student/home");
                    } else {
                        return res.status(400).json({ status: 0, "error": aa.error });
                        // res.redirect("/student/register");
                    }
                }
                else {
                    var message = "Invalid Referral code!";
                    return res.status(400).json({ status: 0, message });
                }

            } else {
                
                user = new TutorRegisterSchema({
                    email: req.body.email,
                    password: req.body.password,
                    mobileNo: req.body.mobileNo,
                    registerType: "email",
                    googleVerified: 1,
                    emailVerified: 0,
                    internalStatus: 0
                });

                otpverify = await verifyPhoneOtp(req.body.otp, req.body.mobileNo);

                if (otpverify !== "OTP verified successfully") {
                    return res.status(400).json({ status: 0, error: otpverify });
                }

                aa = await Tutor.create(user);
                // console.log(aa);

                if (!aa.error) {

                    let answer = [
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
                    // console.log(aa);
                    // aa.password = req.body.password;
                    aa.ownReferral = generateReferralCode(aa._id);
                    aa.answeringStreak = answer;

                    await aa.save();

                    let refresh_token;
                    // access_token = await JwtService.sign({_id:document._id});
                    refresh_token = await JwtService.sign({ _id: aa._id });
                    var tt = await TokenTutorSchema.create({ _id: aa._id, token: refresh_token, expiresAt: new Date() });
                    let token = refresh_token;
                    var wal = await TutorWallet.create({ tutorId: aa._id });
                    if (!wal) {
                        return res.status(400).json({ status: 0, "error": "No created Tutor Wallet" });
                    }
                    var st_qu = await TutorQuestions.create({ tutorId: aa._id, answeredquestions: 0, refer1cashedout: false, refer2cashedout: false, refer3cashedout: false, refer4cashedout: false });
                    if (!st_qu) {
                        return res.status(400).json({ status: 0, "error": "No created Tutor Questions" });
                    }
                    var tut_bank = await TutorBankDetailsSchema.create({ tutorId: aa._id });
                    if (!tut_bank) {
                        return res.status(400).json({ status: 0, "error": "No created Tutor Bank" });
                    }
                    var tut_sub = await TutorSubjectsSchema.create({ tutorId: aa._id });
                    if (!tut_sub) {
                        return res.status(400).json({ status: 0, "error": "No created Tutor Subject" });
                    }

                    // const emailContent = tutorregisterVerifyTemplate(aa._id, token);
                    const emailContent = tutorregistrationTemplate();
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
                    var info = aa;
                    var message = "Tutor Registered Successfully.";
                    return res.status(200).json({ status: 1, info, token, message });
                    // res.json(aa);
                    // res.redirect("/student/home");
                } else {
                    return res.status(400).json({ status: 0, "error": aa.error });
                    // res.redirect("/student/register");
                }

            }

        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 0, error });
        }
    },
    async personal(req, res, next) {
        try {
            tutorimage(req, res, async (err) => {
                console.log(err)
                if (err) {
                    return res.status(500).json({ status: 0, "error": err })
                }

                const { error } = TutorPersonalValidatorSchema.validate(req.body);
                if (error) {
                    return res.json({ status: 0, "error": error.message });
                }
                let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
                if (rec_token === null || !rec_token.token) {
                    return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
                }

                var tut_id = rec_token._id;

                var user;
                var imageId;
                var imageurl;
                if (req.file) {
                    const img = new TutorImageSchema();
                    img.name = req.file.filename;
                    img.data = fs.readFileSync(req.file.path);
                    img.contentType = req.file.mimetype;
                    imageurl = `data:${img.contentType};base64,${img.data.toString("base64")}`
                    const image = await img.save();

                    fs.unlinkSync(req.file.path);
                    console.log(image);
                    // const impr = await Promise.all(image);
                    imageId = image._id;
                }
                // console.log(imageId);


                const { name, mobileNo, country, gender, dob, experience } = req.body;
                let tut_info = await TutorPersonal.fetchById({ tutorId: tut_id });
                if (!tut_info) {
                    console.log("new created");
                    user = new TutorPersonalSchema({
                        tutorId: tut_id,
                        profilephoto: imageId,
                        name,
                        mobileNo,
                        country,
                        gender,
                        dob,
                        experience
                    });


                    var aa = await TutorPersonal.create(user);
                    // console.log(aa);

                    if (!aa.error) {
                        var up_tut = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                            personalDetailsFilled: true
                        }, { new: true });

                        aa.profilephoto = imageurl;
                        var info = {
                            _id: aa._id,
                            tutorId: aa.tutorId,
                            profilephoto: imageurl,
                            name: aa.name,
                            mobileNo: aa.mobileNo,
                            country: aa.country,
                            gender: aa.gender,
                            dob: aa.dob,
                            experience: aa.experience
                        };
                        var message = "Tutor Personal Registration Successfully.";
                        return res.status(200).json({ status: 1, info, message });
                        // res.json(aa);
                        // res.redirect("/student/home");
                    } else {
                        return res.status(400).json({ status: 0, "error": aa.error });
                        // res.redirect("/student/register");
                    }
                } else {
                    console.log("old");
                    console.log(tut_info.tutorId);
                    if (req.file) {
                        try {
                            if (tut_info.profilephoto === "") {

                            } else {
                                const data = await TutorImageSchema.deleteOne({ _id: tut_info.profilephoto });
                                // console.log("data - ", data);

                            }

                        } catch (error) {
                            console.log("at error - ", error);

                        }
                    }
                    user = await TutorPersonalSchema.findByIdAndUpdate(tut_info._id, {
                        ...(req.file && { profilephoto: imageId }),
                        name,
                        mobileNo,
                        country,
                        gender,
                        dob,
                        experience
                    }, { new: true });


                    // var aa = await TutorPersonal.create(user);
                    // console.log(user);

                    if (user) {
                        var up_tut = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                            internalStatus: 1
                        }, { new: true });
                        // var info = user;

                        const images = await TutorImageSchema.find({ _id: { $in: user.profilephoto } });
                        // console.log(images);

                        // Map the image data to base64 URLs
                        // const imageUrls = question.questionPhoto.map(image => {
                        // const imageUrls = images.map((image) => {
                        //     // console.log(image);
                        //     return `data:${image.contentType};base64,${image.data.toString('base64')}`;
                        // });
                        var imgurl = `data:${images[0].contentType};base64,${images[0].data.toString('base64')}`;
                        // console.log(imageUrls);
                        // info.profilephoto = imageUrls;

                        var info = {
                            _id: user._id,
                            tutorId: user.tutorId,
                            profilephoto: imgurl,
                            name: user.name,
                            mobileNo: user.mobileNo,
                            country: user.country,
                            gender: user.gender,
                            dob: user.dob,
                            experience: user.experience
                        };

                        // console.log("info - ",info);
                        var message = "Tutor Personal Registration Successfully.";
                        return res.status(200).json({ status: 1, info, message });
                        // res.json(aa);
                        // res.redirect("/student/home");
                    } else {
                        console.log(user);
                        return res.status(400).json({ status: 0, "error": "something went wrong" });
                        // res.redirect("/student/register");
                    }

                }
            })



        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 0, error });
        }
    },
    // this is now not neccessary
    async addSubjects(req, res, next) {
        try {
            const { error } = TutorAddSubjectValidatorSchema.validate(req.body);
            if (error) {
                return res.status(500).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var tutorId = rec_token._id;
            const { subjects, subjectsWithCooldown } = req.body;

            // Add subjects without cooldown period
            if (Array.isArray(subjects) && subjects.length) {
                const tutorSubjects = await TutorSubjectsSchema.findOneAndUpdate(
                    { tutorId },
                    { $addToSet: { subjects: { $each: subjects } } },
                    { upsert: true, new: true }
                );
            }

            // Add subjects with cooldown period
            if (Array.isArray(subjectsWithCooldown) && subjectsWithCooldown.length) {
                const subjectsToAdd = subjectsWithCooldown.map((subject) => ({
                    subjectName: subject.subjectName,
                    cooldownPeriod: new Date(new Date().getTime() + 30 * 24 * 60 * 60 * 1000)
                }));
                console.log(subjectsToAdd);
                const tutorSubjects = await TutorSubjectsSchema.findOneAndUpdate(
                    { tutorId },
                    { $addToSet: { subjectsWithCooldown: { $each: subjectsToAdd } } },
                    { upsert: true, new: true }
                );
            }

            return res.status(200).json({ status: 1, message: 'Subjects added successfully' });
        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 0, error: error.message });
        }
    },
    async getexamsubjectchoice(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(500).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var tutorId = rec_token._id;

            // var tut_exam_sub = await TutorExamSubjectSchema.find({}, 'subject');
            var tut_exam_sub = await QuestionSubjectSchema.find({}, 'questionSubject');
            console.log(tut_exam_sub);

            if (!tut_exam_sub || tut_exam_sub.length === 0) {
                return res.status(400).json({ status: 0, error: "No Subjects Found!" });
            }
            // const questionTypeList = tut_exam_sub.map(qt => qt.subject);

            // return res.status(200).json({ status: 1, data: questionTypeList });

            // Get the subjects with cooldown and subjects without cooldown for the tutor
            const tutorSubjects = await TutorSubjectsSchema.findOne({ tutorId }).lean();
            if (!tutorSubjects) {
                return res.status(400).json({ status: 0, error: "No Subjects Found!" });
            }



            // Get an array of subjects without cooldown and subjects with cooldown
            const subjectsWithoutCooldown = tutorSubjects.subjectsWithoutCooldown;
            const subjectsWithCooldown = tutorSubjects.subjectsWithCooldown.map((subject) => subject.subjectName);

            console.log(subjectsWithoutCooldown, subjectsWithCooldown);

            // Filter out subjects with cooldown and subjects without cooldown from the questionTypeList
            const filteredQuestionTypeList = tut_exam_sub
                .map(qt => qt.questionSubject)
                .filter((subject) => !subjectsWithoutCooldown.includes(subject) && !subjectsWithCooldown.includes(subject));

            return res.status(200).json({ status: 1, data: filteredQuestionTypeList });


        } catch (error) {
            console.log(error);
            return res.status(500).json({ status: 0, error: error.message });
        }
    },
    async professional(req, res, next) {
        try {
            upload(req, res, async (err) => {
                if (err) {
                    return res.status(500).json({ status: 0, "error": error });
                }
                const { error } = TutorProfessionalValidatorSchema.validate(req.body);
                if (error) {
                    return res.status(500).json({ status: 0, "error": error.message });
                }
                let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
                if (rec_token === null || !rec_token.token) {
                    return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
                }

                var tut_id = rec_token._id;

                var user;
                var imageId;
                var imgurl;
                // Save the uploaded image to the Image schema
                if (req.file) {
                    const img = new TutorDocumentSchema();
                    img.name = req.file.filename;
                    img.data = fs.readFileSync(req.file.path);
                    img.contentType = req.file.mimetype;
                    imgurl = `data:${img.contentType};base64,${img.data.toString('base64')}`;
                    const image = await img.save();
                    fs.unlinkSync(req.file.path);
                    // console.log(image);
                    // const impr = await Promise.all(image);
                    imageId = image._id;
                }

                const { degree_choice, degree, degree_specialisation, clg_name, clg_city, gpa } = req.body;

                let tut_info = await TutorProfessional.fetchById({ tutorId: tut_id });
                if (tut_info) {
                    if (req.file) {
                        await TutorDocumentSchema.deleteOne({ _id: tut_info.degree_image });
                    }
                    user = await TutorProfessionalSchema.findByIdAndUpdate(tut_info._id, {
                        degree_choice,
                        ...(req.file && { degree_image: imageId }),
                        degree,
                        degree_specialisation,
                        clg_name,
                        clg_city,
                        gpa
                    }, { new: true });


                    // var aa = await TutorProfessional.create(user);
                    // console.log(aa);

                    if (user) {
                        var up_tut = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                            internalStatus: 4
                        });
                        // var info = user;
                        var info = {
                            _id: user._id,
                            tutorId: user.tutorId,
                            degree_choice: user.degree_choice,
                            degree: user.degree,
                            degree_image: imgurl,
                            degree_specialisation: user.degree_specialisation,
                            clg_name: user.clg_name,
                            clg_city: user.clg_city,
                            gpa: user.gpa
                        }
                        var message = "Tutor Professional Registration Successfully.";
                        return res.status(200).json({ status: 1, info, message });
                        // res.json(aa);
                        // res.redirect("/student/home");
                    } else {
                        console.log(user);
                        return res.status(400).json({ status: 0, "error": "Something get wrong!" });
                        // res.redirect("/student/register");
                    }

                } else {
                    if (!req.file) {
                        return res.status(500).json({ status: 0, message: "please select image" });
                    }
                    user = new TutorProfessionalSchema({
                        tutorId: tut_id,
                        degree_choice,
                        degree_image: imageId,
                        degree,
                        degree_specialisation,
                        clg_name,
                        clg_city,
                        gpa
                    });


                    var aa = await TutorProfessional.create(user);
                    console.log(aa);

                    if (!aa.error) {
                        var up_tut = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                            internalStatus: 4
                        });
                        // var info = aa;

                        const images = await TutorDocumentSchema.find({ _id: { $in: aa.degree_image } });
                        // console.log(images);

                        // Map the image data to base64 URLs
                        // const imageUrls = question.questionPhoto.map(image => {
                        // const imageUrls = images.map((image) => {
                        //     // console.log(image);
                        //     return `data:${image.contentType};base64,${image.data.toString('base64')}`;
                        // });

                        var imgurl = `data:${images[0].contentType};base64,${images[0].data.toString('base64')}`;

                        // info.degree_image = imageUrls;

                        var info = {
                            _id: aa._id,
                            tutorId: aa.tutorId,
                            degree_choice: aa.degree_choice,
                            degree: aa.degree,
                            degree_image: imgurl,
                            degree_specialisation: aa.degree_specialisation,
                            clg_name: aa.clg_name,
                            clg_city: aa.clg_city,
                            gpa: aa.gpa
                        }

                        var message = "Tutor Professional Registration Successfully.";
                        return res.status(200).json({ status: 1, info, message });
                        // res.json(aa);
                        // res.redirect("/student/home");
                    } else {
                        return res.status(400).json({ status: 0, "error": aa.error });
                        // res.redirect("/student/register");
                    }
                }


            })

        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async bankdetails(req, res, next) {
        try {
            const { error } = TutorBankDetailsValidatorSchema.validate(req.body);
            if (error) {
                return res.status(500).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var tut_id = rec_token._id;
            console.log('tutor id = ', tut_id);
            const { name, country, bankName, accountNumber, IFSCCode, accountType, panCard } = req.body;

            var tut_bank = await TutorBankDetailsSchema.findOne({ tutorId: tut_id });
            console.log(tut_bank);
            // console.log('tutor id from bank = ', tut_bank._id);
            if (tut_bank) {
                var tut_bank1 = await TutorBankDetailsSchema.findByIdAndUpdate(tut_bank._id, {
                    bankcountry: country,
                    Tutorbankname: name,
                    bankName,
                    accountNumber,
                    IFSCCode,
                    accountType,
                    panCard
                }, { new: true });
                console.log(tut_bank1);
                if (tut_bank1) {

                    const up_tut = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                        internalStatus: 5,
                    }, { new: true })

                    var info = tut_bank1;
                    var message = "Bank Details Saved Successfully.";

                    return res.status(200).json({ status: 1, info, message });
                } else {
                    return res.status(500).json({ status: 0, error: "Something went Wrong!" });
                }
            } else {
                var tut_bank = new TutorBankDetailsSchema({
                    tutorId: tut_id,
                    bankcountry: country,
                    Tutorbankname: name,
                    bankName,
                    accountNumber,
                    IFSCCode,
                    accountType,
                    panCard
                });

                var tutor_bank = await TutorBankDetailsSchema.create(tut_bank);
                console.log("created - ", tutor_bank);
                if (tutor_bank) {

                    const up_tut = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                        internalStatus: 5
                    }, { new: true })

                    var info = tutor_bank;
                    var message = "Bank Details Saved Successfully.";

                    return res.status(200).json({ status: 1, info, message });

                } else {
                    return res.status(500).json({ status: 0, error: "Something went Wrong!" });
                }
            }


        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async addscreentime(req, res, next) {
        try {
            const { error } = TutorAddScreenTimeValidatorSchema.validate(req.body);
            if (error) {
                return res.status(500).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var tutorId = rec_token._id;
            console.log('tutor id = ', tutorId);
            const { screenTime } = req.body;

            const currentDate = new Date();
            const endOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0, 23, 59, 59, 999);
            // const endOfMonth = "2023-03-28T18:29:59.999Z";
            // Check if a document with this tutorId exists in the collection
            let tutorTiming = await TutorTimingSchema.findOne({ tutorId }).exec();

            // If not, create a new document with default values
            if (!tutorTiming) {
                tutorTiming = new TutorTimingSchema({
                    tutorId,
                    screenTime: 0,
                    updatedAt: currentDate,
                });
            }

            // Check if the updatedAt field is in the same month as the current date
            console.log("tutor- updatedat == ", tutorTiming.updatedAt);
            console.log("current end of month == ", endOfMonth);

            if (tutorTiming.updatedAt < endOfMonth) {
                tutorTiming.screenTime += screenTime;
                tutorTiming.updatedAt = currentDate;
            } else {
                tutorTiming.screenTime = screenTime;
                tutorTiming.updatedAt = currentDate;
            }

            // Save the updated document
            await tutorTiming.save();

            return res.status(200).json({
                status: 0,
                info: tutorTiming,
                message: "Tutor Timing Updated."
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    },
    async googlelogin(req, res, next) {

        const { idToken } = req.body;

        try {
            const payload = await validateGoogleToken(idToken);

            try {
                // const user = new TutorRegisterSchema({
                //     email: req.user.email,
                //     googleId: req.user.googleId,
                //     registerType: "google"
                // });
                // var aa = await Tutor.create(user);
                let email = payload.email;
                let googleId = payload.sub;

                const user = await Tutor.fetchById({ email: email });
                // if(!user) return next(CustomErrorHandler.wrongCredential());
                if (!user) {
                    return res.status(400).json({ status: 0, "error": "Email is not Registered!" });
                }

                if (user.googleId !== googleId) {
                    return res.status(400).json({ status: 0, "error": "This Email is not Registered with Google!" });
                }

                var refresh_token;
                try {
                    var r_t = await TokenTutor.fetchById({ _id: user._id });
                    // console.log(`r_t = ${r_t}`);
                    if (r_t === "al") {
                        refresh_token = await JwtService.sign({ _id: user._id });
                        // user.token = refresh_token;
                        console.log("New Generated");

                        await TokenTutorSchema.create({ _id: user._id, token: refresh_token, expiresAt: new Date() });

                    } else {
                        refresh_token = r_t.token;
                        // console.log("already exist");
                    }
                } catch (error) {
                    console.log("error generated");
                }
                var message = "Tutor Login Successfully.";
                var info = user;
                return res.status(200).json({ status: 1, info, token: refresh_token, message });
            } catch (err) {
                return next(err);
            }
        }
        catch (err) {
            return next(err);
        }
    },
    async emaillogin(req, res, next) {
        try {
            const { error } = TutorLoginValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            let { email, password } = req.body;
            const user = await Tutor.fetchById({ email: email });
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
                var r_t = await TokenTutor.fetchById({ _id: user._id });
                // console.log(`r_t = ${r_t}`);
                if (r_t === "al") {
                    refresh_token = await JwtService.sign({ _id: user._id });
                    // user.token = refresh_token;
                    console.log("New Generated");

                    await TokenTutorSchema.create({ _id: user._id, token: refresh_token, expiresAt: new Date() });

                } else {
                    refresh_token = r_t.token;
                    // console.log("already exist");
                }
            } catch (error) {
                console.log("error generated");
            }
            var message = "Tutor Login Successfully.";
            var info = user;
            return res.status(200).json({ status: 1, info, token: refresh_token, message });
        } catch (err) {
            return next(err);
        }
    },
    async logout(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            const del = await TokenTutor.delete({ token: rec_token.token });
            // console.log(del);
            if (del.acknowledged === true) {
                return res.status(200).json({ status: 0, message: "Logged out successful" });
            } else {
                return res.status(400).json({ status: 0, error: "Error in Logging out Tutor!" });
            }
        } catch (err) {
            console.log(err);
            return next(CustomErrorHandler.somethingwrong());
        }
    },
    async getinfo(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var st_id = rec_token._id;

            var info = await TutorInformation.fetchById({ userId: st_id });
            var message = "User details Fetched Successfully.";
            return res.status(200).json({ status: 1, info, message });



        } catch (err) {
            console.log(err);
            return next(CustomErrorHandler.somethingwrong());
        }
    },
    async setinfo(req, res, next) {
        try {
            const { error } = TutorSetInfoValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var st_id = rec_token._id;
            const { name, email, board, city, school } = req.body;
            let st_info = await TutorInformation.fetchById({ userId: st_id });
            if (st_info) {
                var updated_st = await TutorInformationSchema.findByIdAndUpdate(st_info._id, {
                    name,
                    email,
                    board,
                    city,
                    school
                }, { new: true });
                const message = "Tutor Information Created Successfully.";
                return res.status(200).json({ status: 0, updated_st, message });
            } else {
                const ownReferral = generateReferralCode(st_id);
                var new_st = new TutorInformationSchema({
                    userId: st_id,
                    name,
                    email,
                    board,
                    city,
                    school,
                    ownReferral
                });

                var info = await TutorInformation.create(new_st);
                const message = "Tutor Information Created Successfully.";
                return res.status(200).json({ status: 1, info, message });
            }
        } catch (err) {
            console.log(err);
            return next(CustomErrorHandler.somethingwrong());
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
            return res.status(200).json({ status: 0, message });



        } catch (err) {
            console.log(err);
            return next(CustomErrorHandler.somethingwrong());
        }
    },
    async sendanswer(req, res, next) {
        try {
            const { error } = TutorSendAnswerValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            const { answer, explanation } = req.body;

            var questionId = new ObjectId(req.body.questionId);

            var tut_id = rec_token._id;

            var ans_cnt;

            var question = await MainQuestionsSchema.findById(questionId);

            if (question) {
                if (tut_id.equals(question.tutorId) && (question.internalStatus === 'AssignedAnswer' || question.internalStatus === 'FixedAnswer')) {

                    var tut_q = await TutorQuestionsSchema.findOne({ tutorId: tut_id });

                    ans_cnt = tut_q.answeredquestions;

                    var tut_name = await TutorRegisterSchema.findOne({ _id: tut_id });
                    
                    if(tut_name.status === 1){
                        if (ans_cnt >= 3) {

                            var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                                status: 2
                            }, { new: true });
            
                            const message = "You have completed your trial period, kindly wait for 2 -3 business day to verify your account";
                            return res.status(200).json({ status: 1, message });
            
                        }


                        var tut_que = await TutorQuestionsSchema.findOneAndUpdate(
                            {
                                tutorId: tut_id,
                                "allQuestions.questionId": questionId
                            },
                            {
                                $set: {
                                    "allQuestions.$.status": "Answered",
                                    "allQuestions.$.answer": answer,
                                    "answer.$.explanation": explanation
                                },
                                $inc: { "answeredquestions": 1 }
                            }
                        );
    
                        if (!tut_que) {
                            return next(CustomErrorHandler.somethingwrong());
                        }
    
                        var tut_q = await TutorQuestionsSchema.findOne({ tutorId: tut_id });
    
                        // ans_cnt = tut_q.answeredquestions;
    
    
                        // var tut_wal = await TutorWalletSchema.findOne({ tutorId: tut_id })
    
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
    
                            // tut_wal.availableAmount += parseFloat(question.tutorPrice);
                            // tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);
                            // tut_wal.earningAmount += parseFloat(question.tutorPrice);
    
                            // const transaction = {
                            //     transactionId: await generateTransactionId(),
                            //     questionId: question._id,
                            //     date: new Date(),
                            //     type: "Answer given",
                            //     amount: parseFloat(question.tutorPrice),
                            //     description: `Payment for ${typename} question`,
                            //     status: "Success",
                            //     balance: tut_wal.availableAmount
                            // };
                            // let name;
                            // let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
                            // name = "tutor";
                            // if (tutorname) {
                            //     name = tutorname.name;
                            // }
    
                            // const centraltransaction = {
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
                            // })
                            // if (!centaltransactiondetails) {
                            //     return res.status(400).json({ status: 0, error: "central transaction not created!" });
                            // }
                            // await centaltransactiondetails.save();
                            // tut_wal.walletHistory.unshift(transaction);
    
                            // await tut_wal.save();
    
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
                            // if (reanswerchoice) {
                            //     tut_wal.pendingAmount += parseFloat(question.tutorPrice);
                            // } else {
                            //     tut_wal.availableAmount += parseFloat(question.tutorPrice);
                            //     tut_wal.earningAmount += parseFloat(question.tutorPrice);
                            // }
                            // tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);
    
                            // const transaction = {
                            //     transactionId: await generateTransactionId(),
                            //     questionId: question._id,
                            //     date: new Date(),
                            //     type: "Answer given",
                            //     amount: parseFloat(question.tutorPrice),
                            //     description: `Payment for ${typename} question`,
                            //     status: reanswerchoice ? "Pending" : "Success",
                            //     balance: tut_wal.availableAmount
                            // };
                            // let name;
                            // let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
                            // name = "tutor";
                            // if (tutorname) {
                            //     name = tutorname.name;
                            // }
    
                            // const centraltransaction = {
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
                            // })
                            // if (!centaltransactiondetails) {
                            //     return res.status(400).json({ status: 0, error: "central transaction not created!" });
                            // }
                            // await centaltransactiondetails.save();
                            // tut_wal.walletHistory.unshift(transaction);
                            // await tut_wal.save();
                        }
    
    
                        /* old code 
                        var tutor = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                            questionassigned: false
                        }, { new: true });
    
                        if (!tutor) {
                            return next(CustomErrorHandler.somethingwrong());
                        }
                        */
    
                        // new code - start
                        var tut_que = await TutorQuestionsSchema.findOne({ tutorId: question.tutorId });
    
                        if (tut_que.pendingQuestions.length === 0) {
                            var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(question.tutorId, {
                                $set: {
                                    assignquestionId: "",
                                    questionassigned: false
                                }
                            }, { new: true });
                        } else {
    
                            var id = tut_que.pendingQuestions[tut_que.pendingQuestions.length - 1].questionId;
                            var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(question.tutorId, {
                                $set: {
                                    assignquestionId: id,
                                    questionassigned: true
                                }
                            }, { new: true });
                        }
                        // new code ends
    
                        
    
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

                        const student = await StudentInformationSchema.findById(question.studentId);

                        // if (!student) {
                        //     return res.status(400).json({ status: 0, error: "student not found" });
                        // }
                        let studentname = "Student";

                        const emailContent = questionanswerTemplate(studentname);

                        const subject = "DoubtQ - Answer submitted"
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
                        const message = "Answer Submitted Successfully.";
                        return res.status(200).json({ status: 1, message });


                    }else if(tut_name.status === 3 || tut_name.status === 4){
                    
                    var tut_que = await TutorQuestionsSchema.findOneAndUpdate(
                        {
                            tutorId: tut_id,
                            "allQuestions.questionId": questionId
                        },
                        {
                            $set: {
                                "allQuestions.$.status": "Answered",
                                "allQuestions.$.answer": answer,
                                "answer.$.explanation": explanation
                            },
                            $inc: { "answeredquestions": 1 }
                        }
                    );

                    if (!tut_que) {
                        return next(CustomErrorHandler.somethingwrong());
                    }

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
                        let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
                        name = "tutor";
                        if (tutorname) {
                            name = tutorname.name;
                        }

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
                        let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
                        name = "tutor";
                        if (tutorname) {
                            name = tutorname.name;
                        }

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


                    /* old code 
                    var tutor = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                        questionassigned: false
                    }, { new: true });

                    if (!tutor) {
                        return next(CustomErrorHandler.somethingwrong());
                    }
                    */

                    // new code - start
                    var tut_que = await TutorQuestionsSchema.findOne({ tutorId: question.tutorId });

                    if (tut_que.pendingQuestions.length === 0) {
                        var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(question.tutorId, {
                            $set: {
                                assignquestionId: "",
                                questionassigned: false
                            }
                        }, { new: true });
                    } else {

                        var id = tut_que.pendingQuestions[tut_que.pendingQuestions.length - 1].questionId;
                        var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(question.tutorId, {
                            $set: {
                                assignquestionId: id,
                                questionassigned: true
                            }
                        }, { new: true });
                    }
                    // new code ends

                    

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

                    const student = await StudentInformationSchema.findById(question.studentId);
                    if (!student) {
                        return res.status(400).json({ status: 0, error: "student not found" });
                    }
                    let studentname = "Student";

                    const emailContent = questionanswerTemplate(studentname);

                    const subject = "DoubtQ - Answer submitted"
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
                    const message = "Answer Submitted Successfully.";
                    return res.status(200).json({ status: 1, message });

                    }else{
                        return res.status(200).json({ status: 1, message: "you will not be able to answer"})
                    }
                    // tutor payment is remaining is done in above status change portion

                } else {
                    return res.status(401).json({ status: 0, message: "UnAuthorised Tutor!" })
                }
            } else {
                return res.status(401).json({ status: 0, message: "UnAuthorised Question!" })
            }

            // if (ans_cnt >= 3) {

            //     var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
            //         status: 2
            //     }, { new: true });

            //     const message = "You have completed your trial period, kindly wait for 2 -3 business day to verify your account";
            //     return res.status(200).json({ status: 1, message });

            // } else {
            //     const student = await StudentInformationSchema.findById(question.studentId);

            //     if (!student) {
            //         return res.status(400).json({ status: 0, error: "student not found" });
            //     }
            //     let studentname = "Student";

            //     const emailContent = questionanswerTemplate(studentname);

            //     const subject = "DoubtQ - Answer submitted"
            //     let emailsent = await emailSender(subject, emailContent, student.email);

            //     if (emailsent === "Email sent") {
            //         // const message = "New Password Sent to Mail Successfully.";
            //         console.log(emailsent);
            //         // return res.status(200).json({ status: 1, message });
            //     } else {
            //         const error = "Mail Sending was Unsuccessful.";
            //         console.log(error);
            //         // return res.status(401).json({ status: 0, error });
            //     }
            //     const message = "Answer Submitted Successfully.";
            //     return res.status(200).json({ status: 1, message });
            // }


        } catch (err) {
            console.log(err);
            return next(CustomErrorHandler.somethingwrong());
        }
    },
    async unsolvedsendanswer(req, res, next) {
        try {
            const { error } = TutorSendUnsolvedAnswerValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            const { answer, explanation } = req.body;

            var questionId = new ObjectId(req.body.questionId);

            var tut_id = rec_token._id;
            var question = await MainQuestionsSchema.findOne({ _id: questionId });
            var ans_cnt;
            // console.log(questionId)
            if (question) {
                // const tutorId = await MainQuestionsSchema.findOne({ tutorId: tut_id });
                console.log(question.tutorId, tut_id);
                if (question.tutorId.equals(tut_id)) {
                    var tut_que = await TutorQuestionsSchema.findOneAndUpdate(
                        {
                            tutorId: tut_id,
                            "allQuestions.questionId": questionId
                        },
                        {
                            $set: { "allQuestions.$.status": "Answered", "allQuestions.$.answer": answer, "answer.$.explanation": explanation },
                            $inc: { "answeredquestions": 1 }
                        }, { new: true }
                    );

                    var tut_q = await TutorQuestionsSchema.findOne({ tutorId: tut_id });

                    ans_cnt = tut_q.answeredquestions;

                    if (!tut_que) {
                        console.log(tut_que)

                    }

                    let tut_info = await TutorRegisterSchema.findOne({_id: tut_id});

                    if(tut_info){
                        return res.status(400).json({ status: 0, error: "tutor not found" });
                    }

                    if(tut_info.status === 1){

                        if (ans_cnt >= 3) {

                            var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                                status: 2
                            }, { new: true });
            
                            const message = "You have completed your trial period, kindly wait for 2 -3 business day to verify your account";
                            return res.status(200).json({ status: 1, message });
            
                        }

                        var reanswerchoice = await ReAnswerChoiceSchema.find({ choice: { $eq: true } });
                    var question = await MainQuestionsSchema.findById(questionId);
                    if (question.whomto_ask === 'reanswer') {
                        question.reAnswer = answer;
                        question.reExplanation = explanation;
                        question.internalStatus = "Answered";
                        question.status = "Closed";
                        question.whomto_ask = "";
                        paymentGoesTo = tut_id;
                    } else {
                        var mainque = await MainQuestionsSchema.findByIdAndUpdate(questionId, {
                            answer,
                            explanation,
                            internalStatus: "Answered",
                            // status: "NotAnswered",
                            status: reanswerchoice ? "NotOpened" : "Closed",
                            paymentGoesTo: tut_id
                        });
                    }
                    // await UnsolvedQuestionsSchema.findOneAndRemove({ _id: mainque.unsolvedId });

                    if (!mainque) {
                        return res.status(400).json({ status: 0, error: "Question Not Found!" });
                    }

                    var typename = questionTypeName(mainque.questionType);
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

                        
                    }else if(tut_info.status === 3 || tut_info.status === 4){

                    var reanswerchoice = await ReAnswerChoiceSchema.find({ choice: { $eq: true } });
                    var question = await MainQuestionsSchema.findById(questionId);
                    if (question.whomto_ask === 'reanswer') {
                        question.reAnswer = answer;
                        question.reExplanation = explanation;
                        question.internalStatus = "Answered";
                        question.status = "Closed";
                        question.whomto_ask = "";
                        paymentGoesTo = tut_id;
                    } else {
                        var mainque = await MainQuestionsSchema.findByIdAndUpdate(questionId, {
                            answer,
                            explanation,
                            internalStatus: "Answered",
                            // status: "NotAnswered",
                            status: reanswerchoice ? "NotOpened" : "Closed",
                            paymentGoesTo: tut_id
                        });
                    }
                    // await UnsolvedQuestionsSchema.findOneAndRemove({ _id: mainque.unsolvedId });

                    if (!mainque) {
                        return res.status(400).json({ status: 0, error: "Question Not Found!" });
                    }

                    var typename = questionTypeName(mainque.questionType);
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


                    var tutor = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
                        questionassigned: false
                    }, { new: true });

                    if (!tutor) {
                        return res.status(400).json({ status: 0, error: "Tutor Not Found" });
                    }


                    // tutor payment is remaining

                    var tut_wal = await TutorWalletSchema.findOne({ tutorId: tut_id })


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
                    let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
                    name = "tutor";
                    if (tutorname) {
                        name = tutorname.name;
                    }

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

                    const message = "Answer Submitted Successfully.";
                    return res.status(200).json({ status: 1, message });

                }else{
                    return res.status(200).json({ status: 1, messgae: "you will not be able to answer"})
                }

                } else {
                    return res.status(401).json({ status: 0, message: "UnAuthorised Tutor!" })
                }
            } else {
                return res.status(401).json({ status: 0, message: "UnAuthorised Question!" })
            }


            // if (ans_cnt >= 3) {

            //     var tut_reg = await TutorRegisterSchema.findByIdAndUpdate(tut_id, {
            //         status: 2
            //     }, { new: true });

            //     const message = "You have completed your trial period, kindly wait for 2 -3 business day to verify your account";
            //     return res.status(200).json({ status: 1, message });

            // } else {
            //     const message = "Answer Submitted Successfully.";
            //     return res.status(200).json({ status: 1, message });
            // }
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error });
        }
    },
    async checkunsolvedquestion(req, res, next) {
        try {
            const { error } = TutorCheckUnsolvedQuestionValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }

            var questionId = new ObjectId(req.body.questionId);

            var tut_id = rec_token._id;
            var question = await MainQuestionsSchema.findOne({ _id: questionId });
            console.log(question)
            if (question) {
                var questiontiming = await QuestionTimingSchema.findOne({ Type: question.questionType });
                if (question.internalStatus === '') {
                    question.internalStatus = "AssignedAnswer";
                    question.tutorId = tut_id;
                    // question.tutorlist.push(tut_id);
                    var settime = questiontiming.total_time;
                    var currentTimePlusExtra = new Date();
                    currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + settime);
                    question.que_timer_end = currentTimePlusExtra;

                    await question.save();

                    const tutor = await TutorQuestionsSchema.findOne({ tutorId: tut_id });


                    const unsolvequestion = {
                        questionId: question._id,
                        question: question.question,
                        questionType: question.questionType,
                        questionSubject: question.questionSubject,
                        questionPhoto: question.questionPhoto,
                        tutorPrice: question.tutorPrice,
                        status: "Assigned"
                    }
                    await tutor.allQuestions.push(unsolvequestion);
                    console.log(tutor);

                    await tutor.save();

                    const message = "Question Assigned Successfully.";
                    return res.status(200).json({ status: 1, question, message });

                } else {
                    const message = "Question Assigned To Someone Else.";
                    return res.status(200).json({ status: 1, message });
                }


            } else {
                return res.status(401).json({ status: 0, message: "UnAuthorised Question!" })
            }



        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error });
        }
    },
    async unsolvedquestion(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            // console.log(req.params.limit,req.params.skip)
            // const limit = parseInt(req.params.limit);
            // const skip = parseInt(req.params.skip);

            const subject = await TutorSubjectsSchema.findOne({ tutorId: rec_token._id })
            console.log(subject, rec_token._id);

            const limit = parseInt(req.query.limit);
            const skip = parseInt(req.query.skip);
            const questionType = req.query.questionType;

            const query = {
                status: "unsolved",
                internalStatus: "",
                // questionSubject: { $in: subject.subjects }
            };

            if (questionType) {
                query.questionType = questionType;
            }


            MainQuestionsSchema.find(query)
                .skip(skip)
                .limit(limit)
                .exec(async (error, questions) => {
                    if (error) {
                        console.error(error);
                    } else {
                        
                        if (questions.length === 0) {
                            console.log(questions)
                            return res.status(200).json({ status: 1, message: "Questions Not Found!" });
                        }

                        for (var i = 0; i < questions.length; i++) {
                            const images = await ImageSchema.find({ _id: { $in: questions[i].questionPhoto } });
                            // console.log("in images - ", images);
                            if (images) {
                                const imageUrls = images.map((image) => {
                                    return `data:${image.contentType};base64,${image.data.toString('base64')}`;
                                });
                                questions[i].questionPhoto = imageUrls;
                                // new_data.push(data[j]);
                            }
                        }

                        return res.status(200).json({ status: 1, info: questions });
                    }
                });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error });
        }
    },
    async assignquestion(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            var tut_id = rec_token._id;
            // console.log(tut_id);

            const limit = parseInt(req.query.limit);
            const skip = parseInt(req.query.skip);
            const questionType = req.query.questionType;
            // console.log(questionType);
            var aa = [];
            const document = await TutorQuestionsSchema.findOne({ tutorId: tut_id }).exec();
            if (!document) {
                return res.status(400).json({ status: 0, error: "Question not found" });
            }

            let questions = document.allQuestions.filter(q => q.status === 'Assigned');
            // console.log(questions);

            if (questionType) {
                questions = questions.filter(q => q.questionType === questionType);
            }
            // console.log(questions);
            questions = questions.slice(skip, skip + limit);



            // const questions = document.allQuestions.filter(q => q.status === 'Assigned').slice(skip, skip + limit);
            // // console.log(questions);


            for (var i = 0; i < questions.length; i++) {
                const images = await ImageSchema.find({ _id: { $in: questions[i].questionPhoto } });
                const imageUrls = images.map((image) => {
                    return `data:${image.contentType};base64,${image.data.toString('base64')}`;
                });

                var mainque = await MainQuestionsSchema.findById(questions[i].questionId)
                var data;

                if (mainque && mainque.internalStatus === 'AssignedWithFindResponse') {
                    data = {
                        questionId: questions[i].questionId,
                        question: questions[i].question,
                        questionType: questions[i].questionType,
                        questionSubject: questions[i].questionSubject,
                        questionPhoto: imageUrls,
                        tutorPrice: questions[i].tutorPrice,
                        status: questions[i].status,
                        internalStatus: mainque.internalStatus
                    };
                    // console.log(data);

                    aa.push(data);

                }

            }
            if (aa.length === 0) {
                return res.status(200).json({ status: 1, message: "No Questions Found" })
            }
            return res.status(200).json({ status: 1, info: aa });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error });
        }
    },
    async question(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, "error": error.message });
            }
            let rec_token = await TokenTutor.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, "error": "Invalid refresh token!" });
            }
            var tut_id = rec_token._id;
            const limit = parseInt(req.query.limit);
            const skip = parseInt(req.query.skip);
            const ques = await TutorQuestionsSchema.findOne({ tutorId: tut_id }).select('allQuestions').slice('allQuestions', [+skip, +limit]).exec();
            if (!ques) {
                return res.status(400).json({ status: 0, error: "Question not found" });
            }
            // var questions = [];
            // var question;

            // ques.allQuestions.map(async(value,pos)=>{
            //     question = {question:value.question,questionType:value.questionType,questionSubject:value.questionSubject,tutorPrice:value.tutorPrice,status:value.status,questionPhoto:value.questionPhoto}
            //         //  console.log(question)
            //          let imageUrls;

            //         const images = await ImageSchema.find({ _id: { $in: question.questionPhoto } });
            //         // console.log(images);
            //         imageUrls = images.map((image) => {
            //                 // console.log(image);
            //                return `data:${image.contentType};base64,${image.data.toString('base64')}`;
            //                 //  question.questionPhoto = images;
            //                 // console.log(question)
            //                 // questions.push(question)
            //                 // console.log(questions)
            //             });
            //             // console.log(imageUrls)

            //     question.questionPhoto = imageUrls;
            //     // console.log(question,imageUrls)
            //     questions.push(question)
            //     console.log(questions)

            // })

            var question = [];
            for (var i = 0; i < ques.allQuestions.length; i++) {
                const images = await ImageSchema.find({ _id: { $in: ques.allQuestions[i].questionPhoto } });
                // console.log(images);
                const imageUrls = images.map((image) => {
                    // console.log(image);
                    return `data:${image.contentType};base64,${image.data.toString('base64')}`;
                    //  question.questionPhoto = images;
                    // console.log(question)
                    // questions.push(question)
                    // console.log(questions)
                });

                ques.allQuestions[i].questionPhoto = imageUrls;
                question.push(ques.allQuestions[i]);
            }

            // Map the image data to base64 URLs
            // const imageUrls = question.questionPhoto.map(image => {
            // const imageUrls = images.map((image) => {
            //     // console.log(image);
            //     return `data:${image.contentType};base64,${image.data.toString('base64')}`;
            // });

            if (question.length === 0) {
                return res.status(200).json({ status: 1, message: "No Questions Found" })
            }

            return res.status(200).json({ status: 1, info: question });

        } catch (err) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error });
        }
    },
    async tutorcontact(req, res, next) {
        try {
            const { error } = TutorcontactValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, error: error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({
                token: req.body.token,
            });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, error: "Invalid refresh token!" });
            }
            const tut_id = rec_token._id;
            console.log(tut_id);
            const { fullname, mobileNo, email, Message } = req.body;
            const document = await TutorContactSchema.create({
                userId: tut_id,
                fullname,
                mobileNo,
                email,
                Message,
            });
            document.save();
            return res.status(200).json({ status: 1, info: document });
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
            let rec_token = await TokenTutor.fetchByToken({
                token: req.body.token,
            });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, error: "Invalid refresh token!" });
            }
            const tut_id = rec_token._id;

            const tutor = await TutorRegisterSchema.findOne({ _id: tut_id });
            let document;
            if (tutor) {
                document = await TutorWalletSchema.findOne({ tutorId: tut_id });
            }
            return res.status(200).json({ status: 1, info: document });
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error });
        }
    },
    async answerstreak(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, error: error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({
                token: req.body.token,
            });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, error: "Invalid refresh token!" });
            }
            const tut_id = rec_token._id;

            var tut_que = await TutorQuestionsSchema.findOne({ tutorId: tut_id });
            console.log(tut_que);

            if (!tut_que) {
                return res.status(400).json({ status: 0, error: "No Tutor Found" });
            } else {
                var questionCount = parseInt(tut_que.answeredquestions);
                console.log(questionCount);
                // questionCount = 50;
                var answerstreak = [];
                var data = {};
                // var currency = await CurrencyConversionSchema.findOne();

                var pri = await TutorPostingStreakSchema.findOne();

                var ini = parseFloat(pri.initial);
                ini = parseFloat(ini.toFixed(2));
                var incr = parseFloat(pri.extrasum);
                incr = parseFloat(incr.toFixed(2));
                
                // console.log(ini, incr);

                var tut_infor = await TutorRegisterSchema.findOne({ _id: tut_id });

                var post_data = tut_infor.answeringStreak;


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
                answerstreak.push(data);
                data = {};
                }
                // var answeredCount = parseInt(tut_que.answeredquestions);
                // console.log(answeredCount);
                // var answerstreak = [];
                // var data = {};
                // for (var i = 0; i < 4; i++) {
                //     data.srno = i + 1;
                //     if (answeredCount <= parseInt(50) * parseInt(i + 1)) {
                //         data.filldata = answeredCount;
                //     } else {
                //         data.filldata = parseInt(50) * parseInt(i + 1);
                //     }
                //     data.totaldata = parseInt(50) * parseInt(i + 1);
                //     data.price = parseInt(1) * parseInt(i + 1);
                //     if (i === 0)
                //         data.iscashedout = tut_que.refer1cashedout;
                //     else if (i === 1)
                //         data.iscashedout = tut_que.refer2cashedout;
                //     else if (i === 2)
                //         data.iscashedout = tut_que.refer3cashedout;
                //     else if (i === 3)
                //         data.iscashedout = tut_que.refer4cashedout;
                //     console.log(data);
                //     answerstreak.push(data);
                //     data = {};
                // }   
            }
            return res.status(200).json({ status: 1, answerstreak });

        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error });
        }
    },
    async answerstreakcashout(req, res, next) {
        try {
            const { error } = TutorAnswerStreakCashOutValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, error: error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({
                token: req.body.token,
            });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, error: "Invalid refresh token!" });
            }
            const tut_id = rec_token._id;

            var tut_que = await TutorQuestionsSchema.findOne({ tutorId: tut_id });
            // console.log(tut_que);

            var pri = await TutorPostingStreakSchema.findOne();

            var ini = parseFloat(pri.initial);
            ini = parseFloat(ini.toFixed(2));
            var incr = parseFloat(pri.extrasum);
            incr = parseFloat(incr.toFixed(2));

            if (!tut_que) {
                return res.status(400).json({ status: 0, error: "No Tutor Found" });
            } else {
                var questionCount = parseInt(tut_que.answeredquestions);
                questionCount = 50;
                const { srno } = req.body;

                // srno = parseInt(srno);

                var price = 0;

                var tut_infor = await TutorRegisterSchema.findOne({ _id: tut_id });

                price = parseFloat((ini + (srno - 1)*incr).toFixed(2));

                console.log(price);

                if(srno < 11 && srno >= 1){

                    var que = parseInt(50 * srno);

                    if(questionCount >= que) {

                        if(tut_infor.answeringStreak[srno - 1].redeemed === 0) {
                            tut_infor.answeringStreak[srno - 1].redeemed = 1;

                            await tut_infor.save();


                            price = parseFloat((ini + (srno - 1)*incr).toFixed(2));

                            if (price !== 0) {
                                var tut_wal = await TutorWalletSchema.findOne({ tutorId: tut_id });
                                // console.log(tut_wal);
                                if (tut_wal) {
                                    // let price = 1;
                                    tut_wal.availableAmount += parseFloat(price);
                                    tut_wal.earningAmount += parseFloat(price);
                                    tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);
            
                                    const transaction = {
                                        transactionId: await generateTransactionId(),
                                        date: new Date(),
                                        type: "Referral",
                                        amount: price,
                                        description: `Referral Bonus`,
                                        status: "Success",
                                        balance: tut_wal.availableAmount
                                    };
                                    let name;
                                    let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
                                    name = "tutor";
                                    if (tutorname) {
                                        name = tutorname.name;
                                    }
            
                                    const centraltransaction = {
                                        category: "Tutor",
                                        walletId: tut_wal._id,
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
                                        walletId: tut_wal._id,
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
                                    tut_wal.walletHistory.unshift(transaction);
                                    await tut_wal.save();
            
                                } else {
                                    return res.status(400).json({ status: 0, error: "Tutor Wallet Not Found!" });
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

                // if (srno === 1 && answeredCount >= 50 && tut_que.refer1cashedout === false) {
                //     tut_que.refer1cashedout = true;
                //     await tut_que.save();
                //     price = parseInt(1) * (srno);

                // } else if (srno === 2 && answeredCount >= 100 && tut_que.refer2cashedout === false) {
                //     tut_que.refer2cashedout = true;
                //     await tut_que.save();
                //     price = parseInt(1) * (srno);

                // } else if (srno === 3 && answeredCount >= 150 && tut_que.refer3cashedout === false) {
                //     tut_que.refer3cashedout = true;
                //     await tut_que.save();
                //     price = parseInt(1) * (srno);

                // } else if (srno === 4 && answeredCount >= 200 && tut_que.refer4cashedout === false) {
                //     tut_que.refer4cashedout = true;
                //     await tut_que.save();
                //     price = parseInt(1) * (srno);

                // } else {
                //     return res.status(400).json({ status: 0, error: "Not Enough Answers" });
                // }

                
            }
        } catch (err) {
            console.log("error - ", err);
            return res.status(400).json({ status: 0, error: "Internal Server Error" });
        }
    },
    async referraldashboard(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, error: error.message });
            }
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({
                token: req.body.token,
            });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, error: "Invalid refresh token!" });
            }
            const tut_id = rec_token._id;

            const referralprice = await TutorPostingStreakSchema.findOne();

            if(!referralprice){
                return res.status(400).json({ status: 0, error: "tutor poststreak not found" });
            }
            
            if(referralprice.referralotherreward === 0 ){

                const tut = await TutorRegisterSchema.findOne({ _id: tut_id, 'referralHistory.verified': true });
            
                if(!tut){
                    return res.status(400).json({ status: 0, error: "tutor not found" });
                }

                const verifiedReferrals = tut.referralHistory.filter(referral => referral.verified === true);

                return res.status(200).json({ status: 1, info: verifiedReferrals });
                    
            }else{

            const tut = await TutorRegisterSchema.findOne({ _id: tut_id });
            if (!tut) {
                return res.status(400).json({ status: 0, error: "tutor not found" });
            }
            // const document = await TutorInformationSchema.findOne({ email: tut.email });
            // if (!document) {
            //     return res.status(400).json({ status: 0, error: "tutor information not found" });
            // }
            const referaldetail = tut.referralHistory;
            return res.status(200).json({ status: 1, info: referaldetail });

        }

        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error });
        }
    },
    async updatedate(req, res, next) {
        try {
            const documentsWithoutCreatedAt = await TutorRegisterSchema.find({ createdAt: { $exists: false } });

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

            return res.status(200).json({ status: 1, message: "Updated Successfully" })
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: error });
        }
    },
    async updatewallet(req, res, next) {
        try {
            const documentsWithoutCreatedAt = await TutorWalletSchema.find({ earningAmount: { $exists: false } });

            // Update each document with the current timestamp
            for (const document of documentsWithoutCreatedAt) {
                document.earningAmount = 0;
                document.paidAmount = 0;
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

            return res.status(200).json({ status: 1, message: "Updated Successfully" })
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: error });
        }
    },
    async updatereferral(req, res, next) {
        try {
            const documentsWithoutCreatedAt = await TutorRegisterSchema.find({ ownReferral: { $exists: false } });

            // Update each document with the current timestamp
            for (const document of documentsWithoutCreatedAt) {
                document.ownReferral = generateReferralCode(document._id);
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

            return res.status(200).json({ status: 1, message: "Updated Successfully" })
        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: error });
        }
    },
    async referralcomplete(req, res, next) {
        try {
            const { error } = TutorReferralCompleteValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, error: error.message });
            }
            // console.log({ token: req.body.token });
            // console.log({ token: req.body.token });
            let rec_token = await TokenTutor.fetchByToken({
                token: req.body.token,
            });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, error: "Invalid refresh token!" });
            }
            const tut_id = rec_token._id;
            // console.log(st_id);


            var { userId } = req.body;

            userId = new ObjectId(userId);
            console.log(userId);

            const result = await TutorRegisterSchema.findOne({ _id: tut_id, 'referralHistory.userId': userId });

            console.log(result);

            if (result) {
                // console.log(result);
                for (var i = 0; i < result.referralHistory.length; i++) {
                    if ((userId.equals(result.referralHistory[i].userId))) {
                        if (result.referralHistory[i].active === true && result.referralHistory[i].redeemed === false) {

                            console.log(result.referralHistory[i]);

                            const pri = await TutorPostingStreakSchema.findOne();
                            if(!pri){
                                return res.status(400).json({ status: 0, error: "tutorpostingstreak not found" });
                            }

                            // var referralpersonal = parseFloat(pri.referralpersonalreward);
                            var referralpersonal = parseInt(pri.referralpersonalreward);
                            var referralother = parseInt(pri.referralotherreward);
                            
                            var tut_wal = await TutorWalletSchema.findOne({ tutorId: tut_id });

                            
                            // console.log(st_wal);
                            if (tut_wal) {
                                // let price = 1;
                                let price = referralpersonal;
                                tut_wal.availableAmount += parseFloat(price);
                                tut_wal.earningAmount += parseFloat(price);
                                tut_wal.totalAmount = parseFloat(tut_wal.availableAmount) + parseFloat(tut_wal.pendingAmount);

                                const transaction = {
                                    transactionId: await generateTransactionId(),
                                    date: new Date(),
                                    type: "Referral",
                                    amount: price,
                                    description: `Referral Bonus`,
                                    status: "Success",
                                    balance: tut_wal.availableAmount
                                };
                                let name;
                                let tutorname = await TutorPersonalSchema.findOne({ tutorId: tut_wal.tutorId });
                                name = "tutor";
                                if (tutorname) {
                                    name = tutorname.name;
                                }

                                const centraltransaction = {
                                    category: "Tutor",
                                    walletId: tut_wal._id,
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
                                    walletId: tut_wal._id,
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
                                tut_wal.walletHistory.unshift(transaction);
                                await tut_wal.save();

                                const result = await TutorRegisterSchema.findOneAndUpdate(
                                    { _id: tut_id, 'referralHistory.userId': userId },
                                    { $set: { 'referralHistory.$.redeemed': true } },
                                    { new: true }
                                );
                                
                                if(pri.referralotherreward === 0){

                                }else{
                                    var tutorwallet = await TutorWalletSchema.findOne({ tutorId: userId });
                                    if(!tutorwallet){
                                        return res.stats(400).json({ status: 0, error: "tutor wallet not found" });
                                    }
                                    let price = referralother;
                                    tutorwallet.availableAmount += parseFloat(price);
                                    tutorwallet.earningAmount += parseFloat(price);
                                    tutorwallet.totalAmount = parseFloat(tutorwallet.availableAmount) + parseFloat(tutorwallet.pendingAmount);

                                    const transaction = {
                                        transactionId: await generateTransactionId(),
                                        date: new Date(),
                                        type: "Referfriend",
                                        amount: price,
                                        description: `Referral Bonus`,
                                        status: "Success",
                                        balance: tutorwallet.availableAmount,
                                        refertutorId: tut_id
                                    };
                                    let name;
                                    let tutorname = await TutorPersonalSchema.findOne({ tutorId: tutorwallet.tutorId });
                                    name = "tutor";
                                    if (tutorname) {
                                        name = tutorname.name;
                                    }

                                    const centraltransaction = {
                                        category: "Tutor",
                                        walletId: tut_wal._id,
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
                                        walletId: tutorwallet._id,
                                        transactionId: transaction.transactionId,
                                        name: name,
                                        date: transaction.date,
                                        type: transaction.type,
                                        amount: transaction.amount,
                                        description: transaction.description,
                                        status: transaction.status,
                                        balance: transaction.balance,
                                        refertutorId: transaction.refertutorId
                                    })
                                    if (!centaltransactiondetails) {
                                        return res.status(400).json({ status: 0, error: "central transaction not created!" });
                                    }
                                    await centaltransactiondetails.save();
                                    tutorwallet.walletHistory.unshift(transaction);
                                    await tutorwallet.save();
                                }
                            } else {
                                return res.status(400).json({ status: 0, error: "Tutor Not Found" });
                            }

                            return res.status(200).json({ status: 1, message: "Referral Bonus Redeemed" });
                        } else if (result.referralHistory[i].active === true && result.referralHistory[i].redeemed === true) {
                            // console.log("error - ", "here");
                            return res.status(400).json({ status: 0, error: "Already Redeemed" });
                        } else {
                            return res.status(400).json({ status: 0, error: "Tutor Referral is Not Activated Yet!" });
                        }
                    }



                    console.log("error - ", "here");
                    return res.status(400).json({ status: 0, error: "Already Redeemed" });

                }
            } else {
                console.log('No matching student information found.');
                return res.status(400).json({ status: 0, error: "No matching Tutor information found." });
            }






        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error });
        }
    },
    async gettutorstats(req, res, next) {
        try {
            const { error } = refreshTokenValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, error: error.message });
            }

            let rec_token = await TokenTutor.fetchByToken({
                token: req.body.token,
            });
            if (rec_token === null || !rec_token.token) {
                return res.status(400).json({ status: 0, error: "Invalid refresh token!" });
            }
            const tut_id = rec_token._id;

            var tut_que = await TutorQuestionsSchema.findOne({ tutorId: tut_id });

            if (!tut_que) {
                return res.status(400).json({ status: 0, error: "No Tutor Found!" });
            }

            var upvote = parseInt(tut_que.stats.upvoteQuestions);
            var downvote = parseInt(tut_que.stats.downvoteQuestions);

            var PRR = ((upvote) / (upvote + downvote)).toFixed(2);

            PRR = parseFloat(PRR * 100);

            // PRR.toFixed(2);

            return res.status(200).json({ status: 1, PRR, upvote, downvote });

        } catch (error) {
            console.log("error - ", error);
            return res.status(400).json({ status: 0, error: "Internal Server Error!" });
        }
    },
    async forgotpassword(req, res, next) {
        const { error } = TutorForgotPasswordValidatorSchema.validate(req.body);
        if (error) {
            return res.status(400).json({ status: 0, error: error.message });
        }

        const { email } = req.body;

        var tutor = await TutorRegisterSchema.findOne({ email: email });

        if (!tutor) {
            return res.status(400).json({ status: 0, error: "Email is not Registered!" });
        }

        var password = generatePassword();

        const salt = await bcrypt.genSalt(parseInt(SALT_FACTOR));
        const hashedPassword = await bcrypt.hash(password, salt);

        tutor.password = hashedPassword;

        await tutor.save();
        let tutorname = "Tutor"

        // Send email to user
        const emailContent = forgotpasswordTemplate(tutorname,password);

            const subject = "DoubtQ - Account New Password";

            let emailsent = await emailSender(subject, emailContent, tutor.email);
            
            if (emailsent === "Email sent") {
              const message = "New Password Sent to Mail Successfully.";
              console.log(emailsent);
            //   return res.status(200).json({ status: 1, message });
            } else {
              const error = "Mail Sending was Unsuccessful.";
              console.log(error);
            //   return res.status(401).json({ status: 0, error });
            }
            const message = "New Password Sent to Mail Successfully.";
            return res.status(200).json({ status: 1, message });

        // Use the emailContent string to send the email

        //   console.log(emailContent);



        // const mailOptions = {
        //     from: MAIL_SENDER,
        //     to: email,
        //     subject: 'DoubtQ - Account New Password',
        //     html: emailContent
        // };

        // transporter.sendMail(mailOptions, function (error, info) {
        //     if (error) {
        //         console.log(error);
        //         const message = "Mail Sending was Unsuccessful.";
        //         return res.status(401).json({ status: 0, message });
        //     } else {
        //         console.log('Email sent: ' + info.response);

        //         const message = "New Password Sent to Mail Successfully.";
        //         return res.status(200).json({ status: 1, message });
        //     }
        // });

    },

    async otp(req, res, next) {
        try {
            const { error } = TutorOTPValidatorSchema.validate(req.body);
            if (error) {
                return res.status(400).json({ status: 0, error: error.message });
            }
            let { mobileNo } = req.body;

            const tutor = await TutorRegisterSchema.findOne({ mobileNo });
            if (tutor) {
                return res
                    .status(400)
                    .json({ status: 0, error: "mobileNo already exist" });
            }
            const otp = generateotp(6);

            const tut_otp = await TutorOTPSchema.findOne({ mobileNo });
            console.log(tut_otp);
            if (tut_otp) {
                tut_otp.otp = otp;

                await tut_otp.save();

                // await fastsms(`Your OTP is ${otp}`, st_otp.mobileNo);
                return res
                    .status(200)
                    .json({ status: 1, message: `OTP send successfully - ${tut_otp.otp}` });
            } else {
                let tutorotp = await TutorOTPSchema.create({
                    mobileNo,
                    otp,
                });

                await tutorotp.save();

                // await fastsms(`Your OTP is ${otp}`,studentotp.mobileNo);
                return res.status(200).json({ status: 1, message: `OTP send successfully ${tutorotp.otp}` });
            }
        } catch (err) {
            console.log(err);
            return res
                .status(500)
                .json({ status: 0, error: "Internal Server Error" });
        }
    },

    async getmobileNo(req, res, next) {
        try {
            const document = await AdminMobileNoSchema.find({}, 'mobileNo');

            if (!document) {
                return res.status(400).json({ status: 0, error: "No MobileNo Found!" });
            }
            return res.status(200).json({ status: 1, document });

        } catch (err) {
            return res.status(500).json({ status: 0, error: "Internal Server Error " });
        }
    },

    async registerverify(req, res, next) {
        try {
        console.log('Hello Ved')
          const tutor = await TutorRegisterSchema.findOne({
            _id: req.params.id,
          });
          console.log(tutor);
          if (!tutor) {
            return res.status(400).json({ status: 0, error: "Invalid link" });
          }
          const token = await TokenTutorSchema.findOne({
            token: req.params.token,
          });
          console.log(token);
          if (!token) {
            return res.status(400).json({ status: 0, error: "Invalid link" });
          }
    
          if (tutor.emailVerified === 1) {
            return res
              .status(400)
              .json({ status: 0, error: "already verified link" });
          }
    
          tutor.emailVerified = 1;
          await tutor.save();
          
    
          const emailContent = tutorregistrationTemplate();
    
          const subject = "DoubtQ - Registration!";
    
          let emailsent = await emailSender(subject, emailContent, tutor.email);
    
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
        //   return res.redirect("https://vaidik-backend.onrender.com/tutor-register");
          return res
            .status(200)
            .json({ status: 1, message: "https://vaidik-backend.onrender.com/tutor-register" });
        } catch (err) {
            console.log("hello", err);
          return res
            .status(500)
            .json({ status: 0, error: "Internal Server Error" });
        }
      },
    
};
function generatePassword() {
    const length = 8;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * chars.length);
        password += chars[randomIndex];
    }
    return password;
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

async function verifyPhoneOtp(otp, mobileNo) {
    // const { otp, mobileNo } = req.body;
    // const user = StudentRegisterSchema.findOne({ mobileNo });
    // let message;
    // if(!user) {
    //     return message = "student not found";
    // }
    const tutorotp = await TutorOTPSchema.findOne({ mobileNo });
    if (!tutorotp) {
        return "mobileNo not found";
    }
    if (tutorotp.otp !== otp) {
        return "incorrect otp";
    }
    return "OTP verified successfully";
}

function questionTypeName(Type) {
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

export default tutorController;
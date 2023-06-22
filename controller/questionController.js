import { Student, StudentInformation, TokenStudent, StudentQuestions } from "../model/index.js";
import { StudentInformationSchema, StudentRegisterSchema, StudentWalletSchema, StudentQuestionsSchema } from "../schema/index.js";
import { StudentRegisterValidatorSchema, refreshTokenValidatorSchema, StudentLoginValidatorSchema, StudentSetInfoValidatorSchema, StudentChangePasswordValidatorSchema, StudentGoogleRegister2ValidatorSchema } from "../validators/index.js";
import CustomErrorHandler from "../service/CustomErrorHandler.js";
import bcrypt from "bcrypt";
import JwtService from "../service/JwtService.js";
import { TokenStudentSchema } from "../schema/index.js";
import { APP_URL, SALT_FACTOR } from "../config/index.js";
import studentregister from "../schema/studentregister.js";
import crypto from 'crypto';



const questionController = {
    async ask(req, res, next) {
        try {
            // const { error } = refreshTokenValidatorSchema.validate(req.body);
            // if (error) {
            //     res.status(400).json({ "error": error.message });
            // }
            // console.log({ token: req.body.token });
            let rec_token = await TokenStudent.fetchByToken({ token: req.body.token });
            if (rec_token === null || !rec_token.token) {
                res.status(400).json({ "error": "Invalid refresh token!" });
            }

            var st_id = rec_token._id;

            const { question, questionPhoto, questionType, questionSubject } = req.body;

            

            StudentQuestionsSchema.updateOne({ studentId: st_id }, { $push: { allQuestions: [{
                question,
                questionPhoto,
                questionType,
                questionSubject,
                dateOfPosted: new Date(),
                status: 'PENDING'
              }] } }, (error, result) => {
                if (error) {
                  console.error(error);
                  return;
                }
                console.log('Array of questions pushed:', result);
              });

            res.status(200).json({ message: 'Question posted successfully' });
        }catch (error) {
            return next(error);
        }
    }
};

export default questionController;
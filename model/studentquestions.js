import { StudentQuestionsSchema } from "../schema/index.js";

const studentQuestions = {
    async create(payload) {
        try{
            let document = await new StudentQuestionsSchema(payload);
            document = await document.save();
            // console.log(document);
            return document;
        }catch(err){
            // console.log('err', err);
            // if (err.code === 11000) {
            //     return { error: 'Email Already registered!' };
            // }
            return err;
        }
    },
    async fetchById(userId) {
        try{
            let document = await StudentQuestionsSchema.findOne(userId);
            return document;
        }catch(err) {
            return err;
        }
    }
};
export default studentQuestions;
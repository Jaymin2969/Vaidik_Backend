import { MainQuestionsSchema } from "../schema/index.js";

const MainQuestions = {
    async create(payload) {
        try{
            let document = await new MainQuestionsSchema(payload);
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
    async findById(userId) {
        try{
            let document = await MainQuestionsSchema.findOne(userId);
            return document;
        }catch(err) {
            return err;
        }
    }
};
export default MainQuestions;
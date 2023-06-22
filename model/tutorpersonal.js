import { TutorPersonalSchema } from "../schema/index.js";

const TutorPersonal = {
    async create(payload) {
        try{
            let document = await new TutorPersonalSchema(payload);
            document = await document.save();
            // console.log(document);
            return document;
        }catch(err){
            // console.log('err', err);
            if (err.code === 11000) {
                return { error: 'Email Already registered!' };
            }
            // return err;
        }
    },
    async fetchById(userId) {
        try{
            let document = await TutorPersonalSchema.findOne(userId);
            return document;
        }catch(err) {
            return err;
        }
    }
};
export default TutorPersonal;
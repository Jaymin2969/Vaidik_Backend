import { TutorRegisterSchema } from "../schema/index.js";

const Tutor = {
    async create(payload) {
        try{
            let document = await new TutorRegisterSchema(payload);
            document = await document.save();
            console.log(document);
            return document;
        }catch(err){
            // console.log('err', err);
            if (err.code === 11000) {
                return { error: 'Email Already registered!' };
            } else{
                return { error: err};
            }
            // return err;
        }
    },
    async fetchById(userId) {
        try{
            let document = await TutorRegisterSchema.findOne(userId);
            return document;
        }catch(err) {
            return err;
        }
    }
};
export default Tutor;
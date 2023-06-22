import { StudentRegisterSchema } from "../schema/index.js";

const student = {
    async create(payload) {
        try{
            let document = await new StudentRegisterSchema(payload);
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
            let document = await StudentRegisterSchema.findOne(userId);
            return document;
        }catch(err) {
            return err;
        }
    }
};
export default student;
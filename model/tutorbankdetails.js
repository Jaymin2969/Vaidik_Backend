import { TutorBankDetailsSchema } from "../schema/index.js";

const TutorBankDetails = {
    async create(payload) {
        try{
            let document = await new TutorBankDetailsSchema(payload);
            document = await document.save();
            // console.log(document);
            return document;
        }catch(err){
            // console.log('err', err);
            if (err.code === 11000) {
                return { error: 'Tutor Already registered!' };
            }
            else {
                return { error: err }
            }
            // return err;
        }
    },
    async fetchById(userId) {
        try{
            let document = await TutorBankDetailsSchema.findOne(userId);
            return document;
        }catch(err) {
            return err;
        }
    }
};
export default TutorBankDetails;
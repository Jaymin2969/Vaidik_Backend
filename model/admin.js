import { AdminSchema } from "../schema/index.js";

const admin = { 
    async create(payload) {
        try{
            let document = await new AdminSchema(payload);
            document = await document.save();
            return document;
        }catch(err){
            return err;
        }
    },
    async fetchById(userId) {
        try{
            let document = await AdminSchema.findOne(userId);
            return document;
        }catch(err) {
            return err;
        }
    }
};

export default admin;
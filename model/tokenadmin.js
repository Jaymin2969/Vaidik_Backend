import { TokenAdminSchema } from "../schema/index.js";

const TokenAdmin = {
    async fetchById(id) {
        try{
            let document = await TokenAdminSchema.findOne(id);
            // console.log(document);
            if(document === null) {
                // console.log("inside null");
                let dd = "al";
                return dd;
            } else {
                // console.log("Start --------");
                // console.log(document);
                // console.log("end -------");
                // console.log("found");
                return document;
            }
            
        }catch(err){
            console.log("sdhhbsuhdbs");
            return err;
        }
    },
    async fetchByToken(token) {
        try{
            let document = await TokenAdminSchema.findOne(token);
            // console.log("found");
            // console.log(document);
            return document;
        }catch(err){
            console.log("sdhhbsuhdbs");
            return err;
        }
    },
    async delete(token) {
        try{
            let document = await TokenAdminSchema.deleteOne(token);
            // console.log(document);
            return document;
        }catch(err) {   
            // console.log("djsdsg");
            return err;
        }
    }
};

export default TokenAdmin;
import mongoose from "mongoose";

const TokenAdminSchema = new mongoose.Schema({

    token: { type: String, unique: true },
    expiresAt: {
        type: Date,
        required: true,
        // expires: 60*60*5 // token expires in 60 seconds
      }

});

TokenAdminSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600*24 });

export default mongoose.model('TokenAdmin', TokenAdminSchema, 'AdminTokens');
import mongoose from "mongoose";

const TokenStudentSchema = new mongoose.Schema({
    token: { type: String, unique: true },
    expiresAt: {
        type: Date,
        required: true
        // expires: 3600 // token expires in 60 seconds
      }

});

TokenStudentSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 3600 });

export default mongoose.model('TokenStudent', TokenStudentSchema, 'StudentTokens');
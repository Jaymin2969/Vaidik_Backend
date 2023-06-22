import mongoose from 'mongoose';

const StudentInformationSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegister', required: true },
    name: { type: String, required: false },
    // username: { type: String, required: true },
    // mobileNo: { type: String, required: true },
    // timezone: { type: String, required: true },
    email: { type: String, required: true},
    board: { type: String, required: false },
    city: { type: String, required: false },
    school: { type: String, required: false },
    ownReferral: { type: String, required: true },
    referralHistory: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'StudentRegister', required: false },
        email: { type: String, required: false },
        referdate: { type: Date, required: false },
        amount: { type: String, required: false },
        activated: { type: Number, required: false },
        redeemed: { type: Boolean, default: false }
    }],
    postingStreak: [{ 
        range: { type: Number, required: true },
        redeemed: { type: Number, required: true, default: 0 }
     }]
});


export default mongoose.model('StudentInformation', StudentInformationSchema, 'StudentInformation');



/*

async function generateReferralCode() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let referralCode;
    let referralCodeExists;
  
    do {
      referralCode = '';
      for (let i = 0; i < 6; i++) {
        referralCode += characters.charAt(Math.floor(Math.random() * characters.length));
      }
      referralCodeExists = await StudentRegister.exists({ referralCode });
    } while (referralCodeExists);
  
    return referralCode;
  }

*/
import mongoose from 'mongoose';

const TutorRegisterSchema = new mongoose.Schema({
    email: { type: String, required: true , unique: true},
    password: { type: String, required: false },
    googleId: { type: String, required: false },
    registerType: { type: String, enum: ['google', 'email'], required: true },
    mobileNo: { type: String, required: false },
    googleVerified: { type: Number, required: true },
    emailVerified: { type: Number, required: true },
    referralCode: { type: String, optional: false },
    profilephoto: { type: String, optional: false },
    internalStatus: { 
        type: Number, 
        required: true, 
        default: 0, 
        enum: [0, 1, 2, 3, 4, 5],
        description: '0: Default, 1: Personal Details Filled, 2: Exam Details Filled, 3: Exam Pass, 4: Professional Details Filled, 5: Bank Details Filled' 
      },
    // personalDetailsFilled: { type: Boolean, required: true, default: false },
    // examDetailsFilled: { type: Boolean, required: true, default: false },
    // isPass: { type: Number, required: false }, // 1 - pass, 0 - no results
    // professionalDetailsFilled: { type: Boolean, required: true, default: false },
    // bankDetailsFilled: { type: Boolean, required: true, default: false },
    // allDetailsFilled: { type: Boolean, required: true, default: false },
    status: { 
        type: Number, 
        required: true, 
        default: 0, 
        enum: [0, 1, 2, 3, 4, 5],
        description: '0: Start, 1: Trial Tutor, 2: Unverified Tutor, 3: Verified Tutor, 4: Warning Tutor, 5: Suspended Tutor, 9: Admin-Tutor' 
      },
    // isVerified: { type: Boolean, required: true, default: false },
    // isSuspended: { type: Boolean, required: true, default: false },
    suspensionEndDate: { type: Date, required: false },
    questionassigned: { type: Boolean, required: true, default: false },
    assignquestionId: { type: String , required: false, default: "" },
    ownReferral: { type: String, required: false },
    referralHistory: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'TutorRegister', required: false },
        email: { type: String, required: false },
        referdate: { type: Date, required: false },
        amount: { type: String, required: false },
        active: { type: Boolean, required: false },
        redeemed: { type: Boolean, default: false },
        verified: { type: Boolean, default: false }
    }],
    answeringStreak: [{ 
      range: { type: Number, required: true },
      redeemed: { type: Number, required: true, default: 0 }
   }]
},{timestamps: true});
export default mongoose.model('TutorRegister', TutorRegisterSchema, 'TutorRegister');

/*
internalstatus

0 - initial
1 - personal done
2 - exam done
3 - exam pass
4 - professional done
5 - bank done/ all done

if internal status is 5 then only move to main dashboard

if internal status is 2 then show ""

*/

/*
status

1 - start
2 - trial
3 - unverified
4 - verified
5 - warning

*/
import mongoose from "mongoose";

const TutorTimingSchema = new mongoose.Schema(
    {
        tutorId: { type: mongoose.Schema.Types.ObjectId, ref: "TutorRegister", required: true },
        screenTime: { type: Number, required: true, default: 0, /* set the default value to 0*/ },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true } // enable timestamps to automatically set createdAt
);

TutorTimingSchema.index({ screenTime: -1 });

export default mongoose.model( "TutorTiming", TutorTimingSchema, "TutorTiming" );

// // pre hook to update screenTime and updatedAt fields
// TutorTimingSchema.pre("save", function (next) {
//     const currentDate = new Date();
//     const updatedAt = new Date(this.updatedAt);

//     if (currentDate.getMonth() === updatedAt.getMonth()) {
//         // same month, update screenTime and updatedAt
//         this.screenTime += this._doc.screenTime;
//         this.updatedAt = currentDate;
//     } else {
//         // different month, only update screenTime
//         this.screenTime = this._doc.screenTime;
//         this.updatedAt = currentDate;
//     }
//     next();
// });




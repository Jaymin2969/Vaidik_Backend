import { TutorRegisterSchema, QuestionTimingSchema, TutorQuestionsSchema, MainQuestionsSchema } from '../schema/index.js';
import { ObjectId } from 'mongodb';

const findTutorAndAssignQuestion = async (question) => {
    try {
        /*
        console.log(question);
        const tutors = await TutorRegisterSchema.aggregate([
            {
                $match: {
                    // isSuspended: false,
                    status: { $in: [1, 2, 3, 4] }
                    questionassigned: false
                }
            },
            {
                $lookup: {
                    from: 'TutorSubjects',
                    localField: '_id',
                    foreignField: 'tutorId',
                    as: 'subjects'
                }
            },
            {
                $unwind: '$subjects'
            },
            {
                $unwind: '$subjects.subjects'
            },
            {
                $match: {
                    'subjects.subjects': question.questionSubject
                }
            },
            {
                $lookup: {
                    from: 'TutorTiming',
                    localField: '_id',
                    foreignField: 'tutorId',
                    as: 'timing'
                }
            },
            {
                $unwind: '$timing'
            },
            {
                $project: {
                    _id: 1,
                    screenTime: '$timing.screenTime'
                }
            },
            {
                $sort: {
                    screenTime: -1
                }
            }
        ]);
        var tutorlist = question.tutorlist;
        console.log('Matching tutors: ', tutors);
        var newtutor = '';
        if(tutors.length !== 0) {
        for (var i = 0; i < tutors.length; i++) {
            var tutorid = tutors[i]._id;
            if (tutorlist.includes(tutorid)) {
                // throw new Error('Tutor already assigned to the question');
            } else {
                newtutor = tutorid;
                break;
            }
        }}


        let assignedTutorId;

        if (newtutor !== '') {
            question.tutorlist.push(newtutor);
            await question.save();
            assignedTutorId = newtutor;
        } else {
            // If no available tutors are found, get all tutors who are not suspended and sort them by their answer/skipped question ratio
            const allTutors = await TutorRegisterSchema.aggregate([
                {
                    $match: {
                        // isSuspended: false
                        status: { $in: [1, 2, 3, 4] }
                    }
                },
                {
                    $lookup: {
                        from: 'TutorSubjects',
                        localField: '_id',
                        foreignField: 'tutorId',
                        as: 'subjects'
                    }
                },
                {
                    $unwind: '$subjects'
                },
                {
                    $unwind: '$subjects.subjects'
                },
                {
                    $match: {
                        'subjects.subjects': question.questionSubject
                    }
                },
                {
                    $lookup: {
                        from: 'TutorQuestions',
                        localField: '_id',
                        foreignField: 'tutorId',
                        as: 'questions'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        upvoteQuestions: '$questions.stats.upvoteQuestions',
                        downvoteQuestions: '$questions.stats.downvoteQuestions'
                    }
                },
                {
                    $project: {
                        _id: 1,
                        answerSkippedRatio: {
                            $cond: [
                                { $eq: ['$upvoteQuestions', 0] },
                                0,
                                {
                                    $cond: [
                                        { $eq: [{ $add: [{ $sum: '$upvoteQuestions' }, { $sum: '$downvoteQuestions' }] }, 0] },
                                        0,
                                        {
                                            $divide: [
                                                { $sum: '$upvoteQuestions' },
                                                { $add: [{ $sum: '$upvoteQuestions' }, { $sum: '$downvoteQuestions' }] }
                                            ]
                                        }
                                    ]
                                }
                            ]
                        }

                    }
                },
                {
                    $sort: {
                        answerSkippedRatio: 1
                    }
                }
            ]);


            console.log('allTutors - ', allTutors);


            // Use a round-robin approach to assign the question to one of the available tutors
            const numTutors = allTutors.length;
            if (numTutors === 0) {
                return true;
                // throw new Error('No tutors available to assign question');
            }

            var newtutor = '';
            if(allTutors.length !== 0) {
            for (var i = 0; i < allTutors.length; i++) {
                console.log("individually - ",allTutors[i]);
                var tutorid = allTutors[i]._id;
                if (tutorlist.includes(tutorid)) {
                    // throw new Error('Tutor already assigned to the question');
                } else {
                    newtutor = tutorid;
                    break;
                }
            }}

            if (newtutor !== '') {
                question.tutorlist.push(newtutor);
                await question.save();
                assignedTutorId = newtutor;
            } else {

                if(question.whomto_ask === 'reanswer') {
                    question.whomto_ask = 'reanswer';
                    question.internalStatus = '';
                    await question.save();
                } else {
                    question.whomto_ask = 'admin';
                    question.internalStatus = 'admin';
                    await question.save();
                }
            }

            // Assign the question to the tutor with the highest ratio
            // const assignedTutor = allTutors[0];
            // assignedTutorId = assignedTutor._id;
        }

        */

        // temp tutor

        let assignedTutorId = new ObjectId("641ad0a98c9ceb75cdb3c8c2");

        ///

        if (assignedTutorId) {
            // Update tutor's questions and screen time
            var timing = await QuestionTimingSchema.findOne({ Type: question.questionType });
            var settime = timing.first_time;
            var currentTimePlusExtra = new Date();
            currentTimePlusExtra.setMinutes(currentTimePlusExtra.getMinutes() + parseInt(settime));

            console.log("assignedTutorId - ", assignedTutorId);
            console.log("question - ", question);
            var tutque;
            try {

                tutque = await TutorQuestionsSchema.findOne({ tutorId: assignedTutorId });

                if(!tutque) {

                } else {
                    var data = {
                        questionId: question._id,
                            question: question.question,
                            questionType: question.questionType,
                            questionSubject: question.questionSubject,
                            questionPhoto: question.questionPhoto,
                            tutorPrice: question.tutorPrice,
                            status: "Assigned"
                    };
                    /* old code which directly send this questions to main questions 
                    tutque.allQuestions.unshift(data);
                    */

                    tutque.pendingQuestions.unshift(data);
                    await tutque.save();
                }

                // tutque = await TutorQuestionsSchema.findOneAndUpdate({ tutorId: assignedTutorId }, {
                //     $push: {
                //         allQuestions: {
                //             questionId: question._id,
                //             question: question.question,
                //             questionType: question.questionType,
                //             questionSubject: question.questionSubject,
                //             questionPhoto: question.questionPhoto,
                //             tutorPrice: question.tutorPrice,
                //             status: "Assigned"
                //         }
                //     }
                // });
                
                

            } catch (error) {
                console.log("error in tutques - ", error);
            }
            // console.log("tutque - ", tutque);

            // if(!tutque) {
            //     return false;
            // }

            // Update tutor's question assigned status

            var tutreg;
            try {

                var tut_reg = await TutorRegisterSchema.findById(assignedTutorId);

                if(tut_reg.questionassigned === true) {

                } else {
                    tut_reg.questionassigned = true;
                    tut_reg.assignquestionId = question._id;

                    await tut_reg.save();
                }

                // tutreg = await TutorRegisterSchema.findOneAndUpdate({ _id: assignedTutorId }, {
                //     $set: { questionassigned: true }
                // });

                

            } catch (error) {
                console.log("error in tutreg - ", error);
            }
            // console.log("tutreg - ", tutreg);



            // if(!tutreg) {
            //     return false;
            // }

            var new_mainque;

            try {
                if(question.whomto_ask === 'reanswer') {
                    var new_mainque = await MainQuestionsSchema.findByIdAndUpdate(question._id, {
                        tutorId: assignedTutorId,
                        internalStatus: "ReAnswerAssignedWithFindResponse",
                        que_timer_end: currentTimePlusExtra
                    }, { new: true });
                } else {
                    var new_mainque = await MainQuestionsSchema.findByIdAndUpdate(question._id, {
                        tutorId: assignedTutorId,
                        internalStatus: "AssignedWithFindResponse",
                        que_timer_end: currentTimePlusExtra
                    }, { new: true });
                }

                

            } catch (error) {
                console.log("error in new_mainque - ", error);
            }
            console.log("new_mainque - ", new_mainque);

            // if(!new_mainque) {
            //     return false;
            // }



            return true;

        } else {
            return false;
        }

    }
    catch (error) {
        console.log("error = ", error);
        return false;
    }
}

export { findTutorAndAssignQuestion };
import cron from "cron"
import { connectDB } from "../database/index.js";
import moment from 'moment-timezone';
import { TutorBankDetailsSchema, TutorPersonalSchema, TutorRegisterSchema, TutorWalletSchema, TutorsPaymentSchema } from "../schema/index.js";

connectDB();


const tutorspaymentJob = new cron.CronJob("*/45 * * * * *", async function () {
    // Your code here

    await tutpay();

});

tutorspaymentJob.start();


async function tutpay(req, res, next) {
    try {
        const now = moment.utc();
        // const now = moment.utc('2023-05-26T00:00:00Z');
        const today = now.toDate();
        const yesterday = moment.utc(today).subtract(1, 'day').toDate();

        const date = yesterday.getUTCDate();
        const month = yesterday.getUTCMonth();
        const year = yesterday.getUTCFullYear();

        const startDate = new Date(Date.UTC(year, month, date));
        const endDate = new Date(Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate()));

        console.log(`*****************************************************************************`);
        console.log(`cron for payment - [${startDate.toISOString()} - to - ${endDate.toISOString()}]`);

        const tutorRegisters = await TutorRegisterSchema.find({status: 3});
        const tutorDetails = await Promise.all(tutorRegisters.map(async (tutorRegister) => {
            const tutorPersonal = await TutorPersonalSchema.findOne({ tutorId: tutorRegister._id });
            const tutorBankDetails = await TutorBankDetailsSchema.findOne({ tutorId: tutorRegister._id });
            const tutorWallet = await TutorWalletSchema.findOne({ tutorId: tutorRegister._id, 'walletHistory.date': { $gte: new Date(startDate), $lt: new Date(endDate) } });
            if (!tutorWallet) return null;

            const transactionIds = [];

            // const amount = tutorWallet.walletHistory.reduce((acc, curr) => {
            //     if ((curr.type === 'Answer given' || curr.type === 'Referral') && curr.date >= new Date(startDate) && curr.date < new Date(endDate) && curr.isCounted === 0) {
            //         console.log(curr);
            //         curr.isCounted = 1; // set isCounted to 1
            //         transactionIds.push(curr.transactionId);
            //         tutorWallet.markModified('walletHistory'); // mark walletHistory as modified
            //         tutorWallet.save(); // save the document
            //         return acc + curr.amount;
            //     }
            //     return acc;

            // }, 0);

            let amount = 0;
            tutorWallet.walletHistory.forEach(async (curr) => {
                if ((curr.type === 'Answer given' || curr.type === 'Referral' || curr.type === 'Referfriend') && curr.date >= new Date(startDate) && curr.date < new Date(endDate) && curr.isCounted === 0) {
                    console.log(curr);
                    curr.isCounted = 1; // set isCounted to 1
                    transactionIds.push(curr.transactionId);
                    amount += curr.amount;
                }
            });
            tutorWallet.markModified('walletHistory'); // mark walletHistory as modified
            await tutorWallet.save(); // save the document

            return {
                tutorId: tutorRegister._id,
                email: tutorRegister.email,
                name: tutorPersonal ? tutorPersonal.name : "",
                bankcountry: tutorBankDetails ? tutorBankDetails.bankcountry : "",
                Tutorbankname: tutorBankDetails ? tutorBankDetails.Tutorbankname : "",
                bankName: tutorBankDetails ? tutorBankDetails.bankName : "",
                accountNumber: tutorBankDetails ? tutorBankDetails.accountNumber : "",
                IFSCCode: tutorBankDetails ? tutorBankDetails.IFSCCode : "",
                accountType: tutorBankDetails ? tutorBankDetails.accountType : "",
                panCard: tutorBankDetails ? tutorBankDetails.panCard : "",
                totalAmount: tutorWallet.totalAmount,
                availableAmount: tutorWallet.availableAmount,
                pendingAmount: tutorWallet.pendingAmount,
                earningAmount: tutorWallet.earningAmount,
                paidAmount: tutorWallet.paidAmount,
                amount,
                transactionIds
            };
        }));

        const sortedTutorDetails = tutorDetails.filter((tutorDetail) => {
            if (tutorDetail && tutorDetail.amount !== 0) {
                return true;
            }
            return false;
        }).sort((a, b) => b.amount - a.amount);
        console.log("Transactions in above range - ", sortedTutorDetails);
        var st_date, en_date;

        const year1 = today.getUTCFullYear();
        const month1 = today.getUTCMonth();
        const date1 = today.getUTCDate();

        if (date1 === 1) {
            const prevMonth = moment.utc().subtract(1, 'month');
            st_date = moment.utc([prevMonth.year(), prevMonth.month(), 15]).startOf('day').toDate();
            en_date = moment.utc([year1, month1, moment.utc([year1, month1]).daysInMonth()]).endOf('day').toDate();
        } else if (date1 > 1 && date1 < 15) {
            st_date = moment.utc([year1, month1, 1]).startOf('day').toDate();
            en_date = moment.utc([year1, month1, 14]).endOf('day').toDate();
        } else if (date1 >= 15) {
            st_date = moment.utc([year1, month1, 15]).startOf('day').toDate();
            en_date = moment.utc([year1, month1, moment.utc([year1, month1]).daysInMonth()]).endOf('day').toDate();
        }

        console.log(`Checking schema for - [${st_date.toISOString()} - to - ${en_date.toISOString()}]`);

        var tutorspaymentdoc = await TutorsPaymentSchema.findOne({
            startdate: { $eq: st_date },
            enddate: { $eq: en_date },
        })

        if (!tutorspaymentdoc) {

            const tutorpaymentnew = await TutorsPaymentSchema.create({
                startdate: st_date,
                enddate: en_date,
                pendingAmount: 0,
                paidAmount: 0
            });
            await tutorpaymentnew.save();

            console.log(tutorpaymentnew);

            if (!tutorpaymentnew) {
                console.log("Error in Creating new Tutor Payments Schema !!");
                // some work
            } else {
                for (var i = 0; i < sortedTutorDetails.length; i++) {
                    let transaction = {
                        tutorId: sortedTutorDetails[i].tutorId,
                        email: sortedTutorDetails[i].email,
                        name: sortedTutorDetails[i].name ? sortedTutorDetails[i].name : "Admin",
                        bankdetails: [{
                            bankcountry: sortedTutorDetails[i].bankcountry,
                            Tutorbankname: sortedTutorDetails[i].Tutorbankname,
                            bankName: sortedTutorDetails[i].bankName,
                            accountNumber: sortedTutorDetails[i].accountNumber,
                            IFSCCode: sortedTutorDetails[i].IFSCCode,
                            accountType: sortedTutorDetails[i].accountType,
                            panCard: sortedTutorDetails[i].panCard
                        }],
                        amount: sortedTutorDetails[i].amount,
                        isPaymentDone: 0,
                        howMuchPaymentDone: 0,
                        isPaymentCompleted: 0,
                        tran_ids_remaining: sortedTutorDetails[i].transactionIds
                    }
                    tutorpaymentnew.transaction.push(transaction);
                    tutorpaymentnew.pendingAmount += sortedTutorDetails[i].amount;

                    await tutorpaymentnew.save();
                }
            }

        } else {
            for (var i = 0; i < sortedTutorDetails.length; i++) {
                // Find the index of the transaction object that matches the tutorId
                const index = tutorspaymentdoc.transaction.findIndex((transaction) => {
                    var aa = transaction.tutorId;
                    return aa.equals(sortedTutorDetails[i].tutorId);
                    // return transaction.tutorId === sortedTutorDetails[i].tutorId;
                });

                // If an index is found, update the transaction object
                if (index !== -1) {
                    // if (sortedTutorDetails[i].isCounted === 0) {
                        tutorspaymentdoc.transaction[index].amount += sortedTutorDetails[i].amount;
                        sortedTutorDetails[i].transactionIds.forEach(async (curr) => {
                            tutorspaymentdoc.transaction[index].tran_ids_remaining.push(curr);
                        })
                    // }
                } else {
                    let transaction = {
                        tutorId: sortedTutorDetails[i].tutorId,
                        email: sortedTutorDetails[i].email,
                        name: sortedTutorDetails[i].name,
                        bankdetails: [{
                            bankcountry: sortedTutorDetails[i].bankcountry,
                            Tutorbankname: sortedTutorDetails[i].Tutorbankname,
                            bankName: sortedTutorDetails[i].bankName,
                            accountNumber: sortedTutorDetails[i].accountNumber,
                            IFSCCode: sortedTutorDetails[i].IFSCCode,
                            accountType: sortedTutorDetails[i].accountType,
                            panCard: sortedTutorDetails[i].panCard
                        }],
                        amount: sortedTutorDetails[i].amount,
                        isPaymentDone: 0,
                        howMuchPaymentDone: 0,
                        isPaymentCompleted: 0,
                        tran_ids_remaining: sortedTutorDetails[i].transactionIds
                    }
                    tutorspaymentdoc.transaction.push(transaction);
                }
                tutorspaymentdoc.pendingAmount += sortedTutorDetails[i].amount;

                await tutorspaymentdoc.save();

            }
        }
    } catch (error) {
        console.error(error);
        // res.status(500).json({ success: false, error: 'Internal server error' });
    }
}


import express from "express";
import studentRoutesLogin from "./studentlogin.js";
import studentRoutesRegister from "./studentregister.js";
import tutorRouteLogin from "./tutorlogin.js";
import tutorRouteRegister from "./tutorregister.js";
import stquestion from "./question.js";
import { studentController, tutorController, questionController, adminController, uploadsController } from "../controller/index.js";
import admin from "../schema/admin.js";

const router = express.Router();

// Middleware
router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// router.use("/student/login", studentRoutesLogin);
// router.use("/student/register", studentRoutesRegister);


router.use("/student/login/google", studentController.googlelogin);
router.use("/student/login/email", studentController.emaillogin);

router.use("/student/register/google", studentController.googleregister);
router.use("/student/register/email", studentController.emailregister);


router.post("/student/googleregister",studentController.googleregister2);
router.post("/student/logout", studentController.logout);
router.post("/student/getinfo", studentController.getinfo);
router.post("/student/setinfo", studentController.setinfo);
router.post("/student/changepassword", studentController.changepassword);
router.post("/student/reanswer", studentController.reanswer);
router.post("/student/openquestion",studentController.openstatus);	
router.post("/student/closedquestion",studentController.closedstatus);	
router.post("/student/pendingquestion",studentController.pendingstatus);	
router.post("/student/issuequestion",studentController.issuequestion);	
router.post("/student/questions",studentController.questions);
router.post("/student/contact",studentController.studentcontact);
router.post("/student/wallet",studentController.wallethistory);
router.post("/student/postingstreak",studentController.poststreak);
router.post("/student/referraldashboard",studentController.referraldashboard);
router.post("/student/registerquestion",studentController.registerquestion);
router.post("/student/referralcomplete", studentController.referralcomplete);
router.post("/student/updatedate", studentController.updatedate);
router.post("/student/couponcode",studentController.coupon);
router.post("/student/poststreakcashout",studentController.poststreakcashout);
router.post("/student/forgotpassword",studentController.forgotpassword);
router.get("/student/getclass", adminController.getclass);
router.post("/student/getotp",studentController.otp);
router.post("/student/verify/:id/:token",studentController.registerverify);
router.get("/student/getmobileno",studentController.getmobileNo);
router.post("/student/stats", studentController.studentstats);
router.post("/studentsearchquestion", studentController.studentsearchquestion);
router.post("/student/studentgetanswer", studentController.studentgetanswer);
router.post("/tutor/verify/:id/:token",tutorController.registerverify);
router.get("/student/getsubscriptionprice",studentController.getsubscriptionprice);
router.post("/student/subscription",studentController.studentsubscription);
router.get("/student/getpoststreakprice", studentController.getpoststreakprice);
router.get("/student/getthought",studentController.getthought);
router.post("/student/payment",studentController.stripepayment);



// router.use("/tutor/login", tutorRouteLogin);
// router.use("/tutor/register", tutorRouteRegister);

router.use("/tutor/login/google", tutorController.googlelogin);
router.use("/tutor/login/email", tutorController.emaillogin);

router.use("/tutor/register/google", tutorController.googleregister);
router.use("/tutor/register/email", tutorController.emailregister);

router.post("/tutor/register/google", tutorController.googleregister2);
router.post("/tutor/register/personal", tutorController.personal);
router.post("/tutor/register/professional", tutorController.professional);
router.post("/tutor/register/addsubjects", tutorController.addSubjects);
router.post("/tutor/register/bankdetails", tutorController.bankdetails);



router.post("/tutor/googleregister",tutorController.googleregister2);
router.post("/tutor/logout", tutorController.logout);
router.post("/tutor/screentime", tutorController.addscreentime);
router.post("/tutor/sendanswer", tutorController.sendanswer);
router.post("/tutor/checkunsolvedquestion", tutorController.checkunsolvedquestion);
router.post("/tutor/unsolvedquestion",tutorController.unsolvedquestion);	
router.post("/tutor/assignquestion",tutorController.assignquestion);	
router.post("/tutor/question",tutorController.question);
router.post("/tutor/unsolvedsendanswer",tutorController.unsolvedsendanswer);
router.post("/tutor/wallet",tutorController.wallethistory);
router.post("/tutor/contact",tutorController.tutorcontact);
router.post("/tutor/answerstreak",tutorController.answerstreak);
router.post("/tutor/referraldashboard",tutorController.referraldashboard);
router.post("/tutor/bankdetails",tutorController.bankdetails);
router.post("/tutor/updatedate", tutorController.updatedate);
router.post("/tutor/updatewallet", tutorController.updatewallet);
router.post("/tutor/updatereferral", tutorController.updatereferral);
router.post("/tutor/referralcomplete", tutorController.referralcomplete);
router.post("/tutor/answerstreakcashout", tutorController.answerstreakcashout);
router.post("/tutor/gettutorstats", tutorController.gettutorstats);
router.post("/tutor/forgotpassword",tutorController.forgotpassword);
router.post("/tutor/getotp",tutorController.otp);
router.get("/tutor/getmobileno",tutorController.getmobileNo);

// router.post("/student/registerandask", studentController.regandask);
// router.post("/question/ask", upload.array('questionImage', 5), questionController.ask);
// router.post("/question/ask", questionController.ask);
router.use("/question", stquestion);

// router.post("/question/answer/:id", questionController.answer);




router.post("/admin/register", adminController.register);
router.post("/admin/login", adminController.login);
router.post("/admin/logout", adminController.logout);
router.post("/admin/newuser",adminController.multipleadmin);
router.post("/admin/getadmin",adminController.getmultipleadmin);
router.post("/admin/deleteadmin/:id",adminController.destroyadmin);
router.post("/admin/adminrole",adminController.adminrole);
router.post("/admin/getadminrole",adminController.getadminrole);
router.post("/admin/role",adminController.getadminrolename);
router.post("/admin/deleteadminrole/:id",adminController.destroyadminrole);


router.post("/admin/setclass", adminController.setquestionclass);
router.post("/admin/getclass",adminController.getquestionclass);
router.post("/admin/deleteclass/:id",adminController.deletequestionclass);



router.get("/admin/getquestiontypefortiming", adminController.getquestiontypefortiming);
router.post("/admin/setquestiontiming", adminController.setquestiontiming);
router.post("/admin/getquestiontiming",adminController.getquestiontiming);
router.post("/admin/questiontiming/:id",adminController.deletequestiontiming);


router.post("/admin/setreanswer", adminController.setreanswer);
router.post("/admin/getreanswer",adminController.getreanswer);

router.get("/admin/getquestiontypeforpricing", adminController.getquestiontypeforpricing);
router.post("/admin/setquestionpricing", adminController.setquestionpricing);
router.post("/admin/getquestionpricing",adminController.getquestionpricing);
router.post("/admin/questionpricing/:id",adminController.deletequestionpricing);



router.post("/admin/setcurrencyconversion", adminController.setcurrencyconversion);
router.post("/admin/getcurrencyconversion", adminController.getcurrencyconversion);
router.post("/admin/questiontype",adminController.questiontype);
router.get("/getquestiontype", adminController.getquestiontype);
router.post("/admin/questiontype/:id",adminController.deletequestiontype);
router.post("/admin/questionsubject",adminController.questionsubject);
router.post("/admin/questionsubject/:id",adminController.deletequestionsubject);
router.post("/getquestionsubject",adminController.getquestionsubject);

router.post("/admin/verifiedtutor",adminController.verifiedtutor);
router.post("/admin/warningtutor",adminController.warningtutor);
router.post("/admin/unverifiedtutor",adminController.unverifiedtutor);
router.post("/admin/suspendtutor",adminController.suspendtutordetails);
router.post("/admin/trialtutor",adminController.trialtutor);
router.post("/admin/tutordetails/:id",adminController.tutordetails);
router.post("/admin/transactiondetails/:id",adminController.tutortransactiondetails);
router.post("/admin/tutorquestionanswer/:id",adminController.tutorquestionanswer);
router.post("/admin/tutorsinfo/:id",adminController.tutorsinfo);
router.post("/admin/tutorspayment",adminController.tutorspayment);

router.post("/admin/tutorpayment/:id",adminController.tutorpayment);
router.post("/admin/tutorminbalance",adminController.tutorminbalance);
router.post("/admin/tutorsdetails/:id",adminController.tutorallinfo);
router.post("/admin/studentlist",adminController.students);
router.post("/admin/studentdetails/:id",adminController.studentdetails);
router.post("/admin/studenttransactiondetails/:id",adminController.studenttransactiondetails);
router.post("/admin/studentquestionanswer/:id",adminController.studentquestionanswer);
router.post("/admin/getstudentcontact",adminController.getstudentcontact);
router.post("/admin/gettutorcontact",adminController.gettutorcontact);
router.post("/admin/admincontact/:id",adminController.admincontact);
// post question answer
router.post("/admin/questionpost",adminController.adminquestion);

// view question answer
router.post("/admin/adminviewquestion", adminController.adminviewquestion);
// search questions
router.post("/admin/adminsearchquestion", adminController.adminsearchquestion);
router.post("/admin/socialmedia",adminController.socialmedia);
router.post("/admin/getsocialmedia",adminController.getsocialmedia);
router.post("/admin/couponcode",adminController.coupon);
router.post("/admin/getcoupons", adminController.getcoupons);
router.post("/admin/deletecouponcode/:id",adminController.destroycoupon);
router.post("/admin/testimonial",adminController.testimonial);
router.post("/admin/testimonial/:id",adminController.destroytestimonial);
router.post("/admin/testimonialstatus/:id",adminController.testimonialstatuschange);
router.post("/admin/cms",adminController.cms);
router.post("/admin/cms/:id",adminController.destroycms);
router.post("/admin/cmsstatus/:id",adminController.cmsstatuschange);
router.post("/admin/getcms",adminController.getcms);
router.post("/admin/tutorspaymentdetails",adminController.tutorspaymentdetails);
router.post("/admin/gettestimonial",adminController.gettestimonial);
router.post("/admin/gettutorwarningquestion",adminController.gettutorwarningquestion);
router.post("/admin/gettutorwarningquestion/:id",adminController.getwarningquestion);
router.post("/admin/forgotpassword",adminController.forgotpassword);
router.post("/admin/suspendtutor/:id",adminController.suspendtutor);
router.post("/admin/tutorstatus/:id",adminController.tutorstatus);
router.post("/admin/mobileno",adminController.adminmobileNo);
router.post("/admin/getmobileno",adminController.getmobileNo);
router.post("/admin/mobileno/:id",adminController.deletemobileNo);
router.post("/admin/issuequestion",adminController.studentissuequestion);
router.post("/admin/updateissuesubject",adminController.updateissuesubject);
router.post("/admin/reactivetutor/:id",adminController.reactivatetutor);
router.post("/admin/issuesolve",adminController.adminissuesolved);
router.post("/admin/deletequestion",adminController.deletequestion);
router.post("/admin/studentpostingstreak",adminController.studentpostingstreak);
router.post("/admin/getstudentpostingstreak",adminController.getstudentpostingstreak);
// router.post("/admin/studentpostingstreak/:id",adminController.deletestudentpostingstreak);
router.post("/admin/tutorpostingstreak",adminController.tutorpostingstreak);
router.post("/admin/gettutorpostingstreak",adminController.gettutorpostingstreak);
// router.post("/admin/tutorpostingstreak/:id",adminController.deletetutorpostingstreak);
router.post("/admin/studentreferral",adminController.studentreferral);
router.post("/admin/getstudentreferral",adminController.getstudentreferral);
router.post("/admin/tutorreferral",adminController.tutorreferral);
router.post("/admin/gettutorreferral",adminController.gettutorreferral);
router.post("/admin/subscription",adminController.subscription);
router.post("/admin/getsubscription", adminController.getsubscription);
router.post("/admin/subscriptionstatuschange/:id",adminController.subscriptionstatuschange);
router.post("/admin/subscriptionpricechange/:id",adminController.updatesubscriptionprice);
router.post("/admin/paymentgateway",adminController.adminpaymentgateway);
router.post("/admin/paymentgatewaystatus/:id", adminController.adminpaymentgatewaystatus);
router.post("/admin/getpaymentgateway",adminController.getadminpaymentgatewaymethod);
router.post("/admin/thought",adminController.adminthought);
router.post("/admin/getthought",adminController.getthought);
router.post("/admin/thought/:id",adminController.deletethought);
router.post("/admin/tutorexampopup",adminController.tutorexampopup);
router.post("/admin/gettutorexampopup",adminController.gettutorexampopup);
router.post("/admin/deletetutorexampopup/:id",adminController.deletetutorexampopup);
router.post("/admin/postingguideline", adminController.postingguideline);
router.get("/download/postingguideline",adminController.downloadPdf);
router.post("/admin/adminpages",adminController.adminpages);
router.post("/admin/getadminpages", adminController.getadminpages);
router.post("/admin/deleteadminpages/:id", adminController.deleteadminpages);
router.post("/admin/answeringguideline",adminController.answeringguideline);
router.get("/download/answeringguideline",adminController.answeringguidelinedownloadPdf);
router.post("/admin/studentregisterbonus", adminController.studentregisterbonus);
router.post("/admin/getstudentregisterbonus", adminController.getadminstudentregisterbonus);
router.post("/admin/studentregisterbonus/:id", adminController.deleteadminstudentregisterbonus);



// router.post("/admin/tutorexamsubject", adminController.tutorexamsubject);
// router.get("/admin/gettutorexamsubject", adminController.gettutorexamsubject);
router.get("/admin/tutpay", adminController.tutpay);


router.post("/admin/adminwallet", adminController.adminwallet);
router.post("/admin/fetchTransactionHistory", adminController.fetchTransactionHistory);


router.post("/admin/adminquestion",adminController.adminquestions);
router.post("/admin/sendanswer",adminController.sendanswer);





// Tutor Exam 
router.post("/admin/tutorexamdetail",adminController.tutorexamdetail);
router.post("/admin/gettutorexamdetail", adminController.gettutorexamdetail);
router.post("/admin/ask/tutorexamquestion",adminController.asktutorexamquestion);
router.post("/admin/update/tutorexamquestion/:id",adminController.updatetutorexamquestion);
router.post("/admin/delete/tutorexamquestion/:id",adminController.deletetutorexamquestion);
router.post("/admin/admintutorexamverify", adminController.admintutorexamverify);
router.post("/admin/admintutorexamresponse", adminController.AdminTutorExamResponse);
router.post("/admin/updatetutorquestionanswer",adminController.updatetutorquestionanswer);

// route for tutor exam questions for tutor
router.post("/tutor/getexamsubjectchoice", tutorController.getexamsubjectchoice);
router.post("/tutor/randomizedtutorquestion", adminController.randomizedtutorquestion);
router.post("/tutor/tutorexamanswer", adminController.tutorexamanswer);
router.post("/admin/gettutorexamquestion",adminController.gettutorexamquestion);


// all question pricing

router.get("/student/getquestionprice", studentController.getquestionprice);

// dashboard stats

router.post("/admin/dashboardstats", adminController.dashboardstats);



router.get("/admin/fakedata", adminController.fakedata);
router.get("/admin/transactionssummary", adminController.transactionssummary);


// get logo

router.post("/upload", uploadsController.logoupload);
router.get("/logo/:name", uploadsController.logodownload);



// router.post("/admin/centraldbfeed", adminController.centraldbfeed);



export default router;



import express from "express";
import { tutorController } from "../controller/index.js";
import { passportConfigTutorRegister } from '../config/passporttutorregister.js';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
// const p1 = passport;
// import tutorController from "../controller/tutorController.js";
const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());
router.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: process.env.MONGO_URL })
    //   store: new MongoStore({ mongooseConnection: mongoose.connection })
}));
router.use(passport.initialize());
router.use(passport.session());

// Passport Configuration
await passportConfigTutorRegister(passport);

router.get("/", (req, res) => {
    res.render('tutorregister');
});

router.get("/auth/google", passport.authenticate("tutor-register-google", { scope: ['profile', 'email'] }));

router.get("/auth/google/callback",
    passport.authenticate("tutor-register-google", { failureRedirect: '/tutor/register' }),
    tutorController.googleregister
);

router.post("/email", tutorController.emailregister);
router.post("/google", tutorController.googleregister2);
router.post("/personal", tutorController.personal);
router.post("/professional", tutorController.professional);
router.post("/addsubjects", tutorController.addSubjects);
router.post("/bankdetails", tutorController.bankdetails);

export default router;
import express from "express";
import { tutorController } from "../controller/index.js";
import { passportConfigTutorLogin } from '../config/passporttutorlogin.js';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
// import tutorController from "../controller/tutorController.js";
const router = express.Router();

router.use(express.urlencoded({ extended: false }));
router.use(express.json());

// console.log("in login");

router.get("/", (req, res) => {
    res.render('tutorlogin');
});


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
// console.log("here");
passportConfigTutorLogin(passport);

router.get("/auth/google", passport.authenticate("tutor-login-google", { scope: ['profile', 'email'] }));

router.get("/auth/google/callback",
    passport.authenticate("tutor-login-google", { failureRedirect: '/tutor/login' }),
    tutorController.googlelogin
);
router.post("/email", tutorController.emaillogin);
export default router;
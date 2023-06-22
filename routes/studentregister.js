import express from "express";
import { studentController } from "../controller/index.js";
import { passportConfigStudentRegister } from '../config/passportstudentregister.js';
import passport from 'passport';
import session from 'express-session';
import MongoStore from 'connect-mongo';
// const p1 = passport;
// import studentController from "../controller/studentController.js";
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
await passportConfigStudentRegister(passport);

router.get("/", (req, res) => {
    res.render('studentregister');
});

router.get("/auth/google", passport.authenticate("student-register-google", { scope: ['profile', 'email'] }));

router.get("/auth/google/callback",
    passport.authenticate("student-register-google", { failureRedirect: '/student/register' }),
    studentController.googleregister
);

router.post("/email", studentController.emailregister);
router.post("/google", studentController.googleregister2);

export default router;
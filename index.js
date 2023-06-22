import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { connectDB } from "./database/index.js";
import routes from "./routes/index.js";
import { APP_PORT } from "./config/index.js";

import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

// import './automated/tutor_subject_cooldown_remover.js';
// import './automated/question_flow.js';
// import './automated/question_assigner.js';
// import "./automated/tutorspayment.js";
// import "./automated/studentsubscription.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// initialize express app
const app = express();
// app.set('/uploads', path.join(__dirname, '/uploads'));
app.set("views", path.join(__dirname, "/views"));
app.set("view engine", "ejs");

// connect database
connectDB();

// enable CORS
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });

// parse request body
app.use(bodyParser.json());

// use routes
app.use("/api/v1", routes);

// Serve the static files from the React app builds
app.use("/", express.static(path.join(__dirname, "/Student")));

app.use(express.static('Registertemplatepages'));

app.get('/tutor-register', function (req, res) {
  res.sendFile(__dirname + '/Registertemplatepages/tutorregister.html');
});

app.get('/student-register', function (req, res) {
  res.sendFile(__dirname + '/Registertemplatepages/studentregister.html');
});
// app.use('/', express.static(path.join(__dirname, '/Tutor')));
// app.use('/react/admin', express.static(path.join(__dirname, 'client-dev')));

// Any other API routes or middleware can be added here

// Handle React routing, return all requests to the respective React app builds

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname + "/Student/index.html"));
});
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname + "/Student/index.html"));
});

// app.get('/react/tutor/', (req, res) => {
//   res.sendFile(path.join(__dirname+'/Tutor/index.html'));
// });
// app.get('/react/tutor/*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/Tutor/index.html'));
// });

// app.get('/react/admin/*', (req, res) => {
//   res.sendFile(path.join(__dirname+'/client-dev/index.html'));
// });

// start server
const port = process.env.PORT || APP_PORT || 5000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});

//  this is testing

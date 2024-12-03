import express from "express";
import bodyParser from "body-parser";
import sequelize from "./config/db.js";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import session from "express-session";
import passport from "./auth.js";
import jobSeekerRoutes from "./routes/jobseekerRoutes.js";
import personalDetailsRoutes from "./routes/PersonalDetailsRoutes.js";
import professionalskillsRoutes from "./routes/professinalskillsRoutes.js";
import educationalRoutes from "./routes/educationalRoutes.js";
import employerRoutes from './routes/employerRoutes.js';
import jobpostRoutes from './routes/jobpostRoutes.js';
import companydetailsRoutes from './routes/companydetailsRoutes.js'
import ContctRoutes from "./routes/ContactRoutes.js";
import PersonalizedJobRoutes from "./routes/PersonalizedJobRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());
app.use("/uploads", express.static(path.join("uploads")));

// Existing routes
app.use("/v1/api/jobseekers", jobSeekerRoutes);
app.use("/v1/api/personal-details", personalDetailsRoutes);
app.use("/v1/api/profesional-skills", professionalskillsRoutes);
app.use("/v1/api/educational-details", educationalRoutes);
app.use("/v1/api/employer-register",employerRoutes)

app.use("/v1/api/companydetails", companydetailsRoutes);
app.use("/v1/api/contact", ContctRoutes);
app.use("/v1/app/personalizedjob", PersonalizedJobRoutes);
app.use("/v1/api/payments", paymentRoutes);
app.use("/v1/api/jobpost", jobpostRoutes);

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

app.use(passport.initialize());
app.use(passport.session());

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Error syncing database", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

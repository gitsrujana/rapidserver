import express from "express";
import bodyParser from "body-parser";
import sequelize from "./config/db.js";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
import jobSeekerRoutes from './routes/jobseekerRoutes.js';
import employerRoutes from "./routes/employerRoutes.js";
import personalDetailsRoutes from "./routes/PersonalDetailsRoutes.js";
import qualificationRoutes from "./routes/qualificationRoutes.js";
import professionalskillsRoutes from "./routes/professinalskillsRoutes.js";
import employerjobpostRoutes from './routes/employerjobpostRoutes.js'
dotenv.config();

const app = express();

app.use(cors());

app.use(bodyParser.json());
app.use("/uploads", express.static(path.join("uploads")));

app.use('/v1/api/jobseekers', jobSeekerRoutes);
app.use("/v1/api/personal-details", personalDetailsRoutes);
app.use("/v1/api/qualifications", qualificationRoutes);
app.use("/v1/api/employers", employerRoutes);
app.use("/v1/api/profesional-skills", professionalskillsRoutes);

app.use('/v1/api/employer-jobpost',employerjobpostRoutes)

sequelize
  .sync({ alter: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.error("Error syncing database", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

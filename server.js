

import express from 'express';
import bodyParser from 'body-parser';
import sequelize from './config/db.js';
import jobseekerRoutes from './routes/jobseekerRoutes.js';
import path from 'path';
import dotenv from 'dotenv';
import jobseekerPersonalDetailsRoutes from './routes/jobSeekerPersonalDetailsRoutes.js';
import jobseekerProfessionalDetailsRoutes from './routes/jobseekerProfessionalDetailsRoutes.js'
import jobseekerqualificationRoutes from './routes/jobseekerqualificationRoutes.js';
import employerRoutes from './routes/employerRoutes.js';

dotenv.config();

const app = express();


app.use(bodyParser.json());
app.use('/uploads', express.static(path.join('uploads')));


app.use('/v1/api/jobseekers', jobseekerRoutes);
app.use('/v1/api/personal-details', jobseekerPersonalDetailsRoutes);
app.use('/v1/api/professional-details', jobseekerProfessionalDetailsRoutes);
app.use('/v1/api/jobseeker-qualifications', jobseekerqualificationRoutes);

app.use('/v1/api/employers', employerRoutes);
sequelize.sync({ alter: true })
  .then(() => console.log('Database connected'))
  .catch(err => console.error('Error syncing database', err));


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

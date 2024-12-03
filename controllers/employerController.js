import Joi from 'joi';
import jwt from 'jsonwebtoken';
import Employer from '../models/employerModel.js'
import passport from 'passport';

const employerSchema=Joi.object({
    CompanyName:Joi.string().required(),
    ContactNumber:Joi.string()
    .pattern(/^[0-9]{10}$/)
    .required(),
    Email:Joi.string().required(),
    password: Joi.string().min(6).required(),
    confirmPassword: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({ "any.only": "Password must match" }),
    GstNo:Joi.string().required(),
    PancardNumber:Joi.string().required(),
    UploadGstFile:Joi.string().optional(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
  });

 export const createEmployer=async(req,res)=>{
    const {error}=employerSchema.validate(req.body);
    if(error) return res.status(400).send(error.details[0].message);

    try{
        const newEmployer=await Employer.create(req.body);
        const token = jwt.sign({ Id: newEmployer}, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ message: ' posted successfully', newEmployer, token });
    }   catch (error) {
        console.error("Error creating :", error);
        res.status(500).json({ message: 'Failed to post ', error: error.message });
    }
    };



  
     export const getAllEmployer = async (req, res) => {
        try {
          const employer = await Employer.findAll();
          res.status(200).json({ data: employer });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      };
      
     
  export    const getEmployerlById = async (req, res) => {
        const { id } = req.params;
      
        try {
          const Employer = await Employer.findByPk(id);
          if (!Employer) {
            return res.status(404).json({ message: 'Educational detail not found' });
          }
          res.status(200).json({ data: Employer });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      };
      
 
export   const updateEmployer = async (req, res) => {
        const { id } = req.params;
      
        
        const { error } = employerSchema.validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);
      
        try {
          const [updated] = await Employer.update(req.body, {
            where: { id },
          });
      
          if (!updated) {
            return res.status(404).json({ message: 'Educational detail not found' });
          }
      
       const updatedEmployer = await Employer.findByPk(id);
          res.status(200).json({
            message: 'Educational detail updated successfully',
            data: updatedEmployer,
          });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      };
      
    export  const deleteEmployer = async (req, res) => {
        const { id } = req.params;
      
        try {
          const deleted = await Employer.destroy({
            where: { id },
          });
      
          if (!deleted) {
            return res.status(404).json({ message: 'Educational detail not found' });
          }
      
          res.status(200).json({ message: 'Educational detail deleted successfully' });
        } catch (err) {
          console.error(err);
          res.status(500).json({ message: 'Server error' });
        }
      };
      
      export const LoginEmployer = async (req, res) => {
        const { error } = loginSchema.validate(req.body);
        if (error) {
          return res.status(400).json({ message: error.details[0].message });
        }
      
        const { email, password } = req.body;
        try {
          const employer = await Employer.findOne({ where: { email } });
          if (!employer) {
            return res.status(404).json({ message: "Job seeker not found" });
          }
      
          const isPasswordValid = await bcrypt.compare(password, employer.password);
          if (!isPasswordValid) {
            return res.status(401).json({ message: "Invalid password" });
          }
      
          const token = jwt.sign(
            { id: jobSeeker.id, email: employer.email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
          );
      
          res.status(200).json({ message: "Login successful", token });
        } catch (error) {
          res.status(500).json({ error: error.message });
        }
      };
      
      export const forgotPassword = async (req, res) => {
        const { email } = req.body;
      
        try {
          const user = await Employer.findByEmail(email);
          if (!user) return res.status(400).json({ message: "User not found" });
      
          const resetToken = jwt.sign({ userId: user.id }, RESET_TOKEN_SECRET, {
            expiresIn: "1h",
          });
          const resetTokenExpires = new Date(Date.now() + 60 * 60 * 1000); 
      
          await Employer.setResetToken(email, resetToken, resetTokenExpires);
      
          const resetLink = `http://localhost:3000/reset-password/${resetToken}`;
          await transporter.sendMail({
            to: email,
            subject: "Password Reset Request",
            text: `Please use the following link to reset your password: ${resetLink}`,
          });
      
          res.json({ message: "Password reset link sent to your email" });
        } catch (error) {
          res.status(500).json({ message: "Server error", error });
        }
      };
      
      export const resetPassword = async (req, res) => {
        const { token, newPassword } = req.body;
      
        try {
          const decoded = jwt.verify(token, RESET_TOKEN_SECRET);
          const user = await Employer.findByResetToken(token);
      
          if (!user)
            return res.status(400).json({ message: "Invalid or expired token" });
      
          const passwordHash = await bcrypt.hash(newPassword, 10);
          await Employer.updatePassword(user.id, passwordHash);
      
          res.json({ message: "Password has been reset successfully" });
        } catch (error) {
          res.status(500).json({ message: "Server error", error });
        }
      };
      
      
      
      export const googleAuth = passport.authenticate('google', { scope: ['profile', 'email'] });
      
      export const googleCallback = passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/dashboard',
      });
      
      export const facebookAuth = passport.authenticate('facebook', { scope: ['email'] });
      
      export const facebookCallback = passport.authenticate('facebook', {
        failureRedirect: '/login',
        successRedirect: '/dashboard',
      });
      
      export const githubAuth = passport.authenticate('github', { scope: ['user:email'] });
      
      export const githubCallback = passport.authenticate('github', {
        failureRedirect: '/login',
        successRedirect: '/dashboard', 
      });
      
      
      
      export const checkAuthStatus = (req, res) => {
        if (req.isAuthenticated()) {
          res.json({ authenticated: true, user: req.user });
        } else {
          res.json({ authenticated: false });
        }
      };
      
      export const logout = (req, res, next) => {
        req.logout((err) => {
          if (err) return next(err);
          res.redirect('/');
        });
      };
      
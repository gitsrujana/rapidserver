import express from 'express';
import {
    registerJobSeeker,
    loginJobSeeker,
    forgotPassword, resetPassword,
    getJobSeekers,
    getJobSeekerById,
    updateJobSeeker,
    deleteJobSeeker,
    sendOtp,
    verifyOtp,
    googleAuth,
    googleCallback,
    facebookAuth,
    facebookCallback,
    checkAuthStatus,
    logout,
    githubAuth, githubCallback 
} from '../controllers/jobseekerController.js'

const router = express.Router();

router.post('/register', registerJobSeeker);  
router.post('/send-otp', sendOtp);               
 router.post('/verify-otp', verifyOtp);           
 router.get('/', getJobSeekers);                  
 router.get('/:id', getJobSeekerById);          
 router.put('/:id', updateJobSeeker);             
 router.delete('/:id', deleteJobSeeker);           
 

  
router.post('/login', loginJobSeeker);            
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/google', googleAuth);
router.get('/google/callback', googleCallback);
router.get('/facebook', facebookAuth);
router.get('/facebook/callback', facebookCallback);
router.get('/status', checkAuthStatus);
router.get('/auth/github', githubAuth); 
router.get('/auth/github/callback', githubCallback);

router.get('/logout', logout);

export default router;

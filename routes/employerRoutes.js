import express from 'express'
import{
    createEmployer,
    deleteEmployer,
    getAllEmployer,
    getEmployerlById,
    updateEmployer
} from '../controllers/employerController.js';


const router =express.Router();


router.post('/register',createEmployer);
router.get('/get',getAllEmployer);
router.get("/:id", getEmployerlById);
router.put("/:id", updateEmployer);
router.delete("/:id", deleteEmployer);



export default router;
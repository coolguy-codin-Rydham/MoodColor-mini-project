import {
  adminSignIn,
  createMood,
  createNewAdmin,
  getAllMoods,
  getMoodByMood,
  updateMood,
  deleteMood,
  authMe,
} from "../controller/Admin.js";
import { verifyAdmin } from "../middlewares/AdminMiddlewares.js";
import { Router } from "express";
import AdminModel from "../model/Admin.js";
const router = Router();

// Create a new admin only for testing postman purposes
router.post("/create-new-admin", createNewAdmin);

// Login preexisting admins
router.post("/admin-login", adminSignIn);

// authMe
router.get("/me", authMe);

// Create a new palette
router.post("/mood/:mood", verifyAdmin, createMood);

// Update an existing palette
router.patch("/mood/:mood", verifyAdmin, updateMood);

//Delete a palette
router.delete("/mood/:mood", verifyAdmin, deleteMood);

// Get all palettes
router.get("/mood/all", verifyAdmin, getAllMoods);

// Get a single palette by mood
router.get("/mood/:mood", verifyAdmin, getMoodByMood);



export default router;

//Rydham
// admin
// admin

// {
//     "message": "Login successful",
//     "admin": {
//         "id": "6782b68c509ed71b16556076",
//         "name": "Rydham",
//         "username": "admin"
//     }
// }

//todo token -  eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3ODJiNjhjNTA5ZWQ3MWIxNjU1NjA3NiIsImlhdCI6MTczNjYxOTc1MCwiZXhwIjoxNzM3MjI0NTUwfQ.ChvMCjDoJiZtJnfUFmYzfVLNuoQJ7e5LXWq_PGqfnJw

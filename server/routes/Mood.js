import { Router } from "express";
import { getMood, getAllMoods } from "../controller/Mood.js";

const router = new Router();

// Get Mood by name
router.get("/:mood", getMood)

// Get All Mood
router.get("/", getAllMoods)

export default router;
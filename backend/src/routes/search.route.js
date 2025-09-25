import express from "express";
const router = express.Router();
import { searchUsers } from "../controllers/search.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

router.get('/users', protectRoute, searchUsers);

export default router;
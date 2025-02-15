import express from "express";
import {
  followUnfollowUser,
  getUserProfile,
  suggestedUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { protectRoute } from "../middlewares/protectRoute.middleware.js";

const router = express.Router();

router.get("/profile/:userName", protectRoute, getUserProfile);
router.get("/suggested", protectRoute, suggestedUsers);
router.get("/follow/:id", protectRoute, followUnfollowUser);
router.get("/update", protectRoute, updateUser);

export default router;

import { Router } from "express";

const router =Router()

import { loginuser, logout, registerUser } from "../controllers/user.controller.js";
import { verifyToken } from "../middleware/verifyToken.js";
router.route('/register').post(registerUser)
router.route('/login').post(loginuser)
router.route('/logout').post(verifyToken,logout)


export default router   
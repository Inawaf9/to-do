import { Router } from "express";

import { register, login, resetPassword, forgotPassword, logout } from "../controllers/auth.controller";

import { registerValidator, loginValidator, resetPasswordValidator, forgotPasswordValidator } from "../validators/auth.validator";
import  { validate }  from "../middleware/validate";

const router = Router();

router.post("/register", registerValidator, validate, register);

router.post("/login", loginValidator, validate, login);

router.post("/forgot-password", forgotPasswordValidator, validate, forgotPassword);

router.post("/reset-password/:resetToken", resetPasswordValidator, validate, resetPassword);

router.post("/logout", logout);


export default router;
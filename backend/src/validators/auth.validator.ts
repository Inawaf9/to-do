import { check } from "express-validator/";

export const registerValidator = [
    check("username").notEmpty().withMessage("Name is required")
        .trim()
        .isLength({ min: 3 }).withMessage("Name must be at least 3 characters long"),

    check("email").trim().isEmail().withMessage("Invalid email format"),

    check("password").notEmpty().withMessage("Password is required")
        .isStrongPassword().withMessage("Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character")
        .trim()
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),

    check("confirmPassword").notEmpty().withMessage("Confirm Password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("Passwords do not match");
            }
            return true;
        })
];

export const loginValidator = [
    check("email").trim().isEmail().withMessage("Invalid email format"),

    check("password").notEmpty().withMessage("Password is required")
        .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long"),
];

export const refreshValidator = [
    check("refreshToken").notEmpty().withMessage("Refresh token is required")
];

export const forgotPasswordValidator = [
    check("email").trim().isEmail().withMessage("Invalid email format")
];

export const resetPasswordValidator = [
    check("resetToken").notEmpty().withMessage("Reset token is required"),

    check("password").trim().notEmpty().withMessage("New password is required")
        .isLength({ min: 6 }).withMessage("New password must be at least 6 characters long")
        .isStrongPassword().withMessage("New password must contain at least one uppercase letter, one lowercase letter, one number, and one special character"),

    check("confirmPassword").notEmpty().withMessage("Confirm new password is required")
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error("New passwords do not match");
            }
            return true;
        })
];

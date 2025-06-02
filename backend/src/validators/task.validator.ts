import { body } from "express-validator/";

export const TaskValidation = [
    body('title')
    .isLength({max: 20})
    .withMessage('The title Should be less than 20 characters'),

    body('description')
    .isLength({max: 50})
    .withMessage('The description Should be less than 50 characters'),
];


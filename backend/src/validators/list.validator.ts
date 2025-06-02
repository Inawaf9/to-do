import {body} from 'express-validator/';

export const listValidator = [
    body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({min: 3})
    .withMessage('Title must be at least 3 characters')
    .isLength({max: 30})
    .withMessage('Title must be at most 30 characters')
    .isAlphanumeric()
    .withMessage('Title must contain only letters and numbers'),
]
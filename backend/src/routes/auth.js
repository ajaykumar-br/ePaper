import express from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../config/database.js';
import { generateToken } from '../config/jwt.js';
import { validateSignupInput, validateLoginInput } from '../utils/validation.js';
import { MESSAGES, STATUS_CODES, VALIDATION_RULES } from '../constants/index.js';

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        const validation = validateSignupInput(name, email, password);
        if (!validation.isValid) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                error: MESSAGES.VALIDATION_FAILED,
                details: validation.errors
            });
        }

        // Check if user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email }
        });

        if (existingUser) {
            return res.status(STATUS_CODES.CONFLICT).json({
                error: MESSAGES.EMAIL_EXISTS
            });
        }

        // Hash password
        const saltRounds = VALIDATION_RULES.BCRYPT_SALT_ROUNDS;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create new user
        const newUser = await prisma.user.create({
            data: {
                name: name?.trim() || null,
                email: email.trim().toLowerCase(),
                password: hashedPassword
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true
                // Don't return password in response
            }
        });

        // Generate JWT token
        const token = generateToken({
            userId: newUser.id,
            email: newUser.email
        }, VALIDATION_RULES.TOKEN_EXPIRES_IN);

        res.status(STATUS_CODES.CREATED).json({
            message: MESSAGES.USER_CREATED,
            user: newUser,
            token: token
        });

    } catch (error) {
        console.error("Signup error:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            error: MESSAGES.SERVER_ERROR
        });
    }
});

// Login route
router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const validation = validateLoginInput(email, password);
        if (!validation.isValid) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                error: MESSAGES.VALIDATION_FAILED,
                details: validation.errors
            });
        }

        // Find user by email
        const user = await prisma.user.findUnique({
            where: { email: email.trim().toLowerCase() }
        });

        if (!user) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                error: MESSAGES.INVALID_CREDENTIALS
            });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(STATUS_CODES.UNAUTHORIZED).json({
                error: MESSAGES.INVALID_CREDENTIALS
            });
        }

        // Generate JWT token
        const token = generateToken({
            userId: user.id,
            email: user.email
        }, VALIDATION_RULES.TOKEN_EXPIRES_IN);

        // Return user data without password
        const { password: _, ...userWithoutPassword } = user;

        res.status(STATUS_CODES.OK).json({
            message: MESSAGES.LOGIN_SUCCESS,
            user: userWithoutPassword,
            token: token
        });

    } catch (error) {
        console.error("Login error:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            error: MESSAGES.SERVER_ERROR
        });
    }
});

export default router;

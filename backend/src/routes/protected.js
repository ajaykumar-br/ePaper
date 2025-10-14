import express from 'express';
import prisma from '../config/database.js';
import { authenticateToken } from '../middleware/auth.js';
import { MESSAGES, STATUS_CODES, VALIDATION_RULES } from '../constants/index.js';

const router = express.Router();

// Apply authentication middleware to all routes in this router
router.use(authenticateToken);

// Get current user profile
router.get("/profile", async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        if (!user) {
            return res.status(STATUS_CODES.NOT_FOUND).json({
                error: MESSAGES.USER_NOT_FOUND
            });
        }

        res.status(STATUS_CODES.OK).json({ user });
    } catch (error) {
        console.error("Profile error:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            error: MESSAGES.SERVER_ERROR
        });
    }
});

// Example protected route
router.get("/protected", (req, res) => {
    res.json({
        message: "This is a protected route",
        user: req.user
    });
});

// Update user profile
router.put("/profile", async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim().length < VALIDATION_RULES.MIN_NAME_LENGTH) {
            return res.status(STATUS_CODES.BAD_REQUEST).json({
                error: `Name must be at least ${VALIDATION_RULES.MIN_NAME_LENGTH} characters long`
            });
        }

        const updatedUser = await prisma.user.update({
            where: { id: req.user.userId },
            data: { name: name.trim() },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
                updatedAt: true
            }
        });

        res.status(STATUS_CODES.OK).json({
            message: MESSAGES.PROFILE_UPDATED,
            user: updatedUser
        });
    } catch (error) {
        console.error("Profile update error:", error);
        res.status(STATUS_CODES.INTERNAL_SERVER_ERROR).json({
            error: MESSAGES.SERVER_ERROR
        });
    }
});

export default router;

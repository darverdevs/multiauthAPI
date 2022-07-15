import { Router, Request, Response } from "express";
import argon2, { argon2id } from "argon2";
import prisma from "../db";


const router = Router();

router.get("/", (_req: Request, res: Response) => res.json({
    success: true,
    message: "Auth Endpoint.",
}));
router.get("/login", (_req: Request, res: Response) => res.json({
    success: true,
    message: "Login Endpoint."
}));

// POST auth/login
router.post("/login", async (req: Request, res: Response) => {
    if (!req.body)
        return res.status(400).json({
            success: false,
            message: "No request body specified.",
        });

    const { username, password } = req.body; // Defines variables username and password from req.body
    if (!username || !password) // If the username or password field(s) are not specified in the request body, return response with status 400 (Bad Request)
        return res.status(400).json({
            success: false,
            message: "One or more required fields were missing from the request body.",
        });

    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });

    if (!user) // If a user by that username does not exist, return response with status 400 (Bad Request)
        return res.status(400).json({
            success: false,
            message: "Username or password is invalid.",
        });
    
    const passwordMatches = await argon2.verify(user.password, password, {
        type: argon2id,
    });

    if (!passwordMatches)
        return res.status(400).json({
            success: false,
            message: "Username or password is invalid.",
        });

    // TODO: Add session stuff
    return res.json({
        success: true,
        message: "Successfully logged in.",
        data: { // For easier rendering on frontend. One less request!
            uuid: user.uuid,
            username: user.username,
        },
    });
});
export default router;
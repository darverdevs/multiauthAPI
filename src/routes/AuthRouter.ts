import { Router, Request, Response } from "express";
import argon2, { argon2id } from "argon2";
import crypto from "crypto";
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
    const { username, password, session } = req.body; // Defines variables username and password from req.body
    console.log(username, password);
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

    
    return res.json({
        success: true,
        message: "Successfully logged in.",
        data: { // For easier rendering on frontend. One less request!
            uuid: user.uuid,
            username: user.username,
        },
    });
});

router.post("/register", async (req: Request, res: Response) => {
    const { username, password, uuid } = req.body;

    if (!username || !password){
        return res.status(400).json({
            success: false,
            message: "One or more required fields were missing from the request body.",
        });
    }
    const user = await prisma.user.findUnique({
        where: {
            username,
        },
    });
    const uuidGen = crypto.randomUUID();
    if (!user){
        if (password.length < 8){
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters long.",
            });
        }
        if (username.length < 3 || username.length > 20){
            return res.status(400).json({
                success: false,
                message: "Username must be between 3 and 20 characters long.",
            });
        }
        const hashedPassword = await argon2.hash(password, {
            type: argon2id,
        });
        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
                uuid: uuidGen,
            },
        });
        return res.json({
            success: true,
            message: "Successfully registered.",
            data: {
                uuid: newUser.uuid,
                username: newUser.username,
            },
        });
    }
    else{
        return res.status(400).json({
            success: false,
            message: "Username already exists.",
        });
    }
});
export default router;
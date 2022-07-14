import { Router, Request, Response } from "express";
import argon2 from "argon2";
import { PrismaClient } from "@prisma/client";
import { mainModule } from "process";
const router = Router();
const prisma = new PrismaClient(); 

router.get("/", (_req: Request, res: Response) => res.json({
    success: true,
    message: "Auth Endpoint.",
}));
router.get("/login", (_req: Request, res: Response) => res.json({
    success: true,
    message: "Login Endpoint."
}));

// POST auth/login
router.post("/login", (req: Request, res: Response) => {
    const headers = req.headers;
    const username = headers.username;
    const password = headers.password;
    if (username == undefined){
        res.status(400).json({
            success: false,
            message: "Username is required.",
        });
    }
    else if (password == undefined){
        res.status(400).json({
            success: false,
            message: "Password is required.",
        });
    }
    else{
        const saltedPassword = "3ymzgPrdRAZ0yXmx" + password;
        const hashedPassword = argon2.hash(saltedPassword);
        async function getUser() {
            const result = await prisma.user.findMany();
            return result;
        }
        getUser().then(result => {
            if (result.length == 0){
                res.status(400).json({
                    success: false,
                    message: "No users found.",
                });
            }
            else{
                // Check if username and password match
                const len_result = result.length;
                for (let i = 0; i < len_result; i++){
                    if (result[i].username == username){
                            res.status(200).json({
                                success: true,
                                message: "Login successful.",
                            });
                    }
                }
            }
        });
    }
});
export default router;
import e, { Router, Request, Response } from "express";
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
router.post("/login", async (req: Request, res: Response) => {
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
        const saltedPassword = "3ymzgPrdRAZ0yXmx" + password;  // salt is "3ymzgPrdRAZ0yXmx"
        const hashedPassword = await argon2.hash(saltedPassword);
        console.log(hashedPassword);
        const result = await prisma.user.findMany(); // This currently gets all the users, I need it to filter by username
        if (result.length == 0){
            res.status(400).json({
                success: false,
                message: "No users found.",
            });
        }
        else{
            // Check if username and password match
            const len_result = result.length;
            let passed = false;
            // The code below is a bit of a hack, not efficiant, but it works (kinda, argon2.verify() doesn't work)
            for (let i = 0; i < len_result; i++){
                if (result[i].username == username){
                    console.log(result[i])
                    if (await argon2.verify(result[i].password, hashedPassword)){
                        let passed = true;
                        res.status(200).json({
                            success: true,
                            message: "Login successful.",
                        });
                    }
                    else{
                        res.status(200).json({
                            success: false,
                            message: "Incorrect password.",
                        });
                    }
                }
            }
            // if (result[0].username == username && result[0].password == hashedPassword){
            //     res.status(200).json({
            //         success: true,
            //         message: "Login successful.",
            //     });
            // }
            // else{
            //     res.status(200).json({
            //         success: false,
            //         message: "Login failed.",
            //     });
            // }
        }
    }
});
export default router;
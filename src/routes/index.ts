import { Router, Request, Response } from "express";

const router = Router();

router.get("/", (_req: Request, res: Response) => res.json({
    success: true,
    message: "Welcome to the MultiAuth API.",
}));

export default router;
import listen from "./app";
import { config } from "dotenv";
import prisma from "./db";
config();

const verifyConnection = () =>
    new Promise<void>(async (resolve, reject) => {
        await prisma.user.findMany().catch(reject);
        resolve();
    });

verifyConnection().then(() => {
    console.log("Verified connection to the database");
    listen(parseInt(process.env.PORT!)).then(() =>
        console.log(
            `Backend is running at http://localhost:${process.env.PORT!}`
        )
    );
})
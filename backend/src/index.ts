import express from 'express';
import { appRouter } from './routes';
import cookieParser from "cookie-parser";
import dotenv from 'dotenv';
import cors from "cors";
import { prisma } from './lib/db';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


app.use(cors({origin: "http://localhost:5173", credentials: true})); 

dotenv.config();  // so that we can use process.env to access environment variables

app.use("/api", appRouter);

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
  });

  async function checkDBConnection() {
    try {
      await prisma.$connect();
      console.log("✅ Database connected successfully");
    } catch (error) {
      console.error("❌ Database connection failed:", error);
      process.exit(1); // exit the app if DB connection fails
    }
  }
  
  checkDBConnection();
const PORT = process.env.PORT || 8000;

    app.listen(PORT, () =>
    console.log("Server is running on port " + PORT));
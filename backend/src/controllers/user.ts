import { prisma } from "../lib/db";
import { Request, Response } from "express";

import { User } from "../lib/types";
import { RequestWithUser } from "../middlewares/authMiddleware";

export async function LoanApply(
  req: RequestWithUser,
  res: Response
): Promise<Response> {
  try {
    const { customerName, amount, reason } = req.body;
    console.log("req.body in loan apply", req.body);

    // Validate input
    if (!customerName || !reason || amount == null) {
      return res.status(400).json({ message: "customerName, amount, and reason are required" });
    }

    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({ message: "Amount must be a positive number" });
    }

    const userId = req.user?.id; // Assuming authenticateToken sets req.user
    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create a new loan application
    const newLoan = await prisma.
    loan.create({
      data: {
        customerName,
        amount: Number(amount),
        reason,
        status: "PENDING",
        userId, // Use userId directly
      },
    });

    return res.status(201).json(newLoan);
  } catch (error) {
    console.error("Error applying for loan:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getLoans(req: RequestWithUser , res : Response): Promise<any> {
  try {
    const loans = await prisma.loan.findMany({
        where: { userId: req.user?.id },
      });
      console.log("loans in getLoans", loans);
      res.json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    throw new Error("Internal server error");
  }
}
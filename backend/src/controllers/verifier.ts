import { prisma } from "../lib/db";
import {  Response } from "express";
import { RequestWithUser } from "../middlewares/authMiddleware";

export async function getAllLoans(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const loans = await prisma.loan.findMany({
        include: { user: true }, // Optional: Include user details if needed
      });
      console.log("All loans fetched:", loans);
      res.json(loans);
    } catch (error) {
      console.error("Error fetching all loans:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  }
  
  // Placeholder for stats (to be implemented if needed)
 

export async function updateLoanStatus(req: RequestWithUser, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body;
    console.log("req.body in updateLoanStatus", req.body);
    console.log("req.params in updateLoanStatus", req.params);
  try {

    if (!["VERIFIED", "REJECTED"].includes(status)) {
      res.status(400).json({ message: "Invalid status" });
      return;
    }
    let updatedLoan
    if(status === "REJECTED" && !req.body.rejectionReason) {
         updatedLoan = await prisma.loan.update({
          where: { id },
          data: { status ,
            rejectedById: req.user?.id || undefined,
          },
        });
    }
    if(status === "VERIFIED") {
         updatedLoan = await prisma.loan.update({
          where: { id },
          data: { status ,
            verifiedById : req.user?.id || undefined,
          },
        });
    }
    res.json(updatedLoan);
  } catch (error) {
    console.error("Error updating loan status:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
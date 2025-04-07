import { prisma } from "../lib/db";
import { Response } from "express";
import { RequestWithUser } from "../middlewares/authMiddleware";

export async function updateLoanStatus(req: RequestWithUser, res: Response): Promise<void> {
    const { id } = req.params;
    const { status } = req.body;
    console.log("req.body in updateLoanStatus", req.body);
    console.log("req.params in updateLoanStatus", req.params);
  try {

    if (!["APPROVED", "REJECTED"].includes(status)) {
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
    if(status === "APPROVED") {
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

export async function getAllUsers(req: RequestWithUser, res: Response): Promise<void> {
    try {
      const users = await prisma.user.findMany({
        where: {
          role: {
            in: ["ADMIN", "VERIFIER"]
          }
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
        },
      });
      console.log("All users fetched:", users);
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  }

  export async function deleteUser(req: RequestWithUser, res: Response): Promise<void> {
    const { id } = req.params;
    console.log("req.params in deleteUser", req.params);
    try {
      const deletedUser = await prisma.user.delete({
        where: { id },
      });
      res.json(deletedUser);
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  }
  

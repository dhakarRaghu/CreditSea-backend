import { Router } from "express";
import { getLoans, LoanApply } from "../controllers/user";

const userRoutes = Router();


userRoutes.get("/", getLoans);
userRoutes.post("/apply", LoanApply);
// userRoutes.post("/payment", UserPayment);

export { userRoutes };
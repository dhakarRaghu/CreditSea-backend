"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanApply = LoanApply;
exports.getLoans = getLoans;
const db_1 = require("../lib/db");
function LoanApply(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
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
            const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id; // Assuming authenticateToken sets req.user
            if (!userId) {
                return res.status(401).json({ message: "User not authenticated" });
            }
            // Create a new loan application
            const newLoan = yield db_1.prisma.
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
        }
        catch (error) {
            console.error("Error applying for loan:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
function getLoans(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        try {
            const loans = yield db_1.prisma.loan.findMany({
                where: { userId: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
            });
            console.log("loans in getLoans", loans);
            res.json(loans);
        }
        catch (error) {
            console.error("Error fetching loans:", error);
            throw new Error("Internal server error");
        }
    });
}

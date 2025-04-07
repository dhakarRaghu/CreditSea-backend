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
exports.getAllLoans = getAllLoans;
exports.updateLoanStatus = updateLoanStatus;
const db_1 = require("../lib/db");
function getAllLoans(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const loans = yield db_1.prisma.loan.findMany({
                include: { user: true }, // Optional: Include user details if needed
            });
            console.log("All loans fetched:", loans);
            res.json(loans);
        }
        catch (error) {
            console.error("Error fetching all loans:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}
// Placeholder for stats (to be implemented if needed)
function updateLoanStatus(req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        const { id } = req.params;
        const { status } = req.body;
        console.log("req.body in updateLoanStatus", req.body);
        console.log("req.params in updateLoanStatus", req.params);
        try {
            if (!["VERIFIED", "REJECTED"].includes(status)) {
                res.status(400).json({ message: "Invalid status" });
                return;
            }
            let updatedLoan;
            if (status === "REJECTED" && !req.body.rejectionReason) {
                updatedLoan = yield db_1.prisma.loan.update({
                    where: { id },
                    data: { status,
                        rejectedById: ((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) || undefined,
                    },
                });
            }
            if (status === "VERIFIED") {
                updatedLoan = yield db_1.prisma.loan.update({
                    where: { id },
                    data: { status,
                        verifiedById: ((_b = req.user) === null || _b === void 0 ? void 0 : _b.id) || undefined,
                    },
                });
            }
            res.json(updatedLoan);
        }
        catch (error) {
            console.error("Error updating loan status:", error);
            res.status(500).json({ message: "Internal server error" });
        }
    });
}

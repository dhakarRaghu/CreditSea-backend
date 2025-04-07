"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LoanStatus = exports.Role = void 0;
var Role;
(function (Role) {
    Role["ADMIN"] = "admin";
    Role["VERIFIER"] = "verifier";
    Role["USER"] = "user";
})(Role || (exports.Role = Role = {}));
var LoanStatus;
(function (LoanStatus) {
    LoanStatus["PENDING"] = "pending";
    LoanStatus["VERIFIED"] = "verified";
    LoanStatus["APPROVED"] = "approved";
    LoanStatus["REJECTED"] = "rejected";
})(LoanStatus || (exports.LoanStatus = LoanStatus = {}));

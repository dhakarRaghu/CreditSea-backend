"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = require("express");
const user_1 = require("../controllers/user");
const userRoutes = (0, express_1.Router)();
exports.userRoutes = userRoutes;
userRoutes.get("/", user_1.getLoans);
userRoutes.post("/apply", user_1.LoanApply);

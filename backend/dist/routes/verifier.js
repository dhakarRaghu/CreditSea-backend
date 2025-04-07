"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifierRoutes = void 0;
const express_1 = require("express");
const verifier_1 = require("../controllers/verifier");
const verifierRoutes = (0, express_1.Router)();
exports.verifierRoutes = verifierRoutes;
verifierRoutes.get("/", verifier_1.getAllLoans);
// verifierRoutes.get("/stats", getVerifierStats); // New endpoint for stats
verifierRoutes.put("/:id", verifier_1.updateLoanStatus);

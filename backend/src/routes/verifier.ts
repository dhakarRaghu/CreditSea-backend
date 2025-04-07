
import { Router } from 'express';
import { getAllLoans,  updateLoanStatus } from '../controllers/verifier';

const verifierRoutes = Router();

verifierRoutes.get("/", getAllLoans);
// verifierRoutes.get("/stats", getVerifierStats); // New endpoint for stats
verifierRoutes.put("/:id", updateLoanStatus);

export { verifierRoutes };
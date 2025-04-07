import { Router } from 'express';
import { deleteUser, getAllUsers, updateLoanStatus } from '../controllers/admin';

const adminRoutes = Router();

adminRoutes.get('/', getAllUsers);
adminRoutes.delete("/:id",deleteUser);
adminRoutes.put("/:id", updateLoanStatus );

export { adminRoutes };


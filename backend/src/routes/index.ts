import express from 'express';
import { authenticateToken } from '../middlewares/authMiddleware';
import { createUser, getMe, login, logout } from '../controllers/login';
import { Request, Response } from 'express';
import { userRoutes } from './user';
import { verifierRoutes } from './verifier';
import { adminRoutes } from './admin';
  


const appRouter = express.Router();

appRouter.post('/login', login);
appRouter.post('/signup', createUser); 
// appRouter.post('/logout', authenticateToken, logout);
appRouter.post('/getMe', authenticateToken, getMe);


appRouter.use('/loan', authenticateToken, userRoutes);
appRouter.use('/loan/verify', authenticateToken, verifierRoutes);
appRouter.use('/loan/admin', authenticateToken,adminRoutes);
appRouter.use('/users', authenticateToken,adminRoutes);



export { appRouter };
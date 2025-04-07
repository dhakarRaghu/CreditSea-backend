import { Request, Response , NextFunction } from 'express';
import { prisma } from '../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { RequestWithUser } from '../middlewares/authMiddleware';


export const createUser = async (req: Request, res: Response) => {
    console.log("req.body in createuser", req.body);
    try {
      const { name, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const existingUser = await prisma.user.findUnique({ where: { email } });
      if (existingUser) {
        res.status(201).json({ id: existingUser.id, name: existingUser.name, email: existingUser.email, role: existingUser.role });
        return
      }
      const user = await prisma.user.create({
        data: {
          name,
          email,
          password: hashedPassword,
          role,
        },
      });
      console.log("user created", user);
        if (!user) {
           res.status(400).json({ message: 'User creation failed' });
           return 
        }
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' } 
      );
  
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        domain: process.env.COOKIE_DOMAIN,
      });

      res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    } catch (error) {
      res.status(500).json({ message: 'Error creating user', error });
    }
  };

  export const login = async (req: Request, res: Response)  => {
    try {
      const { email, password } = req.body;
      const user = await prisma.user.findUnique({ where: { email } });
      if (!user || !await bcrypt.compare(password, user.password)) {
        res.status(401).json({ message: 'Invalid credentials' });
        return
      }
  
      const token = jwt.sign(
        { id: user.id, role: user.role },
        process.env.JWT_SECRET as string,
        { expiresIn: '7d' }
      );

      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000,
        domain: process.env.COOKIE_DOMAIN,
      });
  
      res.json({
        message: 'Login successful',
        user: { id: user.id, name: user.name, email: user.email, role: user.role },
      });
    } catch (error) {
      res.status(500).json({ message: 'Error logging in', error });
    }
  };


  export const logout = async (req: RequestWithUser, res: Response) => {
    try {
      res.clearCookie('token');
      res.json({ message: 'Logout successful' });
    } catch (error) {
      res.status(500).json({ message: 'Error logging out', error });
    }
  };

  export const getMe = async (req: RequestWithUser, res: Response) => {
    console.log("req.user", req.user);
    try {
      const user = await prisma.user.findUnique({
        where: { id: req.user?.id },
        select: { id: true, name: true, email: true, role: true },
      });
      if (!user) {
        res.status(404).json({ message: 'User not found' });
        return;
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching user', error });
    }
  };
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getMe = exports.logout = exports.login = exports.createUser = void 0;
const db_1 = require("../lib/db");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("req.body in createuser", req.body);
    try {
        const { name, email, password, role } = req.body;
        const hashedPassword = yield bcrypt_1.default.hash(password, 10);
        const existingUser = yield db_1.prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(201).json({ id: existingUser.id, name: existingUser.name, email: existingUser.email, role: existingUser.role });
            return;
        }
        const user = yield db_1.prisma.user.create({
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
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            domain: process.env.COOKIE_DOMAIN,
        });
        res.status(201).json({ id: user.id, name: user.name, email: user.email, role: user.role });
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating user', error });
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield db_1.prisma.user.findUnique({ where: { email } });
        if (!user || !(yield bcrypt_1.default.compare(password, user.password))) {
            res.status(401).json({ message: 'Invalid credentials' });
            return;
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '7d' });
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
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
});
exports.login = login;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        res.clearCookie('token');
        res.json({ message: 'Logout successful' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error logging out', error });
    }
});
exports.logout = logout;
const getMe = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    console.log("req.user", req.user);
    try {
        const user = yield db_1.prisma.user.findUnique({
            where: { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id },
            select: { id: true, name: true, email: true, role: true },
        });
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching user', error });
    }
});
exports.getMe = getMe;

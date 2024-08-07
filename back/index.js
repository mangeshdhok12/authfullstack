import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import UserModel from './models/UserModel.js';
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: process.env.CLIENT_ORIGIN, 
    methods: ["GET", "POST", "OPTIONS"],
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());

const connect = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
};

app.post('/register', async (req, res) => {
    const { name, username, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await UserModel.create({ name, username, password: hashedPassword });
        res.status(201).json(user);
    } catch (err) {
        console.error("Error during registration:", err);
        res.status(500).json({ error: 'Error during registration' });
    }
});

app.post('/login', async (req, res) => {
    const { username, password, captchaValue } = req.body;
    try {
        // Verify CAPTCHA
        const captchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: process.env.RECAPTCHA_SECRET_KEY,
                response: captchaValue
            }
        });

        const captchaData = captchaResponse.data;

        if (!captchaData.success) {
            return res.status(400).json("CAPTCHA verification failed");
        }

        // Handle user authentication
        const user = await UserModel.findOne({ username });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);

            if (isMatch) {
                const token = jwt.sign({ username: user.username, userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production',
                    sameSite: 'None',
                    maxAge: 24 * 60 * 60 * 1000
                });
                return res.json('success');
            } else {
                return res.status(401).json("Password is incorrect");
            }
        } else {
            return res.status(404).json("User does not exist");
        }
    } catch (error) {
        console.error("Error during login:", error);
        res.status(500).json("Server error");
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token');
    return res.json('Success');
});

app.listen(port, () => {
    connect();
    console.log(`Server is running on port ${port}`);
});

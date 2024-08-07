import express from "express"
import cors from "cors"
import mongoose from "mongoose";
import bcrypt from "bcrypt"
import UserModel from "./models/UserModel.js";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";
import axios from "axios"


const port= process.env.PORT || 3001;
const app= express()


app.use(cors({
    origin:["https://authfullstack-front.vercel.app"],
    methods:["GET", "POST"],
    credentials:true
}))
app.use(cookieParser())

app.use(express.json())



const connect=async()=>{
    try {
        await mongoose.connect('mongodb+srv://dhokmangesh678:mangesh123@authcluster.b6rng.mongodb.net/authdb?retryWrites=true&w=majority&appName=authcluster')
        console.log("connected to server")
    } catch (error) {
        console.log(error);
    }
} 

app.post('/register', (req, res)=>{
    const {name, username, password}= req.body;
    bcrypt.hash(password, 10).then(hash=>{
        UserModel.create({name, username, password:hash})
        .then(user=>res.json(user))
        .catch(err=>res.json(err))
    }).catch(err=>console.log(err))
  
})
app.post('/login', async (req, res) => {
    const { username, password, captchaValue } = req.body;

    try {
        // Verify CAPTCHA
        const captchaResponse = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: "6LfDUyEqAAAAAKjnPNdcyvHh4KGiUz4UyQ3kfq5X", // Replace with your reCAPTCHA secret key
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
                const token = jwt.sign({ username: user.username, userId: user._id }, "jwt-secret-key", { expiresIn: '1d' });
                res.cookie('token', token, {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
                    sameSite: 'None', // Required for cross-origin cookies
                    maxAge: 24 * 60 * 60 * 1000 // 1 day
                });
                return res.json('success');
            } else {
                return res.status(401).json("Password is incorrect");
            }
        } else {
            return res.status(404).json("User does not exist");
        }
    } catch (error) {
        console.error(error);
        res.status(500).json("Server error");
    }
});

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json('Success')
})

app.listen(port, ()=>{
    connect()
    console.log("Server is Running ", port);

})
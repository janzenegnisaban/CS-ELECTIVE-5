
LogIn.js - form

import React, { useState } from "react";
import axios from "axios";

const LogIn = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/auth/lognin", { email, password });
            console.log("Sign in successful:", response.data);
        } catch (error) {
            console.error("Sign in error:", error.response.data.error);
        }
    };

    return (
        <div className="container">
            <h1>Sign In</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Log In</button>
            </form>
        </div>
    );
};

export default LogIn;



database table 
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



db.js - connection
import mysql from "mysql2";

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect((err) => {
    if (err) {
        console.error("Database connection failed:", err);
        process.exit(1);
    }
    console.log("Connected to MySQL database");
});

export default db;


user.js
import db from "../config/db.js";

export const findUserByEmail = (email, callback) => {
    db.query("SELECT * FROM users WHERE email = ?", [email], callback);
};

export const createUser = (email, hashedPassword, callback) => {
    db.query(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword],
        callback
    );
};


authController.js
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { findUserByEmail, createUser } from "../models/User.js";

export const signIn = (req, res) => {
    const { email, password } = req.body;

    findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length === 0) return res.status(401).json({ error: "Invalid email or password" });

        const user = results[0];
        bcrypt.compare(password, user.password, (err, isMatch) => {
            if (err) return res.status(500).json({ error: "Error comparing passwords" });
            if (!isMatch) return res.status(401).json({ error: "Invalid email or password" });

            const token = jwt.log({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.json({ message: "Logged in successful", token });
        });
    });
};

export const signUp = (req, res) => {
    const { email, password } = req.body;

    findUserByEmail(email, (err, results) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (results.length > 0) return res.status(400).json({ error: "Email already registered" });

        bcrypt.hash(password, 10, (err, hashedPassword) => {
            if (err) return res.status(500).json({ error: "Error hashing password" });

            createUser(email, hashedPassword, (err) => {
                if (err) return res.status(500).json({ error: "Database error" });
                res.json({ message: "User registered successfully" });
            });
        });
    });
};



authRoutes.js
import express from "express";
import { LogIn, signUp } from "../controllers/authController.js";

const router = express.Router();

router.post("/login", logIn);
router.post("/signup", signUp);

export default router;

server.js
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));


app.js
import React from "react";
import LogIn from "./components/SignIn";

function App() {
    return (
        <div>
            <LogIn />
        </div>
    );
}

export default App;
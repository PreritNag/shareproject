const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const userroutes = require("./routes/users");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { checkForAuthenticationCookie } = require("./middleware/authentication");

// Initialize Express app
const app = express();
const PORT = 3000;

// Connect to MongoDB
mongoose.connect("mongodb://localhost:27017/stockmoney", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected");
}).catch((err) => {
    console.error("Database connection error:", err.message);
});

// Middleware
app.use(cors({
    origin: 'http://localhost:5173', // Adjust to your frontend's origin
    credentials: true,
}));
app.use(express.json()); // Parse incoming JSON requests
app.use(express.urlencoded({ extended: false })); // Parse URL-encoded data
app.use(cookieParser()); // Parse cookies
app.use(checkForAuthenticationCookie("token")); // Custom middleware for authentication

// Routes
app.use("/user", userroutes); // User-related routes

// Start the server
app.listen(PORT, () => {
    console.log(`Server started at http://localhost:${PORT}`);
});
 
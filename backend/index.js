require("dotenv").config();
const express = require("express");
const app = express();
const port = process.env.PORT || 8000;
const mongoose = require("mongoose");
const cors = require("cors");
const songRouter = require("./router/song");
const userRouter = require("./router/users");

// List of allowed origins
const allowedOrigins = [
  "https://eternal-music.vercel.app",
  "http://localhost:5173",
];

// CORS configuration
app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (e.g., mobile apps or curl requests)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST", "PUT", "DELETE"], // HTTP methods allowed
    credentials: true, // Enable cookies and authentication headers
  })
);

app.use(express.json());

// Database connection
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log("Error Connecting to Database:", err));

// Serve static files
const path = require("path");
app.use("/public", express.static(path.join(__dirname, "./public")));
app.use(express.urlencoded({ extended: false }));

// Routers
app.use("/songs", songRouter);
app.use("/users", userRouter);

// Home route
app.get("/", (req, res) => {
  res.json({
    message: "This is home route",
  });
});


// Error handling middleware
app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong" } = err;
  res.status(statusCode).json({
    message: message,
  });
});

// Start the server
app.listen(port, () => {
  console.log(`The server is running at ${port}`);
});

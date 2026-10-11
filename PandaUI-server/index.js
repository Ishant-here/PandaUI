const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const connectDB = require("./Config/db");
const authRoutes = require("./Routes/auth.routes");
const userRoutes = require("./Routes/user.routes");
const componentRouter = require("./Routes/component.routes");
const paymentRoutes = require("./Routes/payment.routes");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(cookieParser());

// Health
app.get("/", (req, res) => res.send("PandaUI server running"));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/component", componentRouter);
app.use("/api/payment", paymentRoutes);

// DB + server
connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
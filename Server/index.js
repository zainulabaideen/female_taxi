require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const path = require("path");
const app = express();
const authRoutes = require("./routes/authRoutes");
const allowedOrigins = [
  "http://localhost:5173",
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS................"));
    }
  },
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use("/api/auth", authRoutes);


    


const PORT = process.env.PORT || 4343;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
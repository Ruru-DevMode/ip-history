const express = require("express");
const axios = require("axios");
const cors = require("cors");
const mysql = require("mysql2");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const secret = process.env.JWT_SECRET;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

const verifyToken = (req, res, next) => {
  const token = req.headers["x-access-token"];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      console.error("Failed to verify token:", err);
      return res.status(401).json({ error: "Unauthorized: Failed to verify token" });
    }
    req.user = decoded;
    next();
  });
};

app.get("/api/ip", verifyToken, async (req, res) => {
  try {
    const ipAddress =
      req.query.ip ||
      (await axios.get("https://api.ipify.org?format=json")).data.ip;
    const geoResponse = await axios.get(`https://ipinfo.io/${ipAddress}/geo`);
    const geoData = geoResponse.data;

    if (geoData.loc) {
      const [latitude, longitude] = geoData.loc.split(",");
      geoData.latitude = latitude;
      geoData.longitude = longitude;
    } else {
      console.log("loc property is missing");
    }

    res.json(geoData);
  } catch (error) {
    console.error("Error fetching IP/geo information:", error);
    res.status(500).json({ error: "Failed to fetch IP/geo information" });
  }
});

// Endpoint to fetch all history data
app.get("/history", verifyToken, (req, res) => {
  const query = `SELECT * FROM history`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error fetching history data:", err);
      return res.status(500).json({ error: "Failed to fetch history data" });
    }

    res.json(result);
  });
});


// Login endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password are required" });
  }

  try {
    const query = `
      SELECT * FROM users WHERE email = ?
    `;

    const [rows] = await db.promise().query(query, [email]);

    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ auth: true, token: token, userId: user.id });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

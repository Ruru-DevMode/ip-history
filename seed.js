const mysql = require("mysql2");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

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

  const seedUser = {
    email: "admin@sample.com",
    password: "123456",
  };

  bcrypt.hash(seedUser.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error("Error hashing password:", err);
      return;
    }

    const insertQuery = `
      INSERT INTO users (email, password)
      VALUES (?, ?)
    `;

    db.query(insertQuery, [seedUser.email, hashedPassword], (err, result) => {
      if (err) {
        console.error("Error seeding initial user:", err);
        return;
      }

      console.log("Initial user seeded successfully.");
      process.exit();
    });
  });
});

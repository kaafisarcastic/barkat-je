import mysql from "mysql2/promise";
import crypto from "crypto";

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { email, otp } = req.body;

  try {
    const connection = await mysql.createConnection(dbConfig);
    const [rows] = await connection.execute(
      "SELECT * FROM invites WHERE (yourEmail=? OR partnerEmail=?) AND otp=? ORDER BY createdAt DESC LIMIT 1",
      [email, email, otp]
    );

    if (rows.length && Date.now() < rows[0].expiresAt) {
      // Generate and store test token
      const testToken = crypto.randomBytes(32).toString("hex");
      await connection.execute("UPDATE invites SET test_token=? WHERE id=?", [
        testToken,
        rows[0].id,
      ]);
      await connection.end();

      res.json({ success: true, testToken, inviteId: rows[0].id });
    } else {
      await connection.end();
      res.json({ success: false });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: "Server error" });
  }
}

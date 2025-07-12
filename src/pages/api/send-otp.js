import mysql from "mysql2/promise";
import nodemailer from "nodemailer";

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  try {
    console.log("Request body:", req.body);
    if (req.method !== "POST") return res.status(405).end();

    const { yourName, yourEmail, partnerName, partnerEmail } = req.body;
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 3 * 60 * 1000; // 3 mins

    const connection = await mysql.createConnection(dbConfig);
    const [result] = await connection.execute(
      "INSERT INTO invites (yourName, yourEmail, partnerName, partnerEmail, otp, expiresAt) VALUES (?, ?, ?, ?, ?, ?)",
      [yourName, yourEmail, partnerName, partnerEmail, otp, expiresAt]
    );
    await connection.end();

    const inviteId = result.insertId;
    const testToken = Buffer.from(`${yourEmail}:${otp}`).toString("base64");
    const testLink = `${process.env.NEXT_PUBLIC_BASE_URL}/test/${inviteId}/${testToken}`;

    // Send OTP to both emails
    await transporter.sendMail({
      to: [yourEmail, partnerEmail],
      subject: "Your Barkat App Verification Code",
      text: `Hello,\n\nYour OTP code is: ${otp}\n\nAccess your questionnaire here: ${testLink}\n\nIt will expire in 3 minutes.`,
    });

    res.status(200).json({ success: true });
  } catch (err) {
    console.error("API error:", err); // This will show the error in your terminal
    res.status(500).json({ success: false, error: err.message });
  }
}

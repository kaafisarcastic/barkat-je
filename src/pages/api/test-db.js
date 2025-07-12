import mysql from "mysql2/promise";

export default async function handler(req, res) {
  try {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
    });

    await connection.query("SELECT 1");
    await connection.end();

    res
      .status(200)
      .json({ success: true, message: "MySQL connected successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
}

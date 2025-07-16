import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { userId } = req.body;

  if (!userId || typeof userId !== "string") {
    return res.status(400).json({ success: false, message: "Invalid userId" });
  }

  try {
    const connection = await mysql.createConnection(dbConfig);

    await connection.execute("INSERT IGNORE INTO users (id) VALUES (?)", [
      userId,
    ]);

    await connection.end();

    return res.status(200).json({ success: true, message: "User saved" });
  } catch (error) {
    console.error("Error saving user:", error);
    return res
      .status(500)
      .json({ success: false, message: "Server error", error: error.message });
  }
}

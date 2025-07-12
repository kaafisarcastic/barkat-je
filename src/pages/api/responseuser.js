import mysql from "mysql2/promise";

const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res
      .status(405)
      .json({ success: false, message: "Method not allowed" });
  }

  const { inviteId } = req.query;

  if (typeof inviteId !== "string" || inviteId.trim() === "") {
    return res
      .status(400)
      .json({ success: false, message: "Missing or invalid inviteId" });
  }

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT DISTINCT user_id FROM responses WHERE invite_id = ?",
      [inviteId]
    );

    await connection.end();

    return res.status(200).json({
      success: true,
      users: rows.map((row) => row.user_id),
    });
  } catch (error) {
    console.error("Error fetching userIds:", error);

    if (connection) await connection.end();

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

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

  const { userId } = req.query;

  if (typeof userId !== "string") {
    return res
      .status(400)
      .json({ success: false, message: "Missing or invalid userId" });
  }

  let connection;

  try {
    connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(
      "SELECT invite_id, user_id, question_number, answer, selected_option, type FROM responses WHERE user_id = ? ORDER BY question_number ASC",
      [userId]
    );

    await connection.end();

    return res.status(200).json({
      success: true,
      responses: rows,
    });
  } catch (error) {
    console.error("Error fetching responses:", error);

    if (connection) {
      await connection.end();
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

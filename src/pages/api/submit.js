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

  const { inviteId, userId, type, answers } = req.body;

  if (
    typeof inviteId !== "string" ||
    typeof userId !== "string" ||
    typeof type !== "string" ||
    !Array.isArray(answers)
  ) {
    return res
      .status(400)
      .json({ success: false, message: "Missing or invalid data" });
  }

  let connection;

  try {
    console.log("Connecting to the database...");
    connection = await mysql.createConnection(dbConfig);

    await connection.beginTransaction(); // Start transaction

    // Optional: Clear previous responses if needed
    // await connection.execute(
    //   "DELETE FROM responses WHERE invite_id = ? AND user_id = ? AND type = ?",
    //   [inviteId, userId, type]
    // );

    const insertQuery = `
      INSERT INTO responses (invite_id, user_id, question_number, answer, selected_option, type)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    for (const response of answers) {
      const { questionNumber, answer, selectedOption } = response;

      if (
        typeof questionNumber !== "number" ||
        typeof answer !== "string" ||
        typeof selectedOption !== "string"
      ) {
        console.warn("Skipping invalid response:", response);
        continue;
      }

      await connection.execute(insertQuery, [
        inviteId,
        userId,
        questionNumber,
        answer,
        selectedOption,
        type,
      ]);
    }

    await connection.commit(); // Commit the transaction
    await connection.end();

    return res
      .status(200)
      .json({ success: true, message: "Responses submitted successfully" });
  } catch (error) {
    console.error("Error submitting responses:", error);

    if (connection) {
      await connection.rollback(); // Rollback on error
      await connection.end();
    }

    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
}

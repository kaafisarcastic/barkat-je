import mysql from "mysql2/promise";
const dbConfig = {
  host: process.env.MYSQL_HOST,
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
};

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).end();

  try {
    const connection = await mysql.createConnection(dbConfig);

    const [rows] = await connection.execute(`
      SELECT 
        q.id as question_id, 
        q.question_text, 
        qo.id as option_id, 
        qo.option_text 
      FROM questions q
      LEFT JOIN question_options qo ON qo.question_id = q.id
      ORDER BY q.id, qo.id
    `);

    await connection.end();

    // Group options under each question
    const questionMap = {};

    rows.forEach((row) => {
      if (!questionMap[row.question_id]) {
        questionMap[row.question_id] = {
          id: row.question_id,
          question_text: row.question_text,
          options: [],
        };
      }
      if (row.option_id && row.option_text) {
        questionMap[row.question_id].options.push(row.option_text);
      }
    });

    const questions = Object.values(questionMap);
    res.status(200).json({ success: true, questions });
  } catch (error) {
    console.error("DB Error:", error);
    res.status(500).json({ success: false, error: error.message });
  }
}
